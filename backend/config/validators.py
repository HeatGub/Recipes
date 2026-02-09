from django.core.validators import validate_email as validate_email_django
from django.core.exceptions import ValidationError as DjangoValidationError
from config.error_helpers import api_err_dict
from config.response_codes import EC
from django.contrib.auth import get_user_model

User = get_user_model()


def validate_required(attrs, field_name, code=EC.Validation.REQUIRED):
    """if field_name not in attrs: return [api_err_dict(code)]"""
    if field_name not in attrs:
        return [api_err_dict(code)]
    return []


def validate_blank(value, code=EC.Validation.BLANK):
    """Trigger if value is empty string or None (JS null)"""
    if value is None or value == "":
        return [api_err_dict(code)]
    return []


def validate_length(value, min_len=None, max_len=None, min_code=None, max_code=None):
    errors = []
    if min_code and (min_len is not None) and len(value) < min_len:
        errors.append(api_err_dict(min_code, min=min_len))
    if max_code and (max_len is not None) and len(value) > max_len:
        errors.append(api_err_dict(max_code, max=max_len))
    return errors


def validate_password_match(password, password_confirm):
    if password != password_confirm:
        return [api_err_dict(EC.Validation.PASSWORD_MISMATCH)]
    return []


def validate_username_unique(username):
    if User.objects.filter(username__iexact=username).exists():
        return [api_err_dict(EC.AuthFailed.USERNAME_TAKEN)]
    return []


def validate_email_register(email):
    """Checks if email is valid and not taken. Email is not required, returns empty list if not provided"""
    errors = []
    if not email:
        return errors

    try:
        validate_email_django(email)
    except DjangoValidationError:
        errors.append(api_err_dict(EC.Validation.INVALID_EMAIL))
        return errors

    if User.objects.filter(email__iexact=email).exists():
        errors.append(api_err_dict(EC.AuthFailed.EMAIL_TAKEN))

    return errors
