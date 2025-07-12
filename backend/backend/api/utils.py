import re
from .models import *


def create_mention_notifications(question):
    """
    Find all @username mentions in question_title and question_description.
    For each valid username, create a Notification entry for that user.
    """
    text_to_search = f"{question.question_title} {question.question_description}"
    mentions = re.findall(r"@(\w+)", text_to_search)

    unique_mentions = set(mentions)

    for username in unique_mentions:
        try:
            mentioned_user = UserDetail.objects.get(
                username=username, is_user_deleted=False
            )

            # Don't notify the user if they mention themselves
            if mentioned_user != question.user:
                Notification.objects.get_or_create(
                    user=mentioned_user,
                    question=question,
                    mention_by=question.user,
                    defaults={"is_read": False},
                )
        except UserDetail.DoesNotExist:
            continue


def create_answer_notification(answer):
    """
    Create notification for question author when someone answers their question.
    Also create mention notifications for any @username mentions in the answer.
    """
    # Notify question author about new answer (if not answering own question)
    if answer.user != answer.question.user:
        Notification.objects.get_or_create(
            user=answer.question.user,
            question=answer.question,
            answer=answer,
            mention_by=answer.user,
            defaults={"is_read": False},
        )

    # Check for mentions in answer description
    mentions = re.findall(r"@(\w+)", answer.answer_description)
    unique_mentions = set(mentions)

    for username in unique_mentions:
        try:
            mentioned_user = UserDetail.objects.get(
                username=username, is_user_deleted=False
            )

            # Don't notify the user if they mention themselves
            if mentioned_user != answer.user:
                Notification.objects.get_or_create(
                    user=mentioned_user,
                    question=answer.question,
                    answer=answer,
                    mention_by=answer.user,
                    defaults={"is_read": False},
                )
        except UserDetail.DoesNotExist:
            continue


def create_comment_notification(comment):
    """
    Create notification for answer author when someone comments on their answer.
    Also create mention notifications for any @username mentions in the comment.
    """
    # Notify answer author about new comment (if not commenting on own answer)
    if comment.user != comment.answer.user:
        Notification.objects.get_or_create(
            user=comment.answer.user,
            question=comment.answer.question,
            answer=comment.answer,
            mention_by=comment.user,
            defaults={"is_read": False},
        )

    # Check for mentions in comment content
    mentions = re.findall(r"@(\w+)", comment.comment_content)
    unique_mentions = set(mentions)

    for username in unique_mentions:
        try:
            mentioned_user = UserDetail.objects.get(
                username=username, is_user_deleted=False
            )

            # Don't notify the user if they mention themselves
            if mentioned_user != comment.user:
                Notification.objects.get_or_create(
                    user=mentioned_user,
                    question=comment.answer.question,
                    answer=comment.answer,
                    mention_by=comment.user,
                    defaults={"is_read": False},
                )
        except UserDetail.DoesNotExist:
            continue
