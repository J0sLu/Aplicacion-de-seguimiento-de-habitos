# api/views.py
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import viewsets
from rest_framework import status
from .models import User, Habit, Progress, Notification, Reward
from .serializers import UserSerializer, HabitSerializer, ProgressSerializer, NotificationSerializer, RewardSerializer
from django.contrib.auth.hashers import make_password
from django.http import HttpResponse
from django.shortcuts import redirect  # Para redirigir en la vista home_view
from django.utils import timezone  # Importar la zona horaria de Django
from datetime import timedelta,datetime  # Importar timedelta para sumar o restar días a una fecha
from django.utils.dateparse import parse_date

""" 
@api_view(['GET'])
def example_view(request):
    data = {"message": "Hello from Django!"}
    return Response(data)
"""

class Home_view(APIView):
    def get(self, request):
        """ Muestra un mensaje de bienvenida"""
        return Response("<h1>Bienvenido a la API de Gestión de Hábitos</h1>")
    
  

# Vista de verificación de usuarios
class VerifyUserView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        
        try:
            user = User.objects.get(email=email)
            
            if user.check_password(password):  # Verifica la contraseña
                return Response({
                    "exists": True,
                    "id": user.id,
                    "username": user.username,
                    }, status=status.HTTP_200_OK)
            else:
                return Response({"exists 01": False}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"exists 02": False}, status=status.HTTP_200_OK)

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
    


class ProgressAction(APIView):
    def post(self, request):
        data = request.data
        serializer = ProgressSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProgressUserDateView(APIView):
    def get(self, request):
        # Obtener el user_id, habit_id, mes y año de los parámetros de la URL
        #user_id = request.query_params.get('user_id')
        data = request.data
        year = data.get('year')
        month = data.get('month')
        habit_id = data.get('habit_id')
        print(year)
        print(month)
        print(habit_id)

        if  not year or not month or not habit_id:
            return Response({"error": "habit_id, year and month are required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Convertir el año y el mes a un objeto datetime
            start_date = datetime(year=int(year), month=int(month), day=1)
            # Obtener el último día del mes
            if month == '12':
                end_date = datetime(year=int(year) + 1, month=1, day=1)
            else:
                end_date = datetime(year=int(year), month=int(month) + 1, day=1)
        except ValueError:
            return Response({"error": "Invalid year or month format"}, status=status.HTTP_400_BAD_REQUEST)

        # Filtrar progresos por user_id, habit_id y el rango de fechas
        progress = Progress.objects.filter(habit_id=habit_id, date__gte=start_date, date__lt=end_date)

        # Verificar si existen progresos
        if not progress.exists():
            return Response({"message": "No progress found for this user and month"}, status=status.HTTP_404_NOT_FOUND)
        
        # Serializar los progresos
        serializer = ProgressSerializer(progress, many=True)
        
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class ProgressCurrentWeek(APIView):
    def get(self, request):
        data = request.data
        # Obtener el user_id y habit_id de los parámetros de la URL
        habit_id = data.get('habit_id')

        if not habit_id :
            return Response({"error": "habit_id is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Obtener la fecha actual
        today = datetime.today()
        
        # Calcular el lunes (inicio de la semana) y el domingo (fin de la semana)
        start_of_week = today - timedelta(days=today.weekday())  # Lunes
        end_of_week = start_of_week + timedelta(days=6)  # Domingo

        # Filtrar los progresos que caen dentro de la semana actual
        progress = Progress.objects.filter(
            habit_id=habit_id,
            date__gte=start_of_week,
            date__lte=end_of_week
        )

        # Verificar si hay progresos
        if not progress.exists():
            return Response({"message": "No progress found for this user in the current week"}, status=status.HTTP_404_NOT_FOUND)
        
        # Serializar los progresos
        serializer = ProgressSerializer(progress, many=True)
        
        return Response(serializer.data, status=status.HTTP_200_OK)



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


class NotifyUserIDAll(APIView):
    def get(self, request):
        
        user_id = request.query_params.get('user_id')

        if not user_id:
            return Response({"error": "user_id is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Filtrar notificaciones por user_id y por sent_at <= current_time
        notifications = Notification.objects.filter(user_id=user_id)
        
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

