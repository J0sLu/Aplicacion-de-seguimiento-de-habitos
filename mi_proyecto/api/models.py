from django.db import models
from django.contrib.auth.hashers import make_password

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

class Habit(models.Model):
    FREQUENCY_CHOICES = [
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
    ]

    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='habits')
    name = models.TextField()
    start_date = models.DateField()
    frequency = models.CharField(max_length=10, choices=FREQUENCY_CHOICES)
    target = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


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
