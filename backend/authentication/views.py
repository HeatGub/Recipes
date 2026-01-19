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


class CookieTokenRefreshView(TokenRefreshView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        refresh = request.COOKIES.get("refresh_token")

        if not refresh:
            return Response(
                {"detail": "No refresh token cookie"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        # ✅ DRF-safe way to inject data
        data = request.data.copy()
        data["refresh"] = refresh
        request._full_data = data

        response = super().post(request, *args, **kwargs)

        # rotate refresh cookie
        new_refresh = response.data.pop("refresh", None)
        if new_refresh:
            response.set_cookie(
                key="refresh_token",
                value=new_refresh,
                httponly=True,
                secure=False, # 🔴 False on localhost
                samesite="Lax",
                path="/",
            )

        return response


class LoginView(TokenObtainPairView):
    serializer_class = EmailOrUsernameTokenObtainPairSerializer

    def finalize_response(self, request, response, *args, **kwargs):
        """
        Set refresh token in HttpOnly cookie
        Return access token in JSON
        """
        data = response.data
        refresh_token = data.pop("refresh", None)
        if refresh_token:
            response.set_cookie(
                key="refresh_token",
                value=refresh_token,
                httponly=True,
                secure=True, # 🔴 False on localhost
                samesite="Lax",       # or 'Strict'
                path="/",
                # max_age=7*24*3600     # optional, same as refresh lifetime
            )
        response.data = data
        return super().finalize_response(request, response, *args, **kwargs)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.COOKIES.get("refresh_token")
        if refresh_token:
            try:
                RefreshToken(refresh_token).blacklist()
            except Exception:
                pass
        response = Response({"detail": "Logged out"})
        response.delete_cookie("refresh_token")
        return response
