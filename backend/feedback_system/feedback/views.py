from rest_framework.views import APIView # type: ignore
from rest_framework.response import Response # type: ignore
from .models import Feedback
from .serializers import FeedbackSerializer 
from rest_framework import status # type: ignore
from .serializers import UserSerializer
from rest_framework.generics import ListCreateAPIView # type: ignore
from rest_framework.permissions import IsAuthenticated # type: ignore
from rest_framework.decorators import api_view, permission_classes # type: ignore
from rest_framework.exceptions import AuthenticationFailed # type: ignore
from django.contrib.auth import authenticate # type: ignore
from rest_framework_simplejwt.tokens import RefreshToken  # type: ignore
from django.contrib.auth import get_user_model # type: ignore
from rest_framework import permissions, generics    # type: ignore
from textblob import TextBlob # type: ignore
from django.db.models import Count # type: ignore
from rest_framework.response import Response # type: ignore
from django.core.mail import send_mail # type: ignore
from django.conf import settings # type: ignore
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



class FeedbackDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, feedback_id):
        try:
            return Feedback.objects.get(id=feedback_id)
        except Feedback.DoesNotExist:
            return None

    def put(self, request, feedback_id):
        feedback = self.get_object(feedback_id)
        if not feedback:
            return Response({"error": "Feedback not found."}, status=status.HTTP_404_NOT_FOUND)

        # Ensure the user has permission to update this feedback
        if request.user.role != 'admin' and feedback.user != request.user:
            return Response({"error": "You do not have permission to update this feedback."}, status=status.HTTP_403_FORBIDDEN)

        # Update the feedback with the new data
        serializer = FeedbackSerializer(feedback, data=request.data, partial=True)
        if serializer.is_valid():
            updated_feedback = serializer.save()

            # Re-run sentiment analysis after feedback update
            updated_feedback.sentiment = self.analyze_sentiment(updated_feedback.comments)
            updated_feedback.save()

            return Response(FeedbackSerializer(updated_feedback).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, feedback_id):
        feedback = self.get_object(feedback_id)
        if not feedback:
            return Response({"error": "Feedback not found."}, status=status.HTTP_404_NOT_FOUND)

        # Ensure the user has permission to delete this feedback
        if request.user.role != 'admin' and feedback.user != request.user:
            return Response({"error": "You do not have permission to delete this feedback."}, status=status.HTTP_403_FORBIDDEN)

        feedback.delete()
        return Response({"message": "Feedback deleted successfully."}, status=status.HTTP_204_NO_CONTENT)

    def analyze_sentiment(self, feedback_text):
        blob = TextBlob(feedback_text)
        polarity = blob.sentiment.polarity
        if polarity > 0.29:
            return 'Positive'
        elif polarity < -0.29:
            return 'Negative'
        else:
            return 'Neutral'



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

        # Check if the user is active
        if not user.is_active:
            return Response({"detail": "Your account is inactive."}, status=status.HTTP_401_UNAUTHORIZED)

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


class UserManagementView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != 'admin':
            return Response({"error": "Access denied."}, status=403)

        users = get_user_model().objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

    def post(self, request):
        if request.user.role != 'admin':
            return Response({"error": "Access denied."}, status=403)

        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, user_id):
        if request.user.role != 'admin':
            return Response({"error": "Access denied."}, status=403)

        try:
            user = get_user_model().objects.get(id=user_id)
            user.delete()
            return Response({"message": "User deleted successfully."})
        except get_user_model().DoesNotExist:
            return Response({"error": "User not found."}, status=404)

    def patch(self, request, user_id):
        if request.user.role != 'admin':
            return Response({"error": "Access denied."}, status=403)

        try:
            user = get_user_model().objects.get(id=user_id)
            user.is_active = not user.is_active
            user.save()
            return Response({"message": f"User {'activated' if user.is_active else 'deactivated'} successfully."})
        except get_user_model().DoesNotExist:
            return Response({"error": "User not found."}, status=404)
