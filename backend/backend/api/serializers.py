from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from .models import *

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
                
                # Check if account is deleted
                if user.is_user_deleted:
                    raise serializers.ValidationError('Account has been deleted')
                
                # Check password
                from django.contrib.auth.hashers import check_password
                if check_password(password, user.user_password):
                    attrs['user'] = user
                    return attrs
                else:
                    raise serializers.ValidationError('Invalid password')
            except UserDetail.DoesNotExist:
                raise serializers.ValidationError('User not registered')
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
                
                # Check if account is deleted
                if admin.is_admin_deleted:
                    raise serializers.ValidationError('Account has been deleted')
                
                # Check password
                from django.contrib.auth.hashers import check_password
                if check_password(password, admin.admin_password):
                    attrs['admin'] = admin
                    return attrs
                else:
                    raise serializers.ValidationError('Invalid password')
            except Admin.DoesNotExist:
                raise serializers.ValidationError('Admin not registered')
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

class QuestionListSerializer(serializers.ModelSerializer):
    user = serializers.CharField(source='user.username', read_only=True)
    upvotes = serializers.SerializerMethodField()
    answer_count = serializers.SerializerMethodField()

    class Meta:
        model = Question
        fields = ['id', 'question_title', 'question_description', 'question_tag', 'user', 'upvotes', 'answer_count', 'timestamp']

    def get_upvotes(self, obj):
        return Upvote.objects.filter(question=obj).count()

    def get_answer_count(self, obj):
        return Answer.objects.filter(question=obj).count()

class UserMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserDetail
        fields = ['id', 'username', 'user_email', 'reputation']

class CommentSerializer(serializers.ModelSerializer):
    user = UserMiniSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'user', 'comment_content', 'timestamp']

class AnswerUpvoteSerializer(serializers.ModelSerializer):
    by_user = UserMiniSerializer(read_only=True)

    class Meta:
        model = Upvote
        fields = ['id', 'upvote_count', 'by_user']

class AnswerSerializer(serializers.ModelSerializer):
    user = UserMiniSerializer(read_only=True)
    comments = serializers.SerializerMethodField()
    upvotes = serializers.SerializerMethodField()

    class Meta:
        model = Answer
        fields = ['id', 'user', 'answer_description', 'comments', 'upvotes']

    def get_comments(self, obj):
        comments = Comment.objects.filter(answer=obj, comment_deleted=False)
        return CommentSerializer(comments, many=True).data

    def get_upvotes(self, obj):
        upvotes = Upvote.objects.filter(answer=obj)
        return AnswerUpvoteSerializer(upvotes, many=True).data

class QuestionUpvoteSerializer(serializers.ModelSerializer):
    by_user = UserMiniSerializer(read_only=True)

    class Meta:
        model = Upvote
        fields = ['id', 'upvote_count', 'by_user']

class QuestionDetailSerializer(serializers.ModelSerializer):
    user = UserMiniSerializer(read_only=True)
    answers = serializers.SerializerMethodField()
    upvotes = serializers.SerializerMethodField()

    class Meta:
        model = Question
        fields = ['id', 'user', 'question_title', 'question_description', 'question_tag', 'answers', 'upvotes']

    def get_answers(self, obj):
        answers = Answer.objects.filter(question=obj, answer_deleted=False)
        return AnswerSerializer(answers, many=True).data

    def get_upvotes(self, obj):
        upvotes = Upvote.objects.filter(question=obj)
        return QuestionUpvoteSerializer(upvotes, many=True).data

class QuestionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['question_title', 'question_description', 'question_tag']
