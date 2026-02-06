# permissions.py
from rest_framework.permissions import BasePermission
from rest_framework.exceptions import NotAuthenticated
from config.response_codes import EC
from config.error_helpers import api_err_dict

# https://github.com/encode/django-rest-framework/blob/main/rest_framework/permissions.py

class IsAuthenticatedEC(BasePermission):
    """
    Basically a copy of DRF's IsAuthenticated but raising a custom Error Code instead of returning False.
    Returns True on success.
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            raise NotAuthenticated({"_global": [api_err_dict(EC.NotAuth.USER_NOT_LOGGED_IN),]})
        return True
