from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.core.exceptions import ValidationError

# ----------------- User Manager -----------------
class UserManager(BaseUserManager):
    def create_user(self, username, user_email, user_password=None):
        if not user_email:
            raise ValueError("Users must have an email address")
        user = self.model(username=username, user_email=self.normalize_email(user_email))
        user.set_password(user_password)
        user.save(using=self._db)
        return user

# ----------------- User Model -----------------
class User(AbstractBaseUser):
    username = models.CharField(max_length=150)
    user_email = models.EmailField(unique=True)
    is_user_deleted = models.BooleanField(default=False)

    objects = UserManager()
    USERNAME_FIELD = 'user_email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.username

# ----------------- Admin Model -----------------
class Admin(models.Model):
    username = models.CharField(max_length=150)
    admin_email = models.EmailField(unique=True)
    admin_password = models.CharField(max_length=255)
    is_admin_deleted = models.BooleanField(default=False)

    def __str__(self):
        return self.username

# ----------------- Question -----------------
class Question(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    question_title = models.CharField(max_length=255)
    question_description = models.TextField()
    question_tag = models.CharField(max_length=255)
    is_deleted = models.BooleanField(default=False)

    def __str__(self):
        return self.question_title

# ----------------- Answer -----------------
class Answer(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    answer_description = models.TextField()
    is_deleted = models.BooleanField(default=False)

    def __str__(self):
        return self.answer_description[:50]

# ----------------- Upvote -----------------
class Upvote(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, null=True, blank=True, on_delete=models.CASCADE)
    answer = models.ForeignKey(Answer, null=True, blank=True, on_delete=models.CASCADE)

    def clean(self):
        if not self.question and not self.answer:
            raise ValidationError("Upvote must be linked to either a question or an answer.")
        if self.question and self.answer:
            raise ValidationError("Upvote cannot be linked to both a question and an answer.")

    def __str__(self):
        target = self.question or self.answer
        return f"{self.user} upvoted {target}"

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['user', 'question'], name='unique_question_upvote'),
            models.UniqueConstraint(fields=['user', 'answer'], name='unique_answer_upvote'),
        ]

# ----------------- Notification -----------------
class Notification(models.Model):
    user = models.ForeignKey(User, related_name='notifications', on_delete=models.CASCADE)
    question = models.ForeignKey(Question, null=True, blank=True, on_delete=models.CASCADE)
    answer = models.ForeignKey(Answer, null=True, blank=True, on_delete=models.CASCADE)
    mention_by = models.ForeignKey(User, related_name='mentions', on_delete=models.CASCADE)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"Notification for {self.user}"

# ----------------- Comment -----------------
class Comment(models.Model):
    answer = models.ForeignKey(Answer, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    comment_content = models.TextField()
    is_deleted = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.username}: {self.comment_content[:30]}"
