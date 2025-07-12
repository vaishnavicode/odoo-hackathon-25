from rest_framework import status, generics, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password, check_password
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from .models import *
from .serializers import *
from .permissions import *
from .utils import *


@api_view(["POST"])
@permission_classes([AllowAny])
def user_register(request):
    """User registration endpoint"""
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()

        return Response(
            {
                "message": "User registered successfully",
                "user": UserProfileSerializer(user).data,
            },
            status=status.HTTP_201_CREATED,
        )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([AllowAny])
def admin_register(request):
    """Admin registration endpoint"""
    serializer = AdminRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        admin = serializer.save()

        return Response(
            {
                "message": "Admin registered successfully",
                "admin": AdminProfileSerializer(admin).data,
            },
            status=status.HTTP_201_CREATED,
        )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([AllowAny])
def user_login(request):
    """User login endpoint"""
    serializer = UserLoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data["user"]

        # Generate JWT tokens
        refresh = RefreshToken()
        refresh["user_id"] = user.id
        refresh["user_type"] = "user"
        refresh["email"] = user.user_email

        return Response(
            {
                "message": "Login successful",
                "user": UserProfileSerializer(user).data,
                "tokens": {
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                },
            },
            status=status.HTTP_200_OK,
        )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([AllowAny])
def admin_login(request):
    """Admin login endpoint"""
    serializer = AdminLoginSerializer(data=request.data)
    if serializer.is_valid():
        admin = serializer.validated_data["admin"]

        # Generate JWT tokens
        refresh = RefreshToken()
        refresh["user_id"] = admin.id
        refresh["user_type"] = "admin"
        refresh["email"] = admin.admin_email

        return Response(
            {
                "message": "Login successful",
                "admin": AdminProfileSerializer(admin).data,
                "tokens": {
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                },
            },
            status=status.HTTP_200_OK,
        )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([AllowAny])
def logout(request):
    """Logout endpoint - blacklist the refresh token"""
    try:
        refresh_token = request.data.get("refresh_token")
        if not refresh_token:
            return Response(
                {"error": "Refresh token required"}, status=status.HTTP_400_BAD_REQUEST
            )

        # Validate and blacklist the token
        token = RefreshToken(refresh_token)
        token.blacklist()

        return Response({"message": "Logout successful"}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response(
            {"error": "Invalid or expired refresh token", "details": str(e)},
            status=status.HTTP_400_BAD_REQUEST,
        )


@api_view(["GET"])
@permission_classes([IsUserAuthenticated])
def user_profile(request):
    """Get user profile"""
    try:
        user_id = request.user.id
        user = UserDetail.objects.get(id=user_id)

        # Check if account is deleted
        if user.is_user_deleted:
            return Response(
                {"error": "Account has been deleted"}, status=status.HTTP_404_NOT_FOUND
            )

        serializer = UserProfileSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except UserDetail.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)


@api_view(["GET"])
@permission_classes([IsAdminAuthenticated])
def admin_profile(request):
    """Get admin profile"""
    try:
        admin_id = request.user.id
        admin = Admin.objects.get(id=admin_id)

        # Check if account is deleted
        if admin.is_admin_deleted:
            return Response(
                {"error": "Account has been deleted"}, status=status.HTTP_404_NOT_FOUND
            )

        serializer = AdminProfileSerializer(admin)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Admin.DoesNotExist:
        return Response({"error": "Admin not found"}, status=status.HTTP_404_NOT_FOUND)


