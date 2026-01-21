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
            raise AuthenticationFailed(code="MISSING_FIELD") # code is not catched in PROD custom_exception_handler

        try:
            validate_email(identifier)
            user = User.objects.get(email__iexact=identifier)
        except (ValidationError, User.DoesNotExist):
            user = User.objects.filter(username__iexact=identifier).first()
            if not user:
                raise AuthenticationFailed(code="USER_NOT_FOUND") 

        if not user.check_password(password):
            raise AuthenticationFailed(code="WRONG_PASSWORD")
        if not user.is_active:
            raise AuthenticationFailed(code="USER_INACTIVE")

        token = self.get_token(user)
        return {
            "refresh": str(token),
            "access": str(token.access_token),
        }