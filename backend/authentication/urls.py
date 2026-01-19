from django.urls import path
from .views import LoginView, LogoutView, CookieTokenRefreshView

urlpatterns = [
    path("token/", LoginView.as_view(), name="token_obtain_pair"), # login
    path("token/refresh/", CookieTokenRefreshView.as_view(), name="token_refresh"),
    path("logout/", LogoutView.as_view(), name="logout"),
]