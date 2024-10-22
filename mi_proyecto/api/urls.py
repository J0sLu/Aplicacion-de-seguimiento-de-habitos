from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'habits', HabitViewSet)
router.register(r'progress', ProgressViewSet)
router.register(r'notifications', NotificationViewSet)
router.register(r'rewards', RewardViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/login/', VerifyUserView.as_view()),  # Cambia a esta línea
    path('api/singup/', UserCreateView.as_view()),  # Cambia a esta línea
    path('api/create_habit/', HabitCreateView.as_view()),  # Cambia a esta línea
    path('api/habits_user/', HabitUserID.as_view()),  # Cambia a esta línea
    path('api/notify_user/', NotifyUserID.as_view()),  # Cambia a esta línea
]