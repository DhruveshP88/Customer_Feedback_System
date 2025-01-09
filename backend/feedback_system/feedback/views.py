from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Feedback
from .serializers import FeedbackSerializer
from rest_framework import status
from .serializers import UserSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken


@api_view(['POST'])
def register_user(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken

class LoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        # Try to get the user by email
        User = get_user_model()  # This ensures you're using the correct custom user model
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise AuthenticationFailed('Invalid email or password')

        # Check if the password is correct
        if not user.check_password(password):
            raise AuthenticationFailed('Invalid email or password')

        # Generate the JWT token
        refresh = RefreshToken.for_user(user)

        return Response({
            'token': str(refresh.access_token),
            'refresh': str(refresh),
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
class FeedbackListView(APIView):
    def get(self, request):
        feedback = Feedback.objects.all()
        serializer = FeedbackSerializer(feedback, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = FeedbackSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
