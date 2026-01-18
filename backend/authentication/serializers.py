from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.exceptions import AuthenticationFailed
from django.core.validators import validate_email
from django.core.exceptions import ValidationError

User = get_user_model()

class EmailOrUsernameTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = "identifier"

    def validate(self, attrs):
        identifier = attrs.get("identifier")
        password = attrs.get("password")

        if not identifier or not password:
            raise AuthenticationFailed("Missing credentials")

        try:
            validate_email(identifier)
            user = User.objects.get(email__iexact=identifier)
        except ValidationError:
            user = User.objects.filter(username__iexact=identifier).first()
            if not user:
                raise AuthenticationFailed("Invalid credentials")

        if not user.check_password(password):
            raise AuthenticationFailed("Invalid credentials")
        if not user.is_active:
            raise AuthenticationFailed("User inactive")

        token = self.get_token(user)
        return {
            "refresh": str(token),
            "access": str(token.access_token),
        }