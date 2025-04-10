from django.db import models
from accounts.models import User

class Patient(models.Model):
    """虛擬病人模型"""
    name = models.CharField(max_length=100)
    description = models.TextField()
    avatar = models.ImageField(upload_to='patients/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        app_label = 'conversations'
    
    def __str__(self):
        return self.name

class Conversation(models.Model):
    """用戶與虛擬病人的對話會話"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='conversations')
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='conversations')
    title = models.CharField(max_length=200, blank=True)
    score = models.IntegerField(default=0)  # 用戶在此對話中的得分
    feedback = models.TextField(blank=True)  # 系統對此對話的評價
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.patient.name} - {self.created_at.strftime('%Y-%m-%d')}"

    class Meta:
        app_label = 'conversations'

class Message(models.Model):
    """對話中的單條消息"""
    SENDER_CHOICES = (
        ('user', '用戶'),
        ('patient', '虛擬病人'),
        ('system', '系統'),
    )
    
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages')
    sender = models.CharField(max_length=10, choices=SENDER_CHOICES)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        app_label = 'conversations'
        ordering = ['created_at']
    
    def __str__(self):
        return f"{self.sender}: {self.content[:50]}"
