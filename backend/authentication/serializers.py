from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework.exceptions import AuthenticationFailed
from django.core.validators import validate_email
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework_simplejwt.tokens import RefreshToken
from config.response_codes import EC
from rest_framework.exceptions import ValidationError
from config.error_helpers import api_err_dict, remove_empty_list_fields
from config.validators import (
    validate_required,
    validate_blank,
    validate_length,
    validate_password_match,
    validate_username_unique,
    validate_email_register,
    validate_username_format
)
from config.constants import (MIN_IDENTIFIER_LEN, MAX_IDENTIFIER_LEN, MIN_PASSWORD_LEN, MAX_PASSWORD_LEN)

User = get_user_model()


class LoginSerializer(serializers.Serializer):

    identifier = serializers.CharField(required=False, allow_blank=True) # bypass DRF validator to return custom codes
    password = serializers.CharField(required=False, allow_blank=True, write_only=True)

    def validate(self, attrs):

        identifier = attrs.get("identifier")
        password = attrs.get("password")

        errors = {}

        # ---------- REQUIRED ----------
        for field in ("identifier", "password"):
            errors.setdefault(field, []).extend(validate_required(attrs, field))


        # ---------- BLANK ----------
        for field in ("identifier", "password"):
            if field in attrs:
                errors.setdefault(field, []).extend(validate_blank(attrs[field]))

        # ---------- LENGTH ----------
        if identifier:
            field_errors = validate_length(identifier, min_len=MIN_IDENTIFIER_LEN, max_len=MAX_IDENTIFIER_LEN,
                                        min_code=EC.Validation.USERNAME_TOO_SHORT, max_code=EC.Validation.USERNAME_TOO_LONG)
            errors.setdefault("identifier", []).extend(field_errors)
        
        if password:
            field_errors = validate_length(password, min_len=MIN_PASSWORD_LEN, max_len=MAX_PASSWORD_LEN,
                                        min_code=EC.Validation.PASSWORD_TOO_SHORT, max_code=EC.Validation.PASSWORD_TOO_LONG)
            errors.setdefault("password", []).extend(field_errors)

        errors = remove_empty_list_fields(errors)

        if errors:
            raise ValidationError(errors)

        try:
            validate_email(identifier)
            user = User.objects.get(email__iexact=identifier)
        except (DjangoValidationError, User.DoesNotExist):
            user = User.objects.filter(username__iexact=identifier).first()
            if not user:
                raise AuthenticationFailed({"_global": [api_err_dict(EC.AuthFailed.INVALID_CREDENTIALS),]})

        if not user.check_password(password):
            raise AuthenticationFailed({"_global": [api_err_dict(EC.AuthFailed.INVALID_CREDENTIALS),]})

        if not user.is_active:
            raise AuthenticationFailed({"_global": [api_err_dict(EC.AuthFailed.ACCOUNT_DISABLED),]})

        refresh = RefreshToken.for_user(user)

        return {
            "refresh": str(refresh),
            "access_token": str(refresh.access_token),
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
            },
        }


class RegisterSerializer(serializers.Serializer):

    username = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    email = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    password = serializers.CharField(required=False, allow_blank=True, allow_null=True, write_only=True)
    password_confirm = serializers.CharField(required=False, allow_blank=True, allow_null=True, write_only=True)

    def validate(self, attrs):

        username = attrs.get("username")
        email = attrs.get("email")
        password = attrs.get("password")
        password_confirm = attrs.get("password_confirm")

        errors = {}

        # ---------- REQUIRED ----------
        for field in ("username", "password", "password_confirm"):
            errors.setdefault(field, []).extend(validate_required(attrs, field))

        # ---------- BLANK ----------
        for field in ("username", "password", "password_confirm"):
            if field in attrs:
                errors.setdefault(field, []).extend(validate_blank(attrs[field]))

        # ---------- LENGTH ----------
        if username:
            field_errors = validate_length(username, min_len=MIN_IDENTIFIER_LEN, max_len=MAX_IDENTIFIER_LEN,
                                        min_code=EC.Validation.USERNAME_TOO_SHORT, max_code=EC.Validation.USERNAME_TOO_LONG)
            errors.setdefault("username", []).extend(field_errors)

        if password:
            field_errors = validate_length(password, min_len=MIN_PASSWORD_LEN, max_len=MAX_PASSWORD_LEN,
                                        min_code=EC.Validation.PASSWORD_TOO_SHORT, max_code=EC.Validation.PASSWORD_TOO_LONG)
            errors.setdefault("password", []).extend(field_errors)

        # ---------- PASSWORD MATCH ----------
        if password and password_confirm:
            errors.setdefault("password_confirm", []).extend(validate_password_match(password, password_confirm))

        # ---------- USERNAME UNIQUE ----------
        errors.setdefault("username", []).extend(validate_username_unique(username))

        # ---------- USERNAME FORMAT ----------
        errors.setdefault("username", []).extend(validate_username_format(username))

        # ---------- EMAIL (optional) ----------
        errors["email"] = validate_email_register(email)
        
        errors = remove_empty_list_fields(errors)

        if errors:
            raise ValidationError(errors)

        # # ---------- CREATE ----------
        # user = User.objects.create_user(
        #     username=username,
        #     email=email or "",
        #     password=password,
        # )

        # refresh = RefreshToken.for_user(user)

        # return {
        #     "refresh": str(refresh),
        #     "access_token": str(refresh.access_token),
        #     "user": {
        #         "id": user.id,
        #         "username": user.username,
        #         "email": user.email,
        #     },

        return {
            "refresh": "test",
            "access_token": "test",
            "user": {
                "id": "test",
                "username": "test",
                "email": "test",
            },
        }