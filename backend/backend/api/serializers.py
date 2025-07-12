from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from .models import UserDetail, Admin

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = UserDetail
        fields = ['username', 'user_email', 'password', 'password2']

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError("Passwords don't match")
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        # Hash the password before saving
        from django.contrib.auth.hashers import make_password
        validated_data['user_password'] = make_password(validated_data['password'])
        validated_data.pop('password')
        
        user = UserDetail.objects.create(
            username=validated_data['username'],
            user_email=validated_data['user_email'],
            user_password=validated_data['user_password']
        )
        return user

class AdminRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = Admin
        fields = ['username', 'admin_email', 'password', 'password2']

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError("Passwords don't match")
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        # Hash the password before saving
        from django.contrib.auth.hashers import make_password
        validated_data['admin_password'] = make_password(validated_data['password'])
        validated_data.pop('password')
        
        admin = Admin.objects.create(
            username=validated_data['username'],
            admin_email=validated_data['admin_email'],
            admin_password=validated_data['admin_password']
        )
        return admin

class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        if email and password:
            # Check if user exists
            try:
                user = UserDetail.objects.get(user_email=email)
                from django.contrib.auth.hashers import check_password
                if check_password(password, user.user_password) and not user.is_user_deleted:
                    attrs['user'] = user
                    return attrs
                else:
                    raise serializers.ValidationError('Invalid credentials')
            except UserDetail.DoesNotExist:
                raise serializers.ValidationError('Invalid credentials')
        else:
            raise serializers.ValidationError('Must include email and password')

class AdminLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        if email and password:
            # Check if admin exists
            try:
                admin = Admin.objects.get(admin_email=email)
                from django.contrib.auth.hashers import check_password
                if check_password(password, admin.admin_password) and not admin.is_admin_deleted:
                    attrs['admin'] = admin
                    return attrs
                else:
                    raise serializers.ValidationError('Invalid credentials')
            except Admin.DoesNotExist:
                raise serializers.ValidationError('Invalid credentials')
        else:
            raise serializers.ValidationError('Must include email and password')

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserDetail
        fields = ['id', 'username', 'user_email']
        read_only_fields = ['id']

class AdminProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Admin
        fields = ['id', 'username', 'admin_email']
        read_only_fields = ['id'] 