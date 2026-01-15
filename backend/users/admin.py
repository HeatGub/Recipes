from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    # Show these fields in the admin list
    list_display = ("username", "email", "theme", "language", "is_staff", "is_superuser")

    # Allow filtering by these fields
    list_filter = ("is_staff", "is_superuser", "theme", "language")

    # Fields to search in admin
    search_fields = ("username", "email")

    # Fieldsets for editing a user
    fieldsets = (
        (None, {"fields": ("username", "password")}),
        ("Preferences", {"fields": ("theme", "language", "email")}),
        ("Permissions", {"fields": ("is_active", "is_staff", "is_superuser")}),
    )

    # Fields when creating a user
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("username", "password1", "password2", "theme", "language", "email"),
        }),
    )