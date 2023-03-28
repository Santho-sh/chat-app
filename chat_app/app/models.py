from django.db import models
from django.contrib.auth.models import User


class Chat(models.Model):
    sender = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='chats_sent')
    receiver = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='chats_received')
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)


class Group(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    members = models.ManyToManyField(User, related_name='group')


class GroupMessage(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    group = models.ForeignKey(
        Group, on_delete=models.CASCADE, related_name='messages')
