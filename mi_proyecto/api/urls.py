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
    path('', home_view, name='home'),  # Ruta para la página principal
    path('api/login/', VerifyUserView.as_view()),  # Cambia a esta línea
    path('api/signup/', UserCreateView.as_view()),  # Cambia a esta línea
    path('api/create_habit/', HabitCreateView.as_view()),  # Cambia a esta línea
    path('api/habits_user/', HabitUserID.as_view()),  # Cambia a esta línea
    path('api/notify_user/', NotifyUserID.as_view()),  # Cambia a esta línea
]

