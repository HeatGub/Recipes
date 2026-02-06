from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework.exceptions import AuthenticationFailed
from django.core.validators import validate_email
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework_simplejwt.tokens import RefreshToken
from config.response_codes import EC
from rest_framework.exceptions import ValidationError
from config.error_helpers import api_err_dict

User = get_user_model()


class LoginSerializer(serializers.Serializer):

    identifier = serializers.CharField(required=False, allow_blank=True) # bypass DRF validator to return custom codes
    password = serializers.CharField(required=False, allow_blank=True, write_only=True)

    def validate(self, attrs):

        identifier = attrs.get("identifier")
        password = attrs.get("password")

        errors = {}

        if not identifier:
            errors["identifier"] = [EC.Validation.BLANK]

        if not password:
            errors["password"] = [EC.Validation.BLANK]

        if errors:
            raise ValidationError(errors)

        try:
            validate_email(identifier)
            user = User.objects.get(email__iexact=identifier)
        except (DjangoValidationError, User.DoesNotExist):
            user = User.objects.filter(username__iexact=identifier).first()
            if not user:
                raise AuthenticationFailed({"_error": [EC.AuthFailed.INVALID_CREDENTIALS]})

        if not user.check_password(password):
            raise AuthenticationFailed({"_error": [EC.AuthFailed.INVALID_CREDENTIALS]})

        if not user.is_active:
            raise AuthenticationFailed({"_error": [EC.AuthFailed.ACCOUNT_DISABLED]})

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

    username = serializers.CharField(required=False, allow_blank=True)
    email = serializers.CharField(required=False, allow_blank=True)
    password = serializers.CharField(required=False, allow_blank=True, write_only=True)
    password_confirm = serializers.CharField(required=False, allow_blank=True, write_only=True)

    MIN_USERNAME_LEN = 3
    # MAX_USERNAME_LEN = 40
    MIN_PASSWORD_LEN = 3
    MAX_PASSWORD_LEN = 10

    def validate(self, attrs):

        username = attrs.get("username")
        email = attrs.get("email")
        password = attrs.get("password")
        password_confirm = attrs.get("password_confirm")

        errors = {}

        # ---------- REQUIRED ----------
        if not username:
            errors["username"] = [api_err_dict(EC.Validation.BLANK)]

        if not password:
            errors["password"] = [api_err_dict(EC.Validation.BLANK)]

        if not password_confirm:
            errors["password_confirm"] = [api_err_dict(EC.Validation.BLANK)]

        if errors:
            raise ValidationError(errors)

        # ---------- USERNAME LENGTH ----------
        if len(username) < self.MIN_USERNAME_LEN:
            errors.setdefault("username", []).append(
                api_err_dict(
                    EC.Validation.USERNAME_TOO_SHORT,
                    min=self.MIN_USERNAME_LEN,
                )
            )

        # ---------- PASSWORD LENGTH ----------
        if len(password) < self.MIN_PASSWORD_LEN:
            errors.setdefault("password", []).append(
                api_err_dict(
                    EC.Validation.PASSWORD_TOO_SHORT,
                    min=self.MIN_PASSWORD_LEN,
                )
            )

        if len(password) > self.MAX_PASSWORD_LEN:
            errors.setdefault("password", []).append(
                api_err_dict(
                    EC.Validation.PASSWORD_TOO_LONG,
                    max=self.MAX_PASSWORD_LEN,
                )
            )

        # ---------- PASSWORD MATCH ----------
        if password != password_confirm:
            errors.setdefault("password_confirm", []).append(
                api_err_dict(EC.Validation.PASSWORD_MISMATCH)
            )

        if errors:
            raise ValidationError(errors)

        # ---------- USERNAME UNIQUE ----------
        if User.objects.filter(username__iexact=username).exists():
            raise AuthenticationFailed({
                "username": [
                    api_err_dict(EC.AuthFailed.USERNAME_TAKEN),
                ]
            })

        # ---------- EMAIL ----------
        if email:
            try:
                validate_email(email)
            except DjangoValidationError:
                raise ValidationError({
                    "email": [
                        api_err_dict(EC.Validation.INVALID_EMAIL),
                    ]
                })

            if User.objects.filter(email__iexact=email).exists():
                raise AuthenticationFailed({
                    "email": [
                        api_err_dict(EC.AuthFailed.EMAIL_TAKEN),
                    ]
                })

        # ---------- CREATE ----------
        user = User.objects.create_user(
            username=username,
            email=email or "",
            password=password,
        )

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