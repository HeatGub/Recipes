from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework.exceptions import AuthenticationFailed
from django.core.validators import validate_email
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework_simplejwt.tokens import RefreshToken
from config.response_codes import EC
from rest_framework.exceptions import ValidationError

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

    def validate(self, attrs):
        username = attrs.get("username")
        email = attrs.get("email")
        password = attrs.get("password")
        password_confirm = attrs.get("password_confirm")

        errors = {}

        # ---- REQUIRED ----
        if not username:
            errors["username"] = [EC.Validation.BLANK]

        if not password:
            errors["password"] = [EC.Validation.BLANK]

        if not password_confirm:
            errors["password_confirm"] = [EC.Validation.BLANK]

        if errors:
            raise ValidationError(errors)

        # ---- PASSWORDS MATCH ----
        if password != password_confirm:
            raise ValidationError({"password_confirm": [EC.Validation.PASSWORD_MISMATCH]})
        
        # ---- USERNAME UNIQUE ----
        if User.objects.filter(username__iexact=username).exists():
            raise AuthenticationFailed({"username": [EC.AuthFailed.USERNAME_TAKEN]})

        # ---- EMAIL CHECKS (optional) ----
        if email:
            try:
                validate_email(email)
            except DjangoValidationError:
                raise ValidationError({"email": [EC.Validation.INVALID_EMAIL]})

            if User.objects.filter(email__iexact=email).exists():
                raise AuthenticationFailed({"email": [EC.AuthFailed.EMAIL_TAKEN]})

        # ---- CREATE USER ----
        user = User.objects.create_user(
            username=username,
            email=email if email else "",
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