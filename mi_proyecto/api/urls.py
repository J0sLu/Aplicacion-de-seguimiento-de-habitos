from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, HabitViewSet, ProgressViewSet, NotificationViewSet, RewardViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'habits', HabitViewSet)
router.register(r'progress', ProgressViewSet)
router.register(r'notifications', NotificationViewSet)
router.register(r'rewards', RewardViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]
