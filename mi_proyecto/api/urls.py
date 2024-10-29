# backend/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from django.contrib import admin  # Importa el módulo admin


from api.views import *

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'habits', HabitViewSet)
router.register(r'progress', ProgressViewSet)
router.register(r'notifications', NotificationViewSet)
router.register(r'rewards', RewardViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/login/', VerifyUserView.as_view()),
    path('', Home_view.as_view(), name='home'),  # Ruta para la página principal
    path('api/login/', VerifyUserView.as_view()),  # Cambia a esta línea
    path('api/signup/', UserCreateView.as_view()),  # Cambia a esta línea
    path('api/create_habit/', HabitCreateView.as_view()),  # Cambia a esta línea
    path('api/habits_user/', HabitUserID.as_view()),  # Cambia a esta línea
    path('api/notify_user/', NotifyUserID.as_view()),  # Cambia a esta línea
    path('api/notify_all/', NotifyUserIDAll.as_view()),  # Cambia a esta línea
    path('api/progress_create/', ProgressAction.as_view()),  # Cambia a esta línea
    path('api/progress_month/', ProgressUserDateView.as_view()),  # Cambia a esta línea
    path('api/progress_week/', ProgressCurrentWeek.as_view()),  # Cambia a esta línea
    path('api/progress_habit/', ProgressHabitView.as_view()),  # Cambia a esta línea
    path('api/not_change/', NotifyChangeStatus.as_view()),
    path('api/habit_erase/', HabitEraseView.as_view())

    
]

