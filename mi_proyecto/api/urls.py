# backend/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from django.contrib import admin  # Importa el módulo admin

from api.views import UserViewSet, HabitViewSet, ProgressViewSet, NotificationViewSet, RewardViewSet, VerifyUserView, home_view

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
]