@api_view(["PUT"])
@permission_classes([IsUserAuthenticated])
def update_user_profile(request):
    """Update user profile"""
    try:
        user_id = request.user.id
        user = UserDetail.objects.get(id=user_id)

        # Check if account is deleted
        if user.is_user_deleted:
            return Response(
                {"error": "Cannot update deleted account"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = UserProfileSerializer(user, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Profile updated successfully", "user": serializer.data},
                status=status.HTTP_200_OK,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except UserDetail.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)


@api_view(["PUT"])
@permission_classes([IsAdminAuthenticated])
def update_admin_profile(request):
    """Update admin profile"""
    try:
        admin_id = request.user.id
        admin = Admin.objects.get(id=admin_id)

        # Check if account is deleted
        if admin.is_admin_deleted:
            return Response(
                {"error": "Cannot update deleted account"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = AdminProfileSerializer(admin, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Profile updated successfully", "admin": serializer.data},
                status=status.HTTP_200_OK,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Admin.DoesNotExist:
        return Response({"error": "Admin not found"}, status=status.HTTP_404_NOT_FOUND)


@api_view(["DELETE"])
@permission_classes([IsUserAuthenticated])
def delete_user(request):
    """Delete user account (soft delete), soft-delete all their questions and answers, and delete all their notifications."""
    try:
        user_id = request.user.id
        user = UserDetail.objects.get(id=user_id)

        # Check if account is already deleted
        if user.is_user_deleted:
            return Response(
                {"error": "Account already deleted"}, status=status.HTTP_400_BAD_REQUEST
            )

        # Soft delete the user
        user.is_user_deleted = True
        user.save()
        
        # Soft delete all questions by this user
        Question.objects.filter(user=user, question_deleted=False).update(question_deleted=True)
        # Soft delete all answers by this user
        Answer.objects.filter(user=user, answer_deleted=False).update(answer_deleted=True)
        
        # Delete all notifications for this user (as recipient or mention)
        Notification.objects.filter(user=user).delete()
        Notification.objects.filter(mention_by=user).delete()
        
        return Response({
            'message': 'User account, all their questions, and answers deleted successfully'
        }, status=status.HTTP_200_OK)
        
    except UserDetail.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)


@api_view(["DELETE"])
@permission_classes([IsAdminAuthenticated])
def delete_admin(request):
    """Delete admin account (soft delete)"""
    try:
        admin_id = request.user.id
        admin = Admin.objects.get(id=admin_id)

        # Check if account is already deleted
        if admin.is_admin_deleted:
            return Response(
                {"error": "Account already deleted"}, status=status.HTTP_400_BAD_REQUEST
            )

        # Soft delete the admin
        admin.is_admin_deleted = True
        admin.save()

        return Response(
            {"message": "Admin account deleted successfully"}, status=status.HTTP_200_OK
        )

    except Admin.DoesNotExist:
        return Response({"error": "Admin not found"}, status=status.HTTP_404_NOT_FOUND)


@api_view(["DELETE"])
@permission_classes([IsAdminAuthenticated])
def delete_user_by_admin(request, user_id):
    """Admin can delete any user account, soft-delete all their questions and answers, and delete all their notifications."""
    try:
        # Check if the current user is an admin
        admin = Admin.objects.get(id=request.user.id)

        # Check if admin account is deleted
        if admin.is_admin_deleted:
            return Response(
                {"error": "Admin account has been deleted"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Find the user to delete
        user = UserDetail.objects.get(id=user_id)

        # Check if user account is already deleted
        if user.is_user_deleted:
            return Response(
                {"error": "User account already deleted"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Soft delete the user
        user.is_user_deleted = True
        user.save()
        
        # Soft delete all questions by this user
        Question.objects.filter(user=user, question_deleted=False).update(question_deleted=True)
        # Soft delete all answers by this user
        Answer.objects.filter(user=user, answer_deleted=False).update(answer_deleted=True)
        
        # Delete all notifications for this user (as recipient or mention)
        Notification.objects.filter(user=user).delete()
        Notification.objects.filter(mention_by=user).delete()
        
        return Response({
            'message': f'User {user.username}, all their questions, and answers deleted successfully by admin'
        }, status=status.HTTP_200_OK)
        
    except Admin.DoesNotExist:
        return Response({"error": "Admin not found"}, status=status.HTTP_404_NOT_FOUND)
    except UserDetail.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsAdminAuthenticated])
def admin_view_user_profile(request, user_id):
    """Admin can view any user's profile"""
    try:
        user = UserDetail.objects.get(id=user_id)
        if user.is_user_deleted:
            return Response({'error': 'User account has been deleted'}, status=status.HTTP_404_NOT_FOUND)
        serializer = UserProfileSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except UserDetail.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['PUT'])
@permission_classes([IsAdminAuthenticated])
def admin_update_user_profile(request, user_id):
    """Admin can update any user's profile"""
    try:
        user = UserDetail.objects.get(id=user_id)
        if user.is_user_deleted:
            return Response({'error': 'Cannot update deleted user account'}, status=status.HTTP_400_BAD_REQUEST)
        serializer = UserProfileSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'User profile updated successfully by admin',
                'user': serializer.data
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except UserDetail.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    
class QuestionListPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = "page_size"
    max_page_size = 100


class QuestionListView(generics.ListAPIView):
    queryset = Question.objects.filter(question_deleted=False).select_related("user")
    serializer_class = QuestionListSerializer
    pagination_class = QuestionListPagination

    filter_backends = [
        DjangoFilterBackend,
        filters.OrderingFilter,
        filters.SearchFilter,
    ]

    filterset_fields = ["user", "question_tag"]

    ordering_fields = ["question_title", "question_tag"]

    ordering = ["id"]

    search_fields = ["question_title", "question_description"]
    permission_classes = [AllowAny]


@api_view(["GET"])
@permission_classes([AllowAny])
def question_detail(request, question_id):
    """Detailed view of a question with answers, comments, upvotes, and users"""
    try:
        question = Question.objects.get(id=question_id, question_deleted=False)
        serializer = QuestionDetailSerializer(question)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Question.DoesNotExist:
        return Response(
            {"error": "Question not found"}, status=status.HTTP_404_NOT_FOUND
        )


@api_view(["POST"])
@permission_classes([IsUserAuthenticated])
def post_question(request):
    """Post a new question (User only)"""
    serializer = QuestionCreateSerializer(data=request.data)
    if serializer.is_valid():
        question = serializer.save(user=request.user)

        create_mention_notifications(question)

        return Response(
            {
                "message": "Question posted successfully",
                "question_id": question.id,
                "question": serializer.data,
            },
            status=status.HTTP_201_CREATED,
        )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["PUT"])
@permission_classes([IsUserAuthenticated])
def update_question(request, question_id):
    """Update a question (Only by the author)"""
    try:
        question = Question.objects.get(id=question_id, question_deleted=False)

        if question.user != request.user:
            return Response(
                {"error": "You are not allowed to edit this question"},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = QuestionCreateSerializer(question, data=request.data, partial=True)

        if serializer.is_valid():
            updated_question = serializer.save()

            create_mention_notifications(updated_question)

            return Response(
                {
                    "message": "Question updated successfully",
                    "question": serializer.data,
                },
                status=status.HTTP_200_OK,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Question.DoesNotExist:
        return Response(
            {"error": "Question not found"}, status=status.HTTP_404_NOT_FOUND
        )


@api_view(["DELETE"])
@permission_classes([IsUserAuthenticated, IsAdminAuthenticated])
def delete_question(request, question_id):
    """
    Delete a question (only author or admin).
    Soft-delete by setting question_deleted = True.
    """
    try:
        question = Question.objects.get(id=question_id, question_deleted=False)
        question.question_deleted = True
        question.save()

        return Response(
            {"message": "Question deleted successfully"}, status=status.HTTP_200_OK
        )

    except Question.DoesNotExist:
        return Response(
            {"error": "Question not found"}, status=status.HTTP_404_NOT_FOUND
        )


@api_view(["POST"])
@permission_classes([IsUserAuthenticated])
def toggle_upvote(request):
    """
    POST API to upvote (+1) or remove upvote (-1) on a question or answer.
    Required fields: vote (+1 or -1), and either question_id or answer_id.
    """
    vote = request.data.get("vote")
    question_id = request.data.get("question_id")
    answer_id = request.data.get("answer_id")
    user = request.user

    if vote not in [1, -1]:
        return Response(
            {"error": "Invalid vote. Must be +1 or -1."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if question_id:
        try:
            question = Question.objects.get(id=question_id, question_deleted=False)
        except Question.DoesNotExist:
            return Response(
                {"error": "Question not found"}, status=status.HTTP_404_NOT_FOUND
            )

        existing = Upvote.objects.filter(question=question, by_user=user).first()

        if vote == 1:
            if existing:
                return Response(
                    {"message": "Already upvoted"}, status=status.HTTP_200_OK
                )
            Upvote.objects.create(question=question, by_user=user)
            return Response(
                {"message": "Upvoted successfully"}, status=status.HTTP_201_CREATED
            )
        else:
            if existing:
                existing.delete()
                return Response(
                    {"message": "Upvote removed"}, status=status.HTTP_200_OK
                )
            return Response(
                {"message": "No upvote to remove"}, status=status.HTTP_200_OK
            )

    elif answer_id:
        try:
            answer = Answer.objects.get(id=answer_id, answer_deleted=False)
        except Answer.DoesNotExist:
            return Response(
                {"error": "Answer not found"}, status=status.HTTP_404_NOT_FOUND
            )

        existing = Upvote.objects.filter(answer=answer, by_user=user).first()

        if vote == 1:
            if existing:
                return Response(
                    {"message": "Already upvoted"}, status=status.HTTP_200_OK
                )
            Upvote.objects.create(answer=answer, by_user=user)
            return Response(
                {"message": "Upvoted successfully"}, status=status.HTTP_201_CREATED
            )
        else:
            if existing:
                existing.delete()
                return Response(
                    {"message": "Upvote removed"}, status=status.HTTP_200_OK
                )
            return Response(
                {"message": "No upvote to remove"}, status=status.HTTP_200_OK
            )

    else:
        return Response({'error': 'Either question_id or answer_id is required'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsUserAuthenticated])
def add_comment(request):
    """
    Add a comment to an answer (User only).
    Required fields: answer_id, comment_content
    """
    answer_id = request.data.get('answer_id')
    comment_content = request.data.get('comment_content')

    if not answer_id or not comment_content:
        return Response({'error': 'answer_id and comment_content are required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        answer = Answer.objects.get(id=answer_id, answer_deleted=False)
    except Answer.DoesNotExist:
        return Response({'error': 'Answer not found'}, status=status.HTTP_404_NOT_FOUND)

    comment = Comment.objects.create(
        answer=answer,
        user=request.user,
        comment_content=comment_content
    )

    return Response({
        'message': 'Comment added successfully',
        'comment': CommentSerializer(comment).data
    }, status=status.HTTP_201_CREATED)

@api_view(['PUT'])
@permission_classes([IsUserAuthenticated])
def edit_comment(request, comment_id):
    """
    Edit a comment (only by the author).
    Required field: comment_content
    """
    try:
        comment = Comment.objects.get(id=comment_id, comment_deleted=False)
    except Comment.DoesNotExist:
        return Response({'error': 'Comment not found'}, status=status.HTTP_404_NOT_FOUND)

    if comment.user != request.user:
        return Response({'error': 'You are not allowed to edit this comment'}, status=status.HTTP_403_FORBIDDEN)

    new_content = request.data.get('comment_content')
    if not new_content:
        return Response({'error': 'comment_content is required'}, status=status.HTTP_400_BAD_REQUEST)

    comment.comment_content = new_content
    comment.save()

    return Response({
        'message': 'Comment updated successfully',
        'comment': CommentSerializer(comment).data
    }, status=status.HTTP_200_OK)

@api_view(['DELETE'])
@permission_classes([IsUserAuthenticated, IsAdminAuthenticated])
def delete_comment(request, comment_id):
    """
    Soft-delete a comment (only by the author).
    """
    try:
        comment = Comment.objects.get(id=comment_id, comment_deleted=False)
    except Comment.DoesNotExist:
        return Response({'error': 'Comment not found'}, status=status.HTTP_404_NOT_FOUND)

    if comment.user != request.user:
        return Response({'error': 'You are not allowed to delete this comment'}, status=status.HTTP_403_FORBIDDEN)

    comment.comment_deleted = True
    comment.save()

    return Response({'message': 'Comment deleted successfully'}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([AllowAny])
def answer_detail(request, answer_id):
    """View a single answer by its ID"""
    try:
        answer = Answer.objects.get(id=answer_id, answer_deleted=False)
        serializer = AnswerSerializer(answer)
        return Response(serializer.data, status=200)
    except Answer.DoesNotExist:
        return Response({'error': 'Answer not found'}, status=404)
    
@api_view(['POST'])
@permission_classes([IsUserAuthenticated])
def post_answer(request, question_id):
    """Post a new answer to a question (User only)"""
    try:
        question = Question.objects.get(id=question_id, question_deleted=False)
    except Question.DoesNotExist:
        return Response({'error': 'Question not found'}, status=404)
    serializer = AnswerCreateSerializer(data=request.data)
    if serializer.is_valid():
        answer = serializer.save(user=request.user, question=question)
    if serializer.is_valid():
        answer = serializer.save(user=request.user)
        # Notification logic for mentions in answer_description
        # create_mention_notifications(answer)
        return Response({
            'message': 'Answer posted successfully',
            'answer': AnswerSerializer(answer).data
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([IsUserAuthenticated])
def update_answer(request, answer_id):
    """Update an answer (only by the author or admin)"""
    try:
        answer = Answer.objects.get(id=answer_id)
        if answer.answer_deleted:
            return Response({'error': 'Answer already deleted'}, status=status.HTTP_400_BAD_REQUEST)
        # Only the author or admin can update
        if request.user != answer.user and not hasattr(request.user, 'is_admin_deleted'):
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        serializer = AnswerUpdateSerializer(answer, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            # Notification logic for mentions in answer_description
            # create_mention_notifications(answer)
            return Response({
                'message': 'Answer updated successfully',
                'answer': AnswerSerializer(answer).data
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Answer.DoesNotExist:
        return Response({'error': 'Answer not found'}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['DELETE'])
@permission_classes([IsUserAuthenticated, IsAdminAuthenticated])
def delete_answer(request, answer_id):
    """Delete an answer (soft delete, only by the author or admin)"""
    try:
        answer = Answer.objects.get(id=answer_id)
        if answer.answer_deleted:
            return Response({'error': 'Answer already deleted'}, status=status.HTTP_400_BAD_REQUEST)
        # Only the author or admin can delete
        if request.user != answer.user and not hasattr(request.user, 'is_admin_deleted'):
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        answer.answer_deleted = True
        answer.save()
        # Delete all notifications related to this answer
        Notification.objects.filter(answer=answer).delete()
        return Response({'message': 'Answer deleted successfully'}, status=status.HTTP_200_OK)
    except Answer.DoesNotExist:
        return Response({'error': 'Answer not found'}, status=status.HTTP_404_NOT_FOUND)
