from typing import Any
from rest_framework.views import exception_handler
from rest_framework import status
from rest_framework.exceptions import (
    ValidationError,
    AuthenticationFailed,
    NotAuthenticated,
    PermissionDenied,
    NotFound,
    Throttled,
    ErrorDetail,
)
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from .responses import api_response
from .response_codes import ECNS, EC
from .logger_setup import log_exception


def extract_error_details(
    *,
    detail: Any,
    namespace,
    fallback_code,
) -> dict[str, list[dict]]:

    def normalize(value):

        # ---- already structured from api_err() ----
        if isinstance(value, dict) and "err_code" in value:
            code = str(value["err_code"])
            params = value.get("err_params")

        else:
            if isinstance(value, ErrorDetail):
                value = value.code or str(value)

            code = str(value) if value else fallback_code
            params = None

        # ---- namespace injection ----
        if not code.startswith(f"{namespace}."):
            code = f"{namespace}.{code}"

        out = {"code": code}
        if params:
            out["params"] = params

        return out

    # ---- dict = field mapping ----
    if isinstance(detail, dict):
        out: dict[str, list[dict]] = {}

        for field, items in detail.items():
            if not isinstance(items, (list, tuple)):
                items = [items]

            out[field] = [normalize(item) for item in items]

        return out

    # ---- list = global ----
    if isinstance(detail, (list, tuple)):
        return {"_global": [normalize(item) for item in detail]}

    return {"_global": [normalize(detail)]}


def get_error_code(*, errors, namespace, fallback_code) -> str:

    if errors:
        for items in errors.values():
            if items:
                return items[0]["code"]

    return f"{namespace}.{fallback_code}"


def custom_exception_handler(exc: Exception, context: dict):

    try:
        raw_detail = getattr(exc, "detail", None)
        # ---- TOKEN ----
        if isinstance(exc, (InvalidToken, TokenError)):
            return api_response(
                success=False,
                code=f"{ECNS.TOKEN}.{EC.Token.GENERIC}",
                http_status=status.HTTP_401_UNAUTHORIZED,
            )

        # ---- AUTH FAILED ----
        if isinstance(exc, AuthenticationFailed):
            errors = extract_error_details(
                detail=raw_detail,
                namespace=ECNS.AUTH_FAILED,
                fallback_code=EC.AuthFailed.GENERIC,
            )
            return api_response(
                success=False,
                code=get_error_code(
                    errors=errors,
                    namespace=ECNS.AUTH_FAILED,
                    fallback_code=EC.AuthFailed.GENERIC,
                ),
                errors=errors,
                http_status=status.HTTP_401_UNAUTHORIZED,
            )

        # ---- NOT AUTHENTICATED ----
        if isinstance(exc, NotAuthenticated):
            errors = extract_error_details(
                detail=raw_detail,
                namespace=ECNS.NOT_AUTH,
                fallback_code=EC.NotAuth.GENERIC,
            )
            return api_response(
                success=False,
                code=get_error_code(
                    errors=errors,
                    namespace=ECNS.NOT_AUTH,
                    fallback_code=EC.NotAuth.GENERIC,
                ),
                errors=errors,
                http_status=status.HTTP_401_UNAUTHORIZED,
            )

        # ---- VALIDATION ----
        if isinstance(exc, ValidationError):
            errors = extract_error_details(
                detail=raw_detail,
                namespace=ECNS.VALIDATION,
                fallback_code=EC.Validation.GENERIC,
            )
            return api_response(
                success=False,
                code=get_error_code(
                    errors=errors,
                    namespace=ECNS.VALIDATION,
                    fallback_code=EC.Validation.GENERIC,
                ),
                errors=errors,
                http_status=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

        # ---- PERMISSION ----
        if isinstance(exc, PermissionDenied):
            code = f"{ECNS.FORBIDDEN}.{EC.Forbidden.GENERIC}"
            return api_response(
                success=False,
                code=code,
                errors={"_global": [code]},
                http_status=status.HTTP_403_FORBIDDEN,
            )

        # ---- NOT FOUND ----
        if isinstance(exc, NotFound):
            code = f"{ECNS.NOT_FOUND}.{EC.NotFound.GENERIC}"
            return api_response(
                success=False,
                code=code,
                errors={"_global": [code]},
                http_status=status.HTTP_404_NOT_FOUND,
            )

        # ---- THROTTLED ----
        if isinstance(exc, Throttled):
            code = f"{ECNS.RATE_LIMITED}.{EC.RateLimited.GENERIC}"
            return api_response(
                success=False,
                code=code,
                errors={"_global": [code]},
                http_status=status.HTTP_429_TOO_MANY_REQUESTS,
            )

        # ---- FALLBACK TO DRF (not explicitly handled ones) ----
        response = exception_handler(exc, context)
        if response is not None:
            code = f"{ECNS.API_ERROR}.{EC.ApiError.GENERIC}"
            log_exception(exc, context)
            return api_response(
                success=False,
                code=code,
                errors={"_global": [code]},
                http_status=getattr(response, "status_code", status.HTTP_400_BAD_REQUEST),
            )

    # ---- SERVER ERROR ----
    except Exception as handler_exc:
        code = f"{ECNS.SERVER}.{EC.ServerError.GENERIC}"
        log_exception(handler_exc, context)
        return api_response(
            success=False,
            code=code,
            errors={"_global": [code]},
            http_status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
