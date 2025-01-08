from django.db import models

class Feedback(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField()
    feedback_type = models.CharField(max_length=50)
    comments = models.TextField()
    sentiment = models.CharField(max_length=20, null=True, blank=True)  # Sentiment analysis result

    def __str__(self):
        return self.name
