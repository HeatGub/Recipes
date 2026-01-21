from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .serializers import EmailOrUsernameTokenObtainPairSerializer
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny
from rest_framework import status
from config.responses import api_response
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.exceptions import APIException, ErrorDetail


class CookieTokenRefreshView(TokenRefreshView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        refresh = request.COOKIES.get("refresh_token")

        if not refresh:
            raise AuthenticationFailed(code="AUTH_NO_REFRESH_COOKIE")

        serializer = self.get_serializer(data={"refresh": refresh})
        serializer.is_valid(raise_exception=True)

        response = Response(serializer.validated_data, status=status.HTTP_200_OK)

        new_refresh = response.data.pop("refresh", None)
        if new_refresh:
            response.set_cookie(
                key="refresh_token",
                value=new_refresh,
                httponly=True,
                secure=False,   # DEBUG 🔴 - False on localhost
                samesite="Lax",
                path="/",
            )

        response.data = api_response(
            success=True,
            code="AUTH_TOKEN_REFRESHED",
            data=response.data,
        ).data

        return response


class LoginView(TokenObtainPairView):
    serializer_class = EmailOrUsernameTokenObtainPairSerializer
    permission_classes = [AllowAny]

    def finalize_response(self, request, response, *args, **kwargs):
        """
        - Put refresh token into HttpOnly cookie
        - Return standardized JSON with access token
        """
        if response.status_code != status.HTTP_200_OK:
            return super().finalize_response(request, response, *args, **kwargs)

        data = response.data
        refresh_token = data.pop("refresh", None)

        if refresh_token:
            response.set_cookie(
                key="refresh_token",
                value=refresh_token,
                httponly=True,
                secure=False,  # DEBUG - True in prod
                samesite="Lax",
                path="/",
            )

        response.data = api_response(
            success=True,
            code="AUTH_LOGIN_SUCCESS",
            data=data,
        ).data

        return super().finalize_response(request, response, *args, **kwargs)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.COOKIES.get("refresh_token")

        if refresh_token:
            try:
                RefreshToken(refresh_token).blacklist()
            except Exception as exc:
                raise exc

        response = api_response(
            success=True,
            code="AUTH_LOGOUT_SUCCESS",
        )
        response.delete_cookie("refresh_token")

        return response