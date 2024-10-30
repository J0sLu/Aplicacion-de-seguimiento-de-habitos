from rest_framework import serializers
from .models import User, Habit, Progress, Notification, Reward

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'  

class HabitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Habit
        fields = '__all__'  # Puedes especificar los campos si lo prefieres

class ProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Progress
        fields = '__all__'  # Puedes especificar los campos si lo prefieres

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'  # Puedes especificar los campos si lo prefieres

class RewardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reward
        fields = '__all__'  # Puedes especificar los campos si lo prefieres

class SimpleProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Progress
        fields = ['date', 'progress']  # Incluye solo los campos necesarios