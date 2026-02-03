from typing import Any
from enum import StrEnum
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


def extract_error_details(detail: Any, *, namespace: ECNS, fallback_code: StrEnum | str,) -> dict[str, list[str]]:

    def coerce(value) -> str:
        if not value:
            return f"{namespace}.{fallback_code}"

        if isinstance(value, ErrorDetail):
            value = str(value)

        value = str(value)

        if value.startswith(f"{namespace}."):
            return value

        return f"{namespace}.{value}"

    if isinstance(detail, dict):
        out = {}
        for field, items in detail.items():
            if not isinstance(items, (list, tuple)):
                items = [items]
            out[field] = [coerce(item) for item in items]
        return out

    # fallbacks, should not reach those below as I'll always pass a dict on raise
    if isinstance(detail, (list, tuple)):
        return {"_error": [coerce(item) for item in detail]}

    return {"_error": [coerce(detail)]}


def get_error_code(*, errors: dict[str, list[str]] | None, namespace: ECNS, fallback_code: StrEnum | str) -> str:
    """
    Resolve global API error code.

    Priority:
        1) first EC code in errors
        2) namespace + fallback_code
    """

    if errors:
        for codes in errors.values():
            if codes:
                return codes[0]

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
            code = f"{ECNS.NOT_AUTH}.{EC.NotAuth.GENERIC}"
            return api_response(
                success=False,
                code=code,
                errors={"_error": [code]},
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
                errors={"_error": [code]},
                http_status=status.HTTP_403_FORBIDDEN,
            )

        # ---- NOT FOUND ----
        if isinstance(exc, NotFound):
            code = f"{ECNS.NOT_FOUND}.{EC.NotFound.GENERIC}"
            return api_response(
                success=False,
                code=code,
                errors={"_error": [code]},
                http_status=status.HTTP_404_NOT_FOUND,
            )

        # ---- THROTTLED ----
        if isinstance(exc, Throttled):
            code = f"{ECNS.RATE_LIMITED}.{EC.RateLimited.GENERIC}"
            return api_response(
                success=False,
                code=code,
                errors={"_error": [code]},
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
                errors={"_error": [code]},
                http_status=getattr(response, "status_code", status.HTTP_400_BAD_REQUEST),
            )

    # ---- SERVER ERROR ----
    except Exception as handler_exc:
        code = f"{ECNS.SERVER}.{EC.ServerError.GENERIC}"
        log_exception(handler_exc, context)
        return api_response(
            success=False,
            code=code,
            errors={"_error": [code]},
            http_status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
