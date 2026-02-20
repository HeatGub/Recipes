from django.urls import path
from .views import (
    LoginView,
    CookieTokenRefreshView,
    LogoutView,
    MeView,
    RegisterView,
    DeleteAccountView,
    ChangePasswordView,
    ChangeUsernameView,
    ChangeEmailView,
)

urlpatterns = [
    path("login/", LoginView.as_view(), name="login"),
    path("token/refresh/", CookieTokenRefreshView.as_view(), name="token_refresh"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("register/", RegisterView.as_view(), name="register"),
    path("me/", MeView.as_view(), name="me"),
    path("me/delete/", DeleteAccountView.as_view(), name="delete_account"),
    path("me/password/", ChangePasswordView.as_view(), name="change_password"),
    path("me/username/", ChangeUsernameView.as_view(), name="change_username"),
    path("me/email/", ChangeEmailView.as_view(), name="change_email"),
]