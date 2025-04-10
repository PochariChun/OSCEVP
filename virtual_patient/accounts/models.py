from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    # 額外的用戶字段
    name = models.CharField(max_length=100, blank=True)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    
    # 可以添加其他用戶相關字段
    bio = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        app_label = 'accounts'
    
    def __str__(self):
        return self.username
