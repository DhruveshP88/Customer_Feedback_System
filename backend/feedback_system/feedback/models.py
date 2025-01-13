from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from django.conf import settings

class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('staff', 'Staff'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='staff')

    # Add related_name attributes to resolve clashes
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='customuser_set',
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='customuser_set',
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions',
    )
class Feedback(models.Model):
    user = models.CharField(max_length=255,default=1) 
    name = models.CharField(max_length=255)
    email = models.EmailField()
    feedback_type = models.CharField(max_length=50)
    comments = models.TextField()
    sentiment = models.CharField(max_length=20, null=True, blank=True)  # Sentiment analysis result

    def __str__(self):
        return self.name
