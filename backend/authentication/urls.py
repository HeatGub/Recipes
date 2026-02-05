from django.urls import path
from .views import *

urlpatterns = [
    path("login/", LoginView.as_view(), name="login"),
    path("token/refresh/", CookieTokenRefreshView.as_view(), name="token_refresh"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("me/", MeView.as_view(), name="auth-me"),
    path("register/", RegisterView.as_view(), name="register"),
    path("delete/", DeleteUserView.as_view(), name="delete_user")
]