from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import viewsets
from rest_framework import status
from .models import User, Habit, Progress, Notification, Reward
from .serializers import UserSerializer, HabitSerializer, ProgressSerializer, NotificationSerializer, RewardSerializer
from django.contrib.auth.hashers import make_password

""" 
@api_view(['GET'])
def example_view(request):
    data = {"message": "Hello from Django!"}
    return Response(data) """

# Vistas para el modelo User
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class UserCreateView(APIView):
    def post(self, request):
        data = request.data

        # Encriptar la contraseña antes de crear el usuario
        if 'password' in data:
            data['password'] = make_password(data['password'])

        serializer = UserSerializer(data=data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)  # Código HTTP 201
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Vistas para el modelo Habit
class HabitViewSet(viewsets.ModelViewSet):
    queryset = Habit.objects.all()  # Esto debe devolver todos los hábitos
    serializer_class = HabitSerializer

# Vistas para el modelo Progress
class ProgressViewSet(viewsets.ModelViewSet):
    queryset = Progress.objects.all()
    serializer_class = ProgressSerializer

# Vistas para el modelo Notification
class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer

# Vistas para el modelo Reward
class RewardViewSet(viewsets.ModelViewSet):
    queryset = Reward.objects.all()
    serializer_class = RewardSerializer