from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from django.contrib.auth.models import AnonymousUser
from .models import UserDetail, Admin

class CustomJWTAuthentication(JWTAuthentication):
    def get_user(self, validated_token):
        """
        Returns a user that matches the payload's user id and type.
        """
        try:
            user_id = validated_token['user_id']
            user_type = validated_token.get('user_type', 'user')
            
            if user_type == 'user':
                user = UserDetail.objects.get(id=user_id, is_user_deleted=False)
            elif user_type == 'admin':
                user = Admin.objects.get(id=user_id, is_admin_deleted=False)
            else:
                raise InvalidToken('Invalid user type')
                
            return user
        except (UserDetail.DoesNotExist, Admin.DoesNotExist):
            raise InvalidToken('User not found')
        except Exception as e:
            raise InvalidToken('Token is invalid or expired')
    
    def authenticate(self, request):
        """
        Override to handle custom user types properly.
        """
        try:
            return super().authenticate(request)
        except Exception as e:
            # If authentication fails, return None (anonymous user)
            return None 