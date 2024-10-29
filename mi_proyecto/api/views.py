# api/views.py
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import viewsets
from rest_framework import status
from .models import User, Habit, Progress, Notification, Reward, Token
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
            
            if user.check_password(password):
                # Verifica si hay un token no expirado para el usuario
                token_auth = Token.objects.filter(id_user=user).order_by('-created_at').first()

                if token_auth and not token_auth.is_expired():
                    # Si hay un token y no ha expirado, se devuelve el token existente
                    token = token_auth.token
                else:
                    # Si no hay un token o ha expirado, se crea uno nuevo
                    token_auth = Token.objects.create(id_user=user)
                    token = token_auth.token

                return Response({
                    "exists": True,
                    "id": user.id,
                    "token": token,
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
        
        habito = Habit.objects.filter(name=data.get('name'), user_id=data.get('user_id'))

        if habito.exists():
            
            return Response({"error": "Habit already exists"}, status=status.HTTP_400_BAD_REQUEST)

        print(request.data.get('category'))
        print(data)
        
        if data.get('frequency') == "Diario":
            data['frequency'] = 'daily'
        elif data.get('frequency') == "Semanal":
            data['frequency'] = 'weekly'
        elif data.get('frequency') == "Mensual":
            data['frequency'] = 'monthly'


        # Agregar la fecha actual al campo "start_date"
        data['start_date'] = datetime.now().date()
        # Serializar los datos con la fecha actual agregada
        serializer = HabitSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class HabitEraseView(APIView):
    def post(self, request):
        habit_id = request.data.get('habit_id')
        try:
            habit = Habit.objects.get(id=habit_id)
        except Habit.DoesNotExist:
            return Response({"error": "Habit not found"}, status=status.HTTP_404_NOT_FOUND)

        habit.delete()
        return Response({"message": "Habit deleted"}, status=status.HTTP_200_OK)

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


#PROGRESO DE LOS HABITOS
class ProgressHabitView(APIView):
    def get(self, request):

        user_id = request.query_params.get('user_id')
        
        habitos = Habit.objects.filter(user_id=user_id)
        progresos = []  # Lista para almacenar los progresos de cada hábito

        for habito in habitos:
            habito_id = habito.id
        
            if not habito_id:
                return Response({"error": "habit_id is required"}, status=status.HTTP_400_BAD_REQUEST)
            
            try:
                # Obtener el hábito y sus datos
                frecuencia = habito.frequency  # Ej. "monthly", "weekly", "daily"
                target = habito.target
                habit_name = habito.name

                # Fecha de hoy para referencia
                today = datetime.today()

                # Filtrar progresos según la frecuencia
                if frecuencia == "monthly":
                    # Primer y último día del mes actual
                    start_date = today.replace(day=1)
                    next_month = start_date.month % 12 + 1
                    end_date = start_date.replace(month=next_month, day=1) - timedelta(days=1)
                    
                elif frecuencia == "weekly":
                    # Inicio de la semana (lunes) y fin de la semana (domingo)
                    start_date = today - timedelta(days=today.weekday())
                    end_date = start_date + timedelta(days=6)
                    
                elif frecuencia == "daily":
                    # Para progresos diarios, desde la fecha de inicio hasta hoy
                    start_date = habito.start_date
                    end_date = today
                else:
                    return Response({"error": "Invalid frequency"}, status=status.HTTP_400_BAD_REQUEST)

                # Obtener todos los progresos del hábito en el rango de fechas
                registros_progreso = Progress.objects.filter(
                    habit_id=habito_id,
                    date__gte=start_date,
                    date__lte=end_date
                )

                # Sumar el progreso registrado
                progreso_total = registros_progreso.count()
                
                # Calcular el progreso en escala de 0 a 1 y redondear a 2 decimales
                progreso_escala = round(min(progreso_total / target, 1.0), 2) if target else 0

                # Agregar los datos del hábito al diccionario de progresos
                progresos.append({
                    "habit_id": habito_id,
                    "name": habit_name,
                    "progress": progreso_escala,
                    "frequency": frecuencia,
                    "category": habito.category,
                    "target": habito.target,
                    "times": progreso_total
                })
            
            except Habit.DoesNotExist:
                return Response({"error": f"Habit with id {habito_id} not found"}, status=status.HTTP_404_NOT_FOUND)
        
        return Response(progresos, status=status.HTTP_200_OK)

class ProgressHabitViewByIDHabit(APIView):
    def post(self, request):
        habito_id = request.data.get('habit_id')
    
        if not habito_id:
            return Response({"error": "habit_id is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Obtener el hábito
            habito = Habit.objects.get(id=habito_id)
            frecuencia = habito.frequency  # Ej. "mes", "semana", "diario"
            target = habito.target
            print (frecuencia)
            print (target)

            # Fecha de hoy para referencia
            today = datetime.today()

            # Filtrar progresos según la frecuencia
            if frecuencia == "monthly":
                # Obtener el primer y último día del mes actual
                start_date = today.replace(day=1)
                next_month = start_date.month % 12 + 1
                end_date = start_date.replace(month=next_month, day=1) - timedelta(days=1)
                
            elif frecuencia == "weekly":
                # Obtener el inicio de la semana (lunes) y el final (domingo)
                start_date = today - timedelta(days=today.weekday())
                end_date = start_date + timedelta(days=6)
                
            elif frecuencia == "daily":
                # Para progresos diarios, solo la fecha actual
                start_date = habito.start_date
                end_date = today
                

            
            # Obtener todos los progresos del hábito en el rango de fechas
            progresos = Progress.objects.filter(
                habit_id=habito_id,
                date__gte=start_date,
                date__lte=end_date
            )

            # Sumar el progreso registrado (ajustar a `progress` o el nombre correcto)
            progreso_total = progresos.count()
            print(progreso_total)
            # Calcular el progreso en escala de 0 a 1
            progreso_escala =  round(min(progreso_total / target, 1.0), 2) if target else 0

            return Response({
                "habit_id": habito_id,
                "progress": progreso_escala,
                "frequency": frecuencia
            }, status=status.HTTP_200_OK)
        
        except Habit.DoesNotExist:
            return Response({"error": "Habit not found"}, status=status.HTTP_404_NOT_FOUND)



class ProgressAction(APIView):
    def post(self, request):
        data = request.data
        data['date'] = datetime.now().date()
        data['progress'] = 1
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

#Vista para ver los progresos de un usuario en un rango de fechas
class ProgressDateRangeView(APIView):
    def get(self, request):
        # Obtener habit_id, start_date y end_date de los parámetros de la URL
        habit_id = request.query_params.get('habit_id')
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')

        # Validar los parámetros obligatorios
        if not habit_id:
            return Response({"error": "habit_id is required"}, status=status.HTTP_400_BAD_REQUEST)
        if not start_date or not end_date:
            return Response({"error": "start_date and end_date are required"}, status=status.HTTP_400_BAD_REQUEST)

        # Convertir las fechas de texto a objetos de fecha
        try:
            start_date = datetime.strptime(start_date, "%Y-%m-%d").date()
            end_date = datetime.strptime(end_date, "%Y-%m-%d").date()
        except ValueError:
            return Response({"error": "Invalid date format. Use YYYY-MM-DD"}, status=status.HTTP_400_BAD_REQUEST)

        # Filtrar los progresos en el rango de fechas
        progress = Progress.objects.filter(
            habit_id=habit_id,
            date__gte=start_date,
            date__lte=end_date
        )

        # Verificar si hay progresos
        if not progress.exists():
            return Response({"message": "No progress found for this habit in the specified date range"}, status=status.HTTP_404_NOT_FOUND)
        
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
    

class NotifyChangeStatus(APIView):
    def post(self, request):
        id = request.data.get('id')
        is_read = request.data.get('is_read')

        noti = Notification.objects.get(id=id)
        #print(noti.is_read)
        if not noti:
            return Response({"message": "Notification not found"}, status=status.HTTP_404_NOT_FOUND)

        if is_read:
            return Response({"message": "Notification is read"}, status=status.HTTP_200_OK)
        else:
            noti.is_read = True
            noti.save()
            noti = Notification.objects.get(id=id)
            print(noti.is_read)
            return Response({"message": "Notification status changed"}, status=status.HTTP_200_OK)

class NotifyCreateView(APIView):
    def post(self, request):
        data = request.data
        serializer = NotificationSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



# Vistas para el modelo Reward
class RewardViewSet(viewsets.ModelViewSet):
    queryset = Reward.objects.all()
    serializer_class = RewardSerializer

