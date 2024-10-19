from rest_framework import serializers
from .models import User, Habit, Progress, Notification, Reward

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'  # O especifica los campos que deseas incluir


class HabitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Habit
        fields = '__all__'  # O especifica los campos que deseas incluir


class ProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Progress
        fields = '__all__'  # O especifica los campos que deseas incluir


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'  # O especifica los campos que deseas incluir


class RewardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reward
        fields = '__all__'  # O especifica los campos que deseas incluir
