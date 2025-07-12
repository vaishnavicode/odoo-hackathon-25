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
    """Delete user account (soft delete)"""
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

        return Response(
            {"message": "User account deleted successfully"}, status=status.HTTP_200_OK
        )

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
    """Admin can delete any user account"""
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

        return Response(
            {"message": f"User {user.username} deleted successfully by admin"},
            status=status.HTTP_200_OK,
        )

    except Admin.DoesNotExist:
        return Response({"error": "Admin not found"}, status=status.HTTP_404_NOT_FOUND)
    except UserDetail.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)


@api_view(["GET"])
@permission_classes([AllowAny])
def test_endpoint(request):
    """Test endpoint to verify API is working"""
    return Response(
        {"message": "API is working!", "status": "success"}, status=status.HTTP_200_OK
    )


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
        return Response(
            {"error": "Either question_id or answer_id is required"},
            status=status.HTTP_400_BAD_REQUEST,
        )


# Answer management views
@api_view(["POST"])
@permission_classes([IsUserAuthenticated])
def post_answer(request, question_id):
    """Post a new answer to a question (User only)"""
    try:
        question = Question.objects.get(id=question_id, question_deleted=False)
    except Question.DoesNotExist:
        return Response(
            {"error": "Question not found"}, status=status.HTTP_404_NOT_FOUND
        )

    serializer = AnswerCreateSerializer(data=request.data)
    if serializer.is_valid():
        answer = serializer.save(user=request.user, question=question)

        # Create notifications for new answer
        create_answer_notification(answer)

        return Response(
            {
                "message": "Answer posted successfully",
                "answer": AnswerSerializer(answer).data,
            },
            status=status.HTTP_201_CREATED,
        )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["PUT"])
@permission_classes([IsUserAuthenticated])
def update_answer(request, answer_id):
    """Update an answer (Only by the author)"""
    try:
        answer = Answer.objects.get(id=answer_id, answer_deleted=False)
    except Answer.DoesNotExist:
        return Response({"error": "Answer not found"}, status=status.HTTP_404_NOT_FOUND)

    if answer.user != request.user:
        return Response(
            {"error": "You can only update your own answers"},
            status=status.HTTP_403_FORBIDDEN,
        )

    serializer = AnswerCreateSerializer(answer, data=request.data, partial=True)
    if serializer.is_valid():
        answer = serializer.save()
        return Response(
            {
                "message": "Answer updated successfully",
                "answer": AnswerSerializer(answer).data,
            },
            status=status.HTTP_200_OK,
        )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["DELETE"])
@permission_classes([IsUserAuthenticated])
def delete_answer(request, answer_id):
    """Delete an answer (Only by the author or admin)"""
    try:
        answer = Answer.objects.get(id=answer_id, answer_deleted=False)
    except Answer.DoesNotExist:
        return Response({"error": "Answer not found"}, status=status.HTTP_404_NOT_FOUND)

    # Check if user is the author or an admin
    if answer.user != request.user and not hasattr(request.user, "admin_email"):
        return Response(
            {"error": "You can only delete your own answers"},
            status=status.HTTP_403_FORBIDDEN,
        )

    answer.answer_deleted = True
    answer.save()

    return Response(
        {"message": "Answer deleted successfully"}, status=status.HTTP_200_OK
    )


