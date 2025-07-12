from django.contrib import admin
from .models import User, Admin, Question, Answer, Upvote, Notification, Comment

@admin.register(Admin)
class AdminModelAdmin(admin.ModelAdmin):
    list_display = ['id', 'username', 'admin_email', 'is_admin_deleted']

@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ['id', 'question_title', 'user', 'question_tag', 'is_deleted']

@admin.register(Answer)
class AnswerAdmin(admin.ModelAdmin):
    list_display = ['id', 'question', 'user', 'is_deleted']

@admin.register(Upvote)
class UpvoteAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'question', 'answer']

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'mention_by', 'is_read']

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ['id', 'answer', 'user', 'comment_content', 'is_deleted']
