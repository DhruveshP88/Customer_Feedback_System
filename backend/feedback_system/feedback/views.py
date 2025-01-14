from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Feedback
from .serializers import FeedbackSerializer
from rest_framework import status
from .serializers import UserSerializer
from rest_framework.generics import ListCreateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from rest_framework import permissions, generics    
from textblob import TextBlob
from django.db.models import Count
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.core.mail import send_mail
from django.conf import settings

class FeedbackListCreateView(ListCreateAPIView):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Feedback.objects.all()
        return Feedback.objects.filter(user=user)

    def perform_create(self, serializer):
        feedback_text = self.request.data.get('comments', '')
        sentiment = self.analyze_sentiment(feedback_text)  # Analyze sentiment
        feedback = serializer.save(user=self.request.user, sentiment=sentiment)

        # Notify admin if sentiment is negative
        if sentiment == 'Negative':
            self.notify_admin(feedback)

    def analyze_sentiment(self, feedback):
        blob = TextBlob(feedback)
        polarity = blob.sentiment.polarity
        if polarity > 0.29:
            return 'Positive'
        elif polarity < -0.29:
            return 'Negative'
        else:
            return 'Neutral'

    def notify_admin(self, feedback):
        subject = "Negative Feedback Alert"
        message = f"New negative feedback received:\n\n{feedback.comments}"
        recipient_list = ['jhonpamarkytics@gmail.com']  # Replace with actual admin emails
        send_mail(subject, message, settings.EMAIL_HOST_USER, recipient_list)

class SentimentDistributionView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        sentiment_counts = Feedback.objects.values('sentiment').annotate(count=Count('sentiment'))
        data = {item['sentiment']: item['count'] for item in sentiment_counts}
        return Response(data)


@api_view(['POST'])
def register_user(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():  
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class LoginView(APIView):
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        # Check if email and password are provided
        if not email or not password:
            return Response({"detail": "Email and password are required"}, status=status.HTTP_400_BAD_REQUEST)

        # Authenticate the user by email (not username)
        try:
            user = get_user_model().objects.get(email=email)
        except get_user_model().DoesNotExist:
            return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        # Check if the password is correct
        if not user.check_password(password):
            return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        # Create JWT token and include the role in the payload
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        # Return the token and role
        return Response({
            "token": access_token,
            "role": user.role,  # Include the role in the response
        })
class UserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            'email': user.email,
            'role': user.role,
            # other user data you want to return
        })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_dashboard(request):
    if request.user.role == 'admin':
        return Response({"message": "Welcome, Admin!"})
    return Response({"error": "Access denied."}, status=403)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def staff_dashboard(request):
    if request.user.role == 'staff':
        return Response({"message": "Welcome, Staff!"})
    return Response({"error": "Access denied."}, status=403)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def negative_feedback_alerts(request):
    if request.user.role != 'admin':
        return Response({"error": "Access denied."}, status=403)

    negative_feedback = Feedback.objects.filter(sentiment='Negative').order_by('-id')[:5]
    serializer = FeedbackSerializer(negative_feedback, many=True)
    return Response(serializer.data)


