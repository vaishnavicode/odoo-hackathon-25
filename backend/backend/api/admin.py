from django.contrib import admin
from .models import UserDetail, Admin, Question, Answer, Upvote, Notification, Comment

admin.site.register(UserDetail)
admin.site.register(Admin)
admin.site.register(Question)
admin.site.register(Answer)
admin.site.register(Upvote)
admin.site.register(Notification)
admin.site.register(Comment)
