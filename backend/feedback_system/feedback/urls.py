from django.urls import path
from .views import FeedbackListCreateView
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import register_user
from .views import LoginView

urlpatterns = [
    path('api/register/', register_user, name='register'),
     path('api/login/', LoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/feedback/', FeedbackListCreateView.as_view(), name='feedback-list'),
]
