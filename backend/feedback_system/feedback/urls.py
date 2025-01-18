from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    FeedbackListCreateView,
    FeedbackDetailView,  # Add the FeedbackDetailView
    register_user,
    LoginView,
    UserView,
    SentimentDistributionView,
    negative_feedback_alerts,
    UserManagementView,
)

# In your urls.py
urlpatterns = [
    # Authentication
    path('api/register/', register_user, name='register'),
    path('api/login/', LoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Feedback
    path('api/feedback/', FeedbackListCreateView.as_view(), name='feedback-list'),
    path('api/feedback/<int:feedback_id>/', FeedbackDetailView.as_view(), name='feedback-detail'),  # Corrected here
    path('api/sentiment-distribution/', SentimentDistributionView.as_view(), name='sentiment-distribution'),
    path('api/negative-feedback-alerts/', negative_feedback_alerts, name='negative-feedback-alert'),

    # User Management
    path('api/user/', UserManagementView.as_view(), name='user-management'),  # List and create users
    path('api/user/<int:user_id>/', UserManagementView.as_view(), name='user-detail'),  # Delete or toggle active status

    # Current User Details
    path('api/user-detail/', UserView.as_view(), name='user-detail'),
]
