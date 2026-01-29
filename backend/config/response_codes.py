from enum import StrEnum

class ECNS(StrEnum):
    """
    Error Code NameSpaces used across the API.

    Each namespace groups related error codes and forms the first segment

    of the public-facing error identifier returned to clients.

    Examples: TOKEN.GENERIC_ERROR, VALIDATION.BLANK

    Namespaces:
        - `TOKEN`
        - `AUTH_FAILED` (AUTHENTICATION)
        - `NOT_AUTH` (AUTHENTICATED)
        - `VALIDATION`
        - `FORBIDDEN`
        - `NOT_FOUND`
        - `RATE_LIMITED`
        - `API_ERROR`
        - `SERVER`
    """
    TOKEN = "TOKEN"
    AUTH_FAILED = "AUTH_FAILED"
    NOT_AUTH = "NOT_AUTH"
    VALIDATION = "VALIDATION"
    FORBIDDEN = "FORBIDDEN"
    NOT_FOUND = "NOT_FOUND"
    RATE_LIMITED = "RATE_LIMITED"
    API_ERROR = "API_ERROR"
    SERVER = "SERVER"

class EC():
    """
    Error Codes
    """

    class Token(StrEnum):
        GENERIC = "GENERIC_ERROR"
        REFRESH_TOKEN_MISSING = "REFRESH_TOKEN_MISSING"

    class AuthFailed(StrEnum):
        GENERIC = "GENERIC_ERROR"
        MISSING_FIELD = "MISSING_FIELD"
        USER_NOT_FOUND = "USER_NOT_FOUND"
        WRONG_PASSWORD = "WRONG_PASSWORD"
        INVALID_CREDENTIALS = "INVALID_CREDENTIALS"
        ACCOUNT_DISABLED = "ACCOUNT_DISABLED"
        TOKEN_EXPIRED = "TOKEN_EXPIRED"
        REFRESH_TOKEN_MISSING = "REFRESH_TOKEN_MISSING"

    class NotAuth(StrEnum):
        GENERIC = "GENERIC_ERROR"

    class Validation(StrEnum):
        GENERIC = "GENERIC_ERROR"
        REQUIRED = "REQUIRED"
        BLANK = "BLANK"
        INVALID_EMAIL = "INVALID_EMAIL"

    class Forbidden(StrEnum):
        GENERIC = "GENERIC_ERROR"

    class NotFound(StrEnum):
        GENERIC = "GENERIC_ERROR"

    class RateLimited(StrEnum):
        GENERIC = "GENERIC_ERROR"

    class ApiError(StrEnum):
        GENERIC = "GENERIC_ERROR"

    class ServerError(StrEnum):
        GENERIC = "GENERIC_ERROR"


class SC(): # not necessary, but let's keep response codes tidy
    """
    Success Codes.

    Available Classes:
        - `Auth`
    """
    class Auth(StrEnum):
        TOKEN_REFRESHED = "AUTH.TOKEN_REFRESHED"
        LOGIN_SUCCESS = "AUTH.LOGIN_SUCCESS"
        LOGOUT_SUCCESS = "AUTH.LOGOUT_SUCCESS"



























# from enum import StrEnum

# class ECNS(StrEnum):
#     """
#     Error Code NameSpaces used across the API.

#     Each namespace groups related error codes and forms the first segment

#     of the public-facing error identifier returned to clients.

#     Examples: TOKEN.GENERIC_ERROR, VALIDATION.BLANK

#     Namespaces:
#         - `TOKEN`
#         - `AUTH_FAILED` (AUTHENTICATION)
#         - `NOT_AUTH` (AUTHENTICATED)
#         - `VALIDATION`
#         - `FORBIDDEN`
#         - `NOT_FOUND`
#         - `RATE_LIMITED`
#         - `API_ERROR`
#         - `SERVER`
#     """
#     TOKEN = "TOKEN"
#     AUTH_FAILED = "AUTH_FAILED"
#     NOT_AUTH = "NOT_AUTH"
#     VALIDATION = "VALIDATION"
#     FORBIDDEN = "FORBIDDEN"
#     NOT_FOUND = "NOT_FOUND"
#     RATE_LIMITED = "RATE_LIMITED"
#     API_ERROR = "API_ERROR"
#     SERVER = "SERVER"

# class TokenEC(StrEnum): # Token Error Codes
#     GENERIC = "GENERIC_ERROR"
#     REFRESH_TOKEN_MISSING = "REFRESH_TOKEN_MISSING"

# class AuthFailedEC(StrEnum):
#     GENERIC = "GENERIC_ERROR"
#     MISSING_FIELD = "MISSING_FIELD"
#     USER_NOT_FOUND = "USER_NOT_FOUND"
#     WRONG_PASSWORD = "WRONG_PASSWORD"
#     INVALID_CREDENTIALS = "INVALID_CREDENTIALS"
#     ACCOUNT_DISABLED = "ACCOUNT_DISABLED"
#     TOKEN_EXPIRED = "TOKEN_EXPIRED"
#     REFRESH_TOKEN_MISSING = "REFRESH_TOKEN_MISSING"

# class NotAuthEC(StrEnum):
#     GENERIC = "GENERIC_ERROR"

# class ValidationEC(StrEnum):
#     GENERIC = "GENERIC_ERROR"
#     REQUIRED = "REQUIRED"
#     BLANK = "BLANK"
#     INVALID_EMAIL = "INVALID_EMAIL"

# class ForbiddenEC(StrEnum):
#     GENERIC = "GENERIC_ERROR"

# class NotFoundEC(StrEnum):
#     GENERIC = "GENERIC_ERROR"

# class RateLimitedEC(StrEnum):
#     GENERIC = "GENERIC_ERROR"

# class ApiErrorEC(StrEnum):
#     GENERIC = "GENERIC_ERROR"

# class ServerErrorEC(StrEnum):
#     GENERIC = "GENERIC_ERROR"


# class SuccessCodes(StrEnum): # not necessary, but let's keep response codes tidy
#     AUTH_TOKEN_REFRESHED = "AUTH.TOKEN_REFRESHED"
#     AUTH_LOGIN_SUCCESS = "AUTH.LOGIN_SUCCESS"
#     AUTH_LOGOUT_SUCCESS = "AUTH.LOGOUT_SUCCESS"