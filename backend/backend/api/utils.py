import re
from .models import *

def create_mention_notifications(question):
    """
    Find all @username mentions in question_title and question_description.
    For each valid username, create a Notification entry for that user.
    """
    text_to_search = f"{question.question_title} {question.question_description}"
    mentions = re.findall(r'@(\w+)', text_to_search)
    
    unique_mentions = set(mentions)
    
    for username in unique_mentions:
        try:
            mentioned_user = UserDetail.objects.get(username=username, is_user_deleted=False)
            
            Notification.objects.get_or_create(
                user=mentioned_user,
                question=question,
                mention_by=question.user,
                defaults={'is_read': False}
            )
        except UserDetail.DoesNotExist:
            continue

