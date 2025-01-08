from django.urls import path
from .views import FeedbackListView

urlpatterns = [
    path('api/feedback/', FeedbackListView.as_view(), name='feedback-list'),
]
