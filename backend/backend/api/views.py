from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password, check_password
from .models import UserDetail, Admin
from .serializers import (
    UserRegistrationSerializer, 
    AdminRegistrationSerializer,
    UserLoginSerializer,
    AdminLoginSerializer,
    UserProfileSerializer,
    AdminProfileSerializer
)
from .permissions import IsAuthenticatedCustom, IsUserAuthenticated, IsAdminAuthenticated

@api_view(['POST'])
@permission_classes([AllowAny])
def user_register(request):
    """User registration endpoint"""
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        
        # Generate JWT tokens
        refresh = RefreshToken()
        refresh['user_id'] = user.id
        refresh['user_type'] = 'user'
        refresh['email'] = user.user_email
        
        return Response({
            'message': 'User registered successfully',
            'user': UserProfileSerializer(user).data,
            'tokens': {
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            }
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def admin_register(request):
    """Admin registration endpoint"""
    serializer = AdminRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        admin = serializer.save()
        
        # Generate JWT tokens
        refresh = RefreshToken()
        refresh['user_id'] = admin.id
        refresh['user_type'] = 'admin'
        refresh['email'] = admin.admin_email
        
        return Response({
            'message': 'Admin registered successfully',
            'admin': AdminProfileSerializer(admin).data,
            'tokens': {
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            }
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def user_login(request):
    """User login endpoint"""
    serializer = UserLoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        
        # Generate JWT tokens
        refresh = RefreshToken()
        refresh['user_id'] = user.id
        refresh['user_type'] = 'user'
        refresh['email'] = user.user_email
        
        return Response({
            'message': 'Login successful',
            'user': UserProfileSerializer(user).data,
            'tokens': {
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            }
        }, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def admin_login(request):
    """Admin login endpoint"""
    serializer = AdminLoginSerializer(data=request.data)
    if serializer.is_valid():
        admin = serializer.validated_data['admin']
        
        # Generate JWT tokens
        refresh = RefreshToken()
        refresh['user_id'] = admin.id
        refresh['user_type'] = 'admin'
        refresh['email'] = admin.admin_email
        
        return Response({
            'message': 'Login successful',
            'admin': AdminProfileSerializer(admin).data,
            'tokens': {
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            }
        }, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def logout(request):
    """Logout endpoint - blacklist the refresh token"""
    try:
        refresh_token = request.data.get('refresh_token')
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Refresh token required'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsUserAuthenticated])
def user_profile(request):
    """Get user profile"""
    try:
        user_id = request.user.id
        user = UserDetail.objects.get(id=user_id, is_user_deleted=False)
        serializer = UserProfileSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except UserDetail.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAdminAuthenticated])
def admin_profile(request):
    """Get admin profile"""
    try:
        admin_id = request.user.id
        admin = Admin.objects.get(id=admin_id, is_admin_deleted=False)
        serializer = AdminProfileSerializer(admin)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Admin.DoesNotExist:
        return Response({'error': 'Admin not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['PUT'])
@permission_classes([IsUserAuthenticated])
def update_user_profile(request):
    """Update user profile"""
    try:
        user_id = request.user.id
        user = UserDetail.objects.get(id=user_id, is_user_deleted=False)
        serializer = UserProfileSerializer(user, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Profile updated successfully',
                'user': serializer.data
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except UserDetail.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['PUT'])
@permission_classes([IsAdminAuthenticated])
def update_admin_profile(request):
    """Update admin profile"""
    try:
        admin_id = request.user.id
        admin = Admin.objects.get(id=admin_id, is_admin_deleted=False)
        serializer = AdminProfileSerializer(admin, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Profile updated successfully',
                'admin': serializer.data
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Admin.DoesNotExist:
        return Response({'error': 'Admin not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([AllowAny])
def test_endpoint(request):
    """Test endpoint to verify API is working"""
    return Response({
        'message': 'API is working!',
        'status': 'success'
    }, status=status.HTTP_200_OK)