# Comment management views
@api_view(["POST"])
@permission_classes([IsUserAuthenticated])
def post_comment(request, answer_id):
    """Post a new comment on an answer (User only)"""
    try:
        answer = Answer.objects.get(id=answer_id, answer_deleted=False)
    except Answer.DoesNotExist:
        return Response({"error": "Answer not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = CommentCreateSerializer(data=request.data)
    if serializer.is_valid():
        comment = serializer.save(user=request.user, answer=answer)

        # Create notifications for new comment
        create_comment_notification(comment)

        return Response(
            {
                "message": "Comment posted successfully",
                "comment": CommentSerializer(comment).data,
            },
            status=status.HTTP_201_CREATED,
        )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["PUT"])
@permission_classes([IsUserAuthenticated])
def update_comment(request, comment_id):
    """Update a comment (Only by the author)"""
    try:
        comment = Comment.objects.get(id=comment_id)
    except Comment.DoesNotExist:
        return Response(
            {"error": "Comment not found"}, status=status.HTTP_404_NOT_FOUND
        )

    if comment.user != request.user:
        return Response(
            {"error": "You can only update your own comments"},
            status=status.HTTP_403_FORBIDDEN,
        )

    serializer = CommentCreateSerializer(comment, data=request.data, partial=True)
    if serializer.is_valid():
        comment = serializer.save()
        return Response(
            {
                "message": "Comment updated successfully",
                "comment": CommentSerializer(comment).data,
            },
            status=status.HTTP_200_OK,
        )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["DELETE"])
@permission_classes([IsUserAuthenticated])
def delete_comment(request, comment_id):
    """Delete a comment (Only by the author or admin)"""
    try:
        comment = Comment.objects.get(id=comment_id)
    except Comment.DoesNotExist:
        return Response(
            {"error": "Comment not found"}, status=status.HTTP_404_NOT_FOUND
        )

    # Check if user is the author or an admin
    if comment.user != request.user and not hasattr(request.user, "admin_email"):
        return Response(
            {"error": "You can only delete your own comments"},
            status=status.HTTP_403_FORBIDDEN,
        )

    comment.delete()

    return Response(
        {"message": "Comment deleted successfully"}, status=status.HTTP_200_OK
    )


# Notification management views
@api_view(["GET"])
@permission_classes([IsUserAuthenticated])
def get_notifications(request):
    """Get all notifications for the authenticated user"""
    notifications = Notification.objects.filter(user=request.user).order_by(
        "-timestamp"
    )

    # Add pagination
    paginator = PageNumberPagination()
    paginator.page_size = 20
    paginated_notifications = paginator.paginate_queryset(notifications, request)

    serializer = NotificationSerializer(paginated_notifications, many=True)
    return paginator.get_paginated_response(serializer.data)


@api_view(["GET"])
@permission_classes([IsUserAuthenticated])
def get_unread_notifications_count(request):
    """Get count of unread notifications for the authenticated user"""
    count = Notification.objects.filter(user=request.user, is_read=False).count()

    return Response({"unread_count": count}, status=status.HTTP_200_OK)


@api_view(["PUT"])
@permission_classes([IsUserAuthenticated])
def mark_notification_read(request, notification_id):
    """Mark a specific notification as read"""
    try:
        notification = Notification.objects.get(id=notification_id, user=request.user)
    except Notification.DoesNotExist:
        return Response(
            {"error": "Notification not found"}, status=status.HTTP_404_NOT_FOUND
        )

    notification.is_read = True
    notification.save()

    return Response(
        {"message": "Notification marked as read"}, status=status.HTTP_200_OK
    )


@api_view(["PUT"])
@permission_classes([IsUserAuthenticated])
def mark_all_notifications_read(request):
    """Mark all notifications as read for the authenticated user"""
    Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)

    return Response(
        {"message": "All notifications marked as read"}, status=status.HTTP_200_OK
    )


@api_view(["DELETE"])
@permission_classes([IsUserAuthenticated])
def delete_notification(request, notification_id):
    """Delete a specific notification"""
    try:
        notification = Notification.objects.get(id=notification_id, user=request.user)
    except Notification.DoesNotExist:
        return Response(
            {"error": "Notification not found"}, status=status.HTTP_404_NOT_FOUND
        )

    notification.delete()

    return Response(
        {"message": "Notification deleted successfully"}, status=status.HTTP_200_OK
    )


# User list endpoint for mentions
@api_view(["GET"])
@permission_classes([IsUserAuthenticated])
def get_users_list(request):
    """Get list of users for mention suggestions"""
    users = UserDetail.objects.filter(is_user_deleted=False).values("id", "username")[
        :50
    ]  # Limit to 50 users

    return Response(list(users), status=status.HTTP_200_OK)
