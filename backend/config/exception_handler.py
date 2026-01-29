from typing import Any
from enum import StrEnum
import traceback
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


def extract_error_details(detail: Any) -> dict[str, list[str]]:
    """
    Normalize DRF exception detail into {field: [ERROR_CODE, ...]}
    """

    if detail is None:
        return {"_error": ["ERROR_DETAIL_UNAVAILABLE"]}

    # Helper to normalize a single code
    def normalize_code(code):
        if isinstance(code, ErrorDetail):
            code = code.code or str(code)
        return str(code).upper().replace(" ", "_")

    # Field-level dict
    if isinstance(detail, dict):
        errors = {}
        for field, items in detail.items():
            if not isinstance(items, (list, tuple)):
                items = [items]
            codes = [normalize_code(item) for item in items]
            errors[field] = codes
        return errors

    # List of errors (non-field/global)
    if isinstance(detail, (list, tuple)):
        codes = [normalize_code(item) for item in detail]
        return {"_error": codes}

    # Single ErrorDetail
    return {"_error": [normalize_code(detail)]}


def get_error_code(exc: Exception, namespace: ECNS, fallback_code: StrEnum | str): 
    """
    Resolve the public-facing API error code for a raised exception.

    Attempts to extract a DRF `ErrorDetail.code` value from the exception's
    `detail` attribute and combine it with the provided namespace to form
    a namespaced error identifier (e.g. `VALIDATION.REQUIRED`).

    If no usable error code can be extracted, the given `fallback_code`
    is used instead.

    Resolution order:
        1. Single `ErrorDetail` instance
        2. First item in a list/tuple of errors
        3. First item in a field-error mapping
        4. Fallback code

    Args:
        exc: The raised exception instance.
        namespace: Error code namespace (e.g. `ECNS.VALIDATION`).
        fallback_code: Default error code used when extraction fails.

    Returns:
    
        A fully-qualified error code string in the form:
        `<NAMESPACE>.<ERROR_CODE>`.
    """
    def add_namespace_and_normalize(code: str) -> str:
        code_str = str(code).upper().replace(" ", "_")
        return f"{namespace}.{code_str}"

    detail = getattr(exc, "detail", None)

    if isinstance(detail, ErrorDetail):
        return add_namespace_and_normalize(detail.code if detail.code else fallback_code)

    if isinstance(detail, dict):
        # take first error code
        for v in detail.values():
            if isinstance(v, (list, tuple)) and v:
                item = v[0]
                if isinstance(item, ErrorDetail):
                    return add_namespace_and_normalize(item.code if item.code else fallback_code)

    if isinstance(detail, list) and detail:
        item = detail[0]
        if isinstance(item, ErrorDetail):
            return add_namespace_and_normalize(item.code if item.code else fallback_code)

    return add_namespace_and_normalize(fallback_code)


def custom_exception_handler(exc: Exception, context: dict):
    """
    Global exception handler that:
    - Always returns api_response
    - Extracts DRF error codes automatically
    """
    try:
        # ---- TOKEN (expired / invalid / blacklisted) ----
        if isinstance(exc, (InvalidToken, TokenError)):
            return api_response(
                success = False,
                code = get_error_code(exc, ECNS.TOKEN, EC.Token.GENERIC),
                # errors={"_error": ["TOKEN_INVALID"]},
                errors = extract_error_details(getattr(exc, "detail", exc)), # debug
                http_status = status.HTTP_401_UNAUTHORIZED,
            )
        
        # ---- AUTH FAILED ----
        if isinstance(exc, AuthenticationFailed):
            return api_response(
                success=False,
                code = get_error_code(exc, ECNS.AUTH_FAILED, EC.AuthFailed.GENERIC),
                errors = extract_error_details(getattr(exc, "detail", exc)), # debug only?
                http_status = status.HTTP_401_UNAUTHORIZED,
            )

        # ---- NOT AUTHENTICATED ----
        if isinstance(exc, NotAuthenticated):
            return api_response(
                success = False,
                code = get_error_code(exc, ECNS.NOT_AUTH, EC.NotAuth.GENERIC),
                http_status = status.HTTP_401_UNAUTHORIZED,
            )

        # ---- VALIDATION ----
        if isinstance(exc, ValidationError):
            return api_response(
                success = False,
                code = get_error_code(exc, ECNS.VALIDATION, EC.Validation.GENERIC),
                errors = extract_error_details(getattr(exc, "detail", exc)),
                http_status = status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

        # ---- PERMISSION ----
        if isinstance(exc, PermissionDenied):
            return api_response(
                success = False,
                code = get_error_code(exc, ECNS.FORBIDDEN, EC.Forbidden.GENERIC),
                # errors = {"_error": ["FORBIDDEN"]},
                errors = extract_error_details(getattr(exc, "detail", exc)), # debug
                http_status = status.HTTP_403_FORBIDDEN,
            )

        # ---- NOT FOUND ----
        if isinstance(exc, NotFound):
            return api_response(
                success = False,
                code = get_error_code(exc, ECNS.NOT_FOUND, EC.NotFound.GENERIC),
                errors = {"_error": ["NOT_FOUND"]},
                http_status = status.HTTP_404_NOT_FOUND,
            )

        # ---- THROTTLING ----
        if isinstance(exc, Throttled):
            return api_response(
                success = False,
                code = get_error_code(exc, ECNS.RATE_LIMITED, EC.RateLimited.GENERIC),
                errors = {"_error": ["RATE_LIMITED"]},
                http_status = status.HTTP_429_TOO_MANY_REQUESTS,
            )

        # ---- Let DRF handle other exceptions (e.g., MethodNotAllowed, ParseError) ----
        response = exception_handler(exc, context)
        if response is not None:
            return api_response(
                success = False,
                code = get_error_code(exc, ECNS.API_ERROR, EC.ApiError.GENERIC),
                # errors={"_error": ["API_ERROR"]},
                errors = extract_error_details(getattr(response, "data", response)), # DEBUG ONLY
                http_status = getattr(response, "status_code", status.HTTP_400_BAD_REQUEST),
            )
        
    except Exception as handler_exc:
        # ---- Unhandled exceptions ----
        print(f"\nSERVER_ERROR:\n{handler_exc}\nTRACEBACK:\n\n") # DEBUG ONLY
        traceback.print_exc()  # prints full stack trace to console
        return api_response(
            success = False,
            code = get_error_code(exc, ECNS.SERVER, EC.ServerError.GENERIC),
            errors = {"_error": ["INTERNAL_SERVER_ERROR"]},
            http_status = status.HTTP_500_INTERNAL_SERVER_ERROR,
        )