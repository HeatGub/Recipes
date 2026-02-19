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

    Available Classes:
        - `Token`
        - `AuthFailed`
        - `NotAuth`
        - `Validation`
        - `Forbidden`
        - `NotFound`
        - `RateLimited`
        - `ApiError`
        - `ServerError`
    """

    class Token(StrEnum):
        GENERIC = "GENERIC_ERROR"

    class AuthFailed(StrEnum):
        GENERIC = "GENERIC_ERROR"
        INVALID_CREDENTIALS = "INVALID_CREDENTIALS"
        ACCOUNT_DISABLED = "ACCOUNT_DISABLED"
        REFRESH_TOKEN_MISSING = "REFRESH_TOKEN_MISSING"
        INVALID_PASSWORD = "INVALID_PASSWORD"

    class NotAuth(StrEnum):
        GENERIC = "GENERIC_ERROR"
        USER_NOT_LOGGED_IN = "USER_NOT_LOGGED_IN"

    class Validation(StrEnum):
        GENERIC = "GENERIC_ERROR"
        REQUIRED = "REQUIRED"
        BLANK = "BLANK"
        USERNAME_TOO_SHORT = "USERNAME_TOO_SHORT"
        USERNAME_TOO_LONG = "USERNAME_TOO_LONG"
        USERNAME_INVALID_FORMAT = "USERNAME_INVALID_FORMAT"
        INVALID_EMAIL = "INVALID_EMAIL"
        PASSWORD_TOO_SHORT = "PASSWORD_TOO_SHORT"
        PASSWORD_TOO_LONG = "PASSWORD_TOO_LONG"
        PASSWORD_MISMATCH = "PASSWORD_MISMATCH"
        EMAIL_TAKEN = "EMAIL_TAKEN"
        USERNAME_TAKEN = "USERNAME_TAKEN"
        PASSWORD_SAME_AS_OLD = "PASSWORD_SAME_AS_OLD"

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
        GENERIC = "AUTH.GENERIC_SUCCESS"
        TOKEN_REFRESHED = "AUTH.TOKEN_REFRESHED"
        LOGIN_SUCCESS = "AUTH.LOGIN_SUCCESS"
        LOGOUT_SUCCESS = "AUTH.LOGOUT_SUCCESS"
        REGISTER_SUCCESS = "AUTH.REGISTER_SUCCESS"
        USER_DELETED = "AUTH.USER_DELETED"
        PASSWORD_CHANGED = "AUTH.PASSWORD_CHANGED"
        USERNAME_CHANGED = "AUTH.USERNAME_CHANGED"
        EMAIL_CHANGED = "AUTH.EMAIL_CHANGED"