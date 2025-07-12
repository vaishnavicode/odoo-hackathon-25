from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    # Test endpoint
    path('test/', views.test_endpoint, name='test_endpoint'),
    
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

]
