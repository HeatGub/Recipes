from config.constants import (
    MAX_IDENTIFIER_LEN,
    MAX_PASSWORD_LEN,
    MIN_IDENTIFIER_LEN,
    MIN_PASSWORD_LEN,
)
from config.error_helpers import api_err_dict, remove_empty_list_fields
from config.response_codes import EC
from config.validators import (
    validate_blank,
    validate_email_register,
    validate_length,
    validate_password_match,
    validate_required,
    validate_username_format,
    validate_username_unique,
)
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError as DjangoValidationError
from django.core.validators import validate_email
from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed, ValidationError
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import AbstractUser
from typing import cast, Type
from django.conf import settings

User = cast(Type[AbstractUser], get_user_model())
cookie = settings.AUTH_COOKIE

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
            field_errors = validate_length(
                identifier,
                min_len=MIN_IDENTIFIER_LEN,
                max_len=MAX_IDENTIFIER_LEN,
                min_code=EC.Validation.USERNAME_TOO_SHORT,
                max_code=EC.Validation.USERNAME_TOO_LONG,
            )
            errors.setdefault("identifier", []).extend(field_errors)

        if password:
            field_errors = validate_length(
                password,
                min_len=MIN_PASSWORD_LEN,
                max_len=MAX_PASSWORD_LEN,
                min_code=EC.Validation.PASSWORD_TOO_SHORT,
                max_code=EC.Validation.PASSWORD_TOO_LONG,
            )
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

        refresh_token = RefreshToken.for_user(user)

        return {
            cookie["NAME"]: str(refresh_token),
            "access_token": str(refresh_token.access_token),
            "user": {
                "id": user.pk,
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

        # ---------- CREATE ----------
        user = User.objects.create_user(
            username=username,
            email=email if email else None,
            password=password,
        )

        refresh_token = RefreshToken.for_user(user)

        return {
            cookie["NAME"]: str(refresh_token),
            "access_token": str(refresh_token.access_token),
            "user": {
                "id": user.pk,
                "username": user.username,
                "email": user.email,
            }
        }
    

class DeleteAccountSerializer(serializers.Serializer):

    password = serializers.CharField(required=False, allow_blank=True, write_only=True)

    def validate(self, attrs):
        request = self.context["request"]
        user = request.user
        password = attrs.get("password")

        errors = {}

        # ---------- REQUIRED ----------
        errors.setdefault("password", []).extend(validate_required(attrs, "password"))

        # ---------- BLANK ----------
        if "password" in attrs:
            errors.setdefault("password", []).extend(validate_blank(password))

        # ---------- LENGTH ----------
        if password:
            field_errors = validate_length(
                password,
                min_len=MIN_PASSWORD_LEN,
                max_len=MAX_PASSWORD_LEN,
                min_code=EC.Validation.PASSWORD_TOO_SHORT,
                max_code=EC.Validation.PASSWORD_TOO_LONG,
            )
            errors.setdefault("password", []).extend(field_errors)

        errors = remove_empty_list_fields(errors)

        if errors:
            raise ValidationError(errors)

        # ---------- PASSWORD CHECK ----------
        if not user.check_password(password):
            raise AuthenticationFailed({
                "password": [
                    api_err_dict(EC.AuthFailed.INVALID_PASSWORD)
                ],
                "_toast": [
                    api_err_dict(EC.AuthFailed.INVALID_PASSWORD)
                ]
            })
        
        return attrs


class ChangePasswordSerializer(serializers.Serializer):

    current_password = serializers.CharField(required=False, allow_blank=True, write_only=True)
    new_password = serializers.CharField(required=False, allow_blank=True, allow_null=True, write_only=True)
    new_password_confirm = serializers.CharField(required=False, allow_blank=True, allow_null=True, write_only=True)

    def validate(self, attrs):
        request = self.context["request"]
        user = request.user
        current_password = attrs.get("current_password")
        new_password = attrs.get("new_password")
        new_password_confirm = attrs.get("new_password_confirm")

        errors = {}

        # ---------- REQUIRED ----------
        for field in ("current_password", "new_password", "new_password_confirm"):
            errors.setdefault(field, []).extend(validate_required(attrs, field))

        # ---------- BLANK ----------
        for field in ("current_password", "new_password", "new_password_confirm"):
            if field in attrs:
                errors.setdefault(field, []).extend(validate_blank(attrs[field]))

        # ---------- LENGTH ----------
        if new_password:
            field_errors = validate_length(
                new_password,
                min_len=MIN_PASSWORD_LEN,
                max_len=MAX_PASSWORD_LEN,
                min_code=EC.Validation.PASSWORD_TOO_SHORT,
                max_code=EC.Validation.PASSWORD_TOO_LONG,
            )
            errors.setdefault("new_password", []).extend(field_errors)
        
        # ---------- PASSWORD MATCH ----------
        if new_password and new_password_confirm:
            errors.setdefault("new_password_confirm", []).extend(validate_password_match(new_password, new_password_confirm))

        # ---------- NEW != CURRENT ----------
        if new_password == current_password:
            errors.setdefault("new_password", []).append(api_err_dict(EC.Validation.PASSWORD_SAME_AS_OLD))

        errors = remove_empty_list_fields(errors)

        if errors:
            raise ValidationError(errors)

        # ---------- PASSWORD CHECK ----------
        if not user.check_password(current_password):
            raise AuthenticationFailed({
                "current_password": [
                    api_err_dict(EC.AuthFailed.INVALID_PASSWORD)
                ],
            })
        
        return attrs