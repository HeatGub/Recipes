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
