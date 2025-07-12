from rest_framework import permissions

class IsAuthenticatedCustom(permissions.BasePermission):
    """
    Custom permission class that works with our UserDetail and Admin models.
    """
    
    def has_permission(self, request, view):
        # Check if user exists and is authenticated
        if hasattr(request, 'user') and request.user:
            # Check if user has is_authenticated property
            if hasattr(request.user, 'is_authenticated'):
                return request.user.is_authenticated
            # If no is_authenticated property, check if it's not None
            return request.user is not None
        return False

class IsUserAuthenticated(permissions.BasePermission):
    """
    Permission class specifically for UserDetail authentication.
    """
    
    def has_permission(self, request, view):
        if hasattr(request, 'user') and request.user:
            # Check if user is a UserDetail instance
            from .models import UserDetail
            if isinstance(request.user, UserDetail):
                return not request.user.is_user_deleted
        return False

class IsAdminAuthenticated(permissions.BasePermission):
    """
    Permission class specifically for Admin authentication.
    """
    
    def has_permission(self, request, view):
        if hasattr(request, 'user') and request.user:
            # Check if user is an Admin instance
            from .models import Admin
            if isinstance(request.user, Admin):
                return not request.user.is_admin_deleted
        return False 