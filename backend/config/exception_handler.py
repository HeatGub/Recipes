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


def extract_error_codes(detail):
    """
    Normalize DRF exception detail into {field: [ERROR_CODE, ...]}
    """

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


def custom_exception_handler(exc, context):
    """
    Global exception handler that:
    - Always returns api_response
    - Extracts DRF error codes automatically
    """

    # ---- TOKEN errors (expired / invalid / blacklisted) ----
    if isinstance(exc, (InvalidToken, TokenError)):
        return api_response(
            success=False,
            code="TOKEN_INVALID",
            errors={"_error": ["TOKEN_INVALID"]},
            http_status=status.HTTP_401_UNAUTHORIZED,
        )

    # ---- VALIDATION errors ----
    if isinstance(exc, ValidationError):
        return api_response(
            success=False,
            code="VALIDATION_ERROR",
            errors=extract_error_codes(getattr(exc, "detail", exc)),
            http_status=status.HTTP_422_UNPROCESSABLE_ENTITY,
        )

    # ---- AUTH errors ----
    if isinstance(exc, (AuthenticationFailed, NotAuthenticated)):
        return api_response(
            success=False,
            code="AUTH_FAILED",
            # errors={"_error": ["AUTH_FAILED"]},
            errors=extract_error_codes(getattr(exc, "detail", exc)), # debug only?
            http_status=status.HTTP_401_UNAUTHORIZED,
        )

    # ---- PERMISSION errors ----
    if isinstance(exc, PermissionDenied):
        return api_response(
            success=False,
            code="FORBIDDEN",
            # errors={"_error": ["FORBIDDEN"]},
            errors=extract_error_codes(getattr(exc, "detail", exc)), # debug
            http_status=status.HTTP_403_FORBIDDEN,
        )

    # ---- NOT FOUND ----
    if isinstance(exc, NotFound):
        return api_response(
            success=False,
            code="NOT_FOUND",
            errors={"_error": ["NOT_FOUND"]},
            http_status=status.HTTP_404_NOT_FOUND,
        )

    # ---- THROTTLING ----
    if isinstance(exc, Throttled):
        return api_response(
            success=False,
            code="RATE_LIMITED",
            errors={"_error": ["RATE_LIMITED"]},
            http_status=status.HTTP_429_TOO_MANY_REQUESTS,
        )

    # ---- Let DRF handle other exceptions (e.g., MethodNotAllowed, ParseError) ----
    response = exception_handler(exc, context)
    if response is not None:
        return api_response(
            success=False,
            code="API_ERROR",
            # errors={"_error": ["API_ERROR"]},
            errors=extract_error_codes(getattr(response, "data", response)), # DEBUG ONLY
            http_status=getattr(response, "status_code", status.HTTP_400_BAD_REQUEST),
        )

    # ---- Unhandled exceptions ----
    return api_response(
        success=False,
        code="SERVER_ERROR",
        errors={"_error": ["INTERNAL_SERVER_ERROR"]},
        http_status=status.HTTP_500_INTERNAL_SERVER_ERROR,
    )