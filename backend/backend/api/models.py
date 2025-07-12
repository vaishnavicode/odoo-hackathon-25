from django.db import models

# ----------------- UserDetail -----------------
class UserDetail(models.Model):
    username = models.CharField(max_length=150)
    user_email = models.EmailField(unique=True)
    user_password = models.CharField(max_length=255)
    is_user_deleted = models.BooleanField(default=False)

    def __str__(self):
        return self.username

# ----------------- Admin -----------------
class Admin(models.Model):
    username = models.CharField(max_length=150)
    admin_email = models.EmailField(unique=True)
    admin_password = models.CharField(max_length=255)
    is_admin_deleted = models.BooleanField(default=False)

    def __str__(self):
        return self.username

# ----------------- Question -----------------
class Question(models.Model):
    user = models.ForeignKey(UserDetail, on_delete=models.CASCADE)
    question_title = models.CharField(max_length=255)
    question_description = models.TextField()
    question_tag = models.CharField(max_length=255)
    question_deleted = models.BooleanField(default=False)

    def __str__(self):
        return self.question_title

# ----------------- Answer -----------------
class Answer(models.Model):
    user = models.ForeignKey(UserDetail, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    answer_description = models.TextField()
    answer_deleted = models.BooleanField(default=False)

    def __str__(self):
        return f"Answer by {self.user.username} on Q{self.question.id}"

# ----------------- Upvote -----------------
class Upvote(models.Model):
    question = models.ForeignKey(Question, null=True, blank=True, on_delete=models.CASCADE)
    answer = models.ForeignKey(Answer, null=True, blank=True, on_delete=models.CASCADE)
    upvote_count = models.PositiveIntegerField(default=1)
    by_user = models.ForeignKey(UserDetail, on_delete=models.CASCADE)

    def __str__(self):
        return f"Upvote by {self.by_user.username}"

# ----------------- Notification -----------------
class Notification(models.Model):
    user = models.ForeignKey(UserDetail, related_name='notifications', on_delete=models.CASCADE)
    question = models.ForeignKey(Question, null=True, blank=True, on_delete=models.CASCADE)
    answer = models.ForeignKey(Answer, null=True, blank=True, on_delete=models.CASCADE)
    mention_by = models.ForeignKey(UserDetail, related_name='mentions', on_delete=models.CASCADE)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"Notification for {self.user.username}"

# ----------------- Comment -----------------
class Comment(models.Model):
    answer = models.ForeignKey(Answer, on_delete=models.CASCADE)
    user = models.ForeignKey(UserDetail, on_delete=models.CASCADE)
    comment_content = models.TextField()
    comment_deleted = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.username}: {self.comment_content[:30]}"
