from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import viewsets
from rest_framework import status
from .models import User, Habit, Progress, Notification, Reward
from .serializers import UserSerializer, HabitSerializer, ProgressSerializer, NotificationSerializer, RewardSerializer
from django.contrib.auth.hashers import make_password
from rest_framework.decorators import api_view
from django.utils import timezone  # Importar la zona horaria de Django
from datetime import timedelta  # Importar timedelta para sumar o restar días a una fecha
""" 
@api_view(['GET'])
def example_view(request):
    data = {"message": "Hello from Django!"}
    return Response(data) """


class VerifyUserView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        
        try:
            user = User.objects.get(email=email)
            if user.check_password(password):  # Verifica la contraseña
                return Response({"exists": True}, status=status.HTTP_200_OK)
            else:
                return Response({"exists": False}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"exists": False}, status=status.HTTP_200_OK)

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
            return Response( status=status.HTTP_201_CREATED)  # Código HTTP 201
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Vistas para el modelo Habit
class HabitViewSet(viewsets.ModelViewSet):
    queryset = Habit.objects.all()  # Esto debe devolver todos los hábitos
    serializer_class = HabitSerializer

#Vistas para crear un Habit 
class HabitCreateView(APIView):
    def post(self, request):
        data = request.data
        serializer = HabitSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#Vistas para visualiar los habitos de un usuario
class HabitUserID(APIView):
    def get(self, request):
        # Obtener el user_id de los parámetros de la URL
        user_id = request.query_params.get('user_id')

        if not user_id:
            return Response({"error": "user_id is required"}, status=status.HTTP_400_BAD_REQUEST)
    
        # Filtrar hábitos por user_id
        habits = Habit.objects.filter(user_id=user_id)

        # Verificar si existen hábitos
        if not habits.exists():
            return Response({"message": "No habits found for this user"}, status=status.HTTP_404_NOT_FOUND)

        # Serializar los hábitos
        serializer = HabitSerializer(habits, many=True)
        
        return Response(serializer.data, status=status.HTTP_200_OK)
# Vistas para el modelo Progress
class ProgressViewSet(viewsets.ModelViewSet):
    queryset = Progress.objects.all()
    serializer_class = ProgressSerializer

# Vistas para el modelo Notification
class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer

#Vistas para ver notificaciones de un usuario

class NotifyUserID(APIView):
    def get(self, request):
        # Obtener el user_id de los parámetros de la URL
        user_id = request.query_params.get('user_id')

        if not user_id:
            return Response({"error": "user_id is required"}, status=status.HTTP_400_BAD_REQUEST)
    
        # Obtener la fecha y hora actuales
        current_time = timezone.now() - timedelta(hours=6)
        print(current_time)
        # Filtrar notificaciones por user_id y por sent_at <= current_time
        notifications = Notification.objects.filter(user_id=user_id, sent_at__lte=current_time)

        # Verificar si existen notificaciones
        if not notifications.exists():
            return Response({"message": "No notifications found for this user"}, status=status.HTTP_404_NOT_FOUND)
        
        # Serializar las notificaciones
        serializer = NotificationSerializer(notifications, many=True)
        
        return Response(serializer.data, status=status.HTTP_200_OK)

# Vistas para el modelo Reward
class RewardViewSet(viewsets.ModelViewSet):
    queryset = Reward.objects.all()
    serializer_class = RewardSerializer


