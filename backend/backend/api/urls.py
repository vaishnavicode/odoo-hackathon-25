from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    
    # Authentication endpoints
    path('auth/user/register/', views.user_register, name='user_register'),
    path('auth/admin/register/', views.admin_register, name='admin_register'),
    path('auth/user/login/', views.user_login, name='user_login'),
    path('auth/admin/login/', views.admin_login, name='admin_login'),
    path('auth/logout/', views.logout, name='logout'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Profile endpoints
    path('auth/user/profile/', views.user_profile, name='user_profile'),
    path('auth/admin/profile/', views.admin_profile, name='admin_profile'),
    path('auth/user/profile/update/', views.update_user_profile, name='update_user_profile'),
    path('auth/admin/profile/update/', views.update_admin_profile, name='update_admin_profile'),

    # Admin user management
    path('auth/admin/user/<int:user_id>/', views.admin_view_user_profile, name='admin_view_user_profile'),
    path('auth/admin/user/<int:user_id>/update/', views.admin_update_user_profile, name='admin_update_user_profile'),
    
    # Delete endpoints
    path('auth/user/delete/', views.delete_user, name='delete_user'),
    path('auth/admin/delete/', views.delete_admin, name='delete_admin'),
    path('auth/admin/delete-user/<int:user_id>/', views.delete_user_by_admin, name='delete_user_by_admin'),

    # Question endpoints
    path('questions/', views.QuestionListView.as_view(), name='question-list'),
    path('questions/<int:question_id>/', views.question_detail, name='question-detail'),
    path('questions/ask/', views.post_question, name='post-question'),
    path('questions/<int:question_id>/update/', views.update_question, name='update-question'),
    path('questions/<int:question_id>/delete/', views.delete_question, name='delete-question'),

    # Upvote endpoints
    path('upvote/', views.toggle_upvote, name='toggle-upvote'),

    # Answer endpoints
    path('answers/<int:answer_id>/', views.answer_detail, name='answer_detail'),
    path('questions/<int:question_id>/answers/', views.post_answer, name='post_answer'),
    path('answers/<int:answer_id>/update/', views.update_answer, name='update_answer'),
    path('answers/<int:answer_id>/delete/', views.delete_answer, name='delete_answer'),

    # Comment endpoints
    path('comment/add/', views.add_comment, name='add_comment'),
    path('comment/edit/<int:comment_id>/', views.edit_comment, name='edit_comment'),
    path('comment/delete/<int:comment_id>/', views.delete_comment, name='delete_comment'),



]
