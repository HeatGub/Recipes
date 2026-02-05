from rest_framework_simplejwt.views import (
    TokenRefreshView,
)
from rest_framework_simplejwt.exceptions import TokenError
from .serializers import LoginSerializer, RegisterSerializer
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny
from rest_framework import status
from config.responses import api_response
from rest_framework.exceptions import AuthenticationFailed
from config.response_codes import EC, SC
from django.conf import settings


cookie = settings.AUTH_COOKIE

class CookieTokenRefreshView(TokenRefreshView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        refresh = request.COOKIES.get("refresh_token")

        if not refresh:
            raise AuthenticationFailed(detail={"_error": [EC.AuthFailed.REFRESH_TOKEN_MISSING]})

        serializer = self.get_serializer(data={"refresh": refresh})
        serializer.is_valid(raise_exception=True)

        response = Response(serializer.validated_data, status=status.HTTP_200_OK)

        if "access" in response.data:
            response.data["access_token"] = response.data.pop("access")

        new_refresh = response.data.pop("refresh", None)
        if new_refresh:
            response.set_cookie(
                key=cookie["NAME"],
                value=new_refresh,
                httponly=cookie["HTTP_ONLY"],
                secure=cookie["SECURE"],
                samesite=cookie["SAMESITE"],
                domain=cookie["DOMAIN"],
                path=cookie["PATH"],
            )

        response.data = api_response(
            success=True,
            code=SC.Auth.TOKEN_REFRESHED,
            payload=response.data,
        ).data

        return response


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data
        refresh_token = data.pop("refresh")

        response = api_response(
            success=True,
            code=SC.Auth.LOGIN_SUCCESS,
            payload=data,
        )

        response.set_cookie(
            key=cookie["NAME"],
            value=refresh_token,
            httponly=cookie["HTTP_ONLY"],
            secure=cookie["SECURE"],
            samesite=cookie["SAMESITE"],
            domain=cookie["DOMAIN"],
            path=cookie["PATH"],
        )

        return response
    

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):

        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data
        refresh_token = data.pop("refresh")

        response = api_response(
            success=True,
            code=SC.Auth.REGISTER_SUCCESS,
            payload=data,
            http_status=status.HTTP_201_CREATED,
        )

        response.set_cookie(
            key=cookie["NAME"],
            value=refresh_token,
            httponly=cookie["HTTP_ONLY"],
            secure=cookie["SECURE"],
            samesite=cookie["SAMESITE"],
            domain=cookie["DOMAIN"],
            path=cookie["PATH"],
        )

        return response


class LogoutView(APIView):
    def post(self, request):
        refresh_token = request.COOKIES.get("refresh_token")

        if refresh_token:
            try:
                RefreshToken(refresh_token).blacklist()
            except TokenError:
                # token already expired/invalid → ignore
                pass

        response = api_response(
            success=True,
            code=SC.Auth.LOGOUT_SUCCESS,
        )
        response.delete_cookie("refresh_token")

        return response


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return api_response(
            success=True,
            code=SC.Auth.GENERIC,
            payload={"user": {
                "id": user.id,
                "username": user.username,
                "email": user.email
            }}
        )


class DeleteUserView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        user = request.user
        refresh_token = request.COOKIES.get(cookie["NAME"])

        user.delete()

        if refresh_token:
            try:
                RefreshToken(refresh_token).blacklist()
            except TokenError:
                # token already expired/invalid → ignore
                pass

        response = api_response(
            success=True,
            code=SC.Auth.USER_DELETED,
            http_status=status.HTTP_200_OK,
        )

        response.delete_cookie(cookie["NAME"])

        return response