from django.db import models
from django.contrib.auth.hashers import make_password, check_password
import uuid
from django.utils import timezone
from datetime import timedelta
class User(models.Model):
    id = models.BigAutoField(primary_key=True)
    username = models.TextField()
    password = models.CharField(max_length=128)  # Mayor longitud para almacenar hashes de contraseñas
    email = models.EmailField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        # Si la contraseña se cambió, se encripta antes de guardarla
        if not self.password.startswith('pbkdf2_'):  # Verifica si ya está encriptada
            self.password = make_password(self.password)
        super(User, self).save(*args, **kwargs)

    def __str__(self):
        return self.username
    
    def check_password(self, raw_password):
        # Verifica la contraseña proporcionada con el hash almacenado
        return check_password(raw_password, self.password)
    
    
class Habit(models.Model):
    FREQUENCY_CHOICES = [
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
    ]

    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='habits')
    name = models.TextField()
    start_date = models.DateField()
    category = models.TextField(max_length=255, default='default_category') 
    frequency = models.CharField(max_length=10, choices=FREQUENCY_CHOICES)
    target = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        # Verifica si el hábito ya existe
        super(Habit, self).save(*args, **kwargs)


class Progress(models.Model):
    id = models.BigAutoField(primary_key=True)
    habit = models.ForeignKey(Habit, on_delete=models.CASCADE, related_name='progress')
    date = models.DateField()
    progress = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Progress for {self.habit.name} on {self.date}"


class Notification(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    message = models.TextField()
    frequency = models.TextField(max_length=255, default='default_category') 
    sent_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return self.message


class Reward(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='rewards')
    description = models.TextField()
    awarded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.description
    

class Token(models.Model):
    id = models.BigAutoField(primary_key=True)
    id_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tokens', db_column='id_user')
    token = models.CharField(max_length=255, unique=True, default=uuid.uuid4)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Token for {self.id_user.username} created at {self.created_at}"

    def is_expired(self):
        # Calcula si el token tiene más de 2 días de antigüedad
        return timezone.now() > self.created_at + timedelta(days=2)