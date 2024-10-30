# backend/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from django.contrib import admin  # Importa el módulo admin
from api.views import *

router = DefaultRouter() # Crea una instancia de DefaultRouter
router.register(r'users', UserViewSet) # Registra la vista UserViewSet
router.register(r'habits', HabitViewSet) # Registra la vista HabitViewSet
router.register(r'progress', ProgressViewSet) # Registra la vista ProgressViewSet 
router.register(r'notifications', NotificationViewSet) # Registra la vista NotificationViewSet
router.register(r'rewards', RewardViewSet) # Registra la vista RewardViewSet

urlpatterns = [
    #path('admin/', admin.site.urls),
    path('api/', include(router.urls)), # Incluye las rutas de la API
    path('api/login/', VerifyUserView.as_view()), # Ruta para la vista de inicio de sesión
    path('', Home_view.as_view(), name='home'),  # Ruta para la página principal
    path('api/login/', VerifyUserView.as_view()),  # Ruta para la vista de inicio de sesión
    path('api/signup/', UserCreateView.as_view()),  # Ruta para la vista de registro
    path('api/create_habit/', HabitCreateView.as_view()),  # Ruta para la vista de creación de hábitos
    path('api/habits_user/', HabitUserID.as_view()),  # Ruta para la vista de hábitos de un usuario
    path('api/notify_user/', NotifyUserID.as_view()),  # Ruta para la vista de notificaciones de un usuario
    path('api/notify_all/', NotifyUserIDAll.as_view()),  # Ruta para la vista de notificaciones de un usuario
    path('api/progress_create/', ProgressAction.as_view()),  #  Ruta para la vista de creación de progreso
    path('api/progress_date/', ProgressDateRangeView.as_view()),  #  Ruta para la vista de progreso por fecha
    path('api/progress_month/', ProgressUserDateView.as_view()),  #  Ruta para la vista de progreso por mes
    path('api/progress_week/', ProgressCurrentWeek.as_view()),  # Ruta para la vista de progreso por semana
    path('api/progress_habit/', ProgressHabitView.as_view()),  # Ruta para la vista de progreso por hábito
    path('api/notitfy_change/', NotifyChangeStatus.as_view()), # Ruta para la vista de cambio de estado de notificación
    path('api/notitfy_create/', NotifyCreateView.as_view()), # Ruta para la vista de creación de notificación
    path('api/habit_erase/', HabitEraseView.as_view()) # Ruta para la vista de eliminación de hábitos

    

    
]

