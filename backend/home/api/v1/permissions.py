from rest_framework import permissions

class RecipePermission(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.settings.recipe


class ProfilePermission(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.settings.profile


class SocialPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.settings.social_feed


class DietPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.settings.diet_tracking_text


class ProgramPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.settings.program_custom