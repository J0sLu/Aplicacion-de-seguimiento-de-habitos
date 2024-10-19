from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import viewsets
from .models import User, Habit, Progress, Notification, Reward
from .serializers import UserSerializer, HabitSerializer, ProgressSerializer, NotificationSerializer, RewardSerializer


""" 
@api_view(['GET'])
def example_view(request):
    data = {"message": "Hello from Django!"}
    return Response(data) """

# Vistas para el modelo User
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

# Vistas para el modelo Habit
class HabitViewSet(viewsets.ModelViewSet):
    queryset = Habit.objects.all()
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