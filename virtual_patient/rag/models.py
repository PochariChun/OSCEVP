from django.db import models
from accounts.models import User
from conversations.models import Patient

class PatientData(models.Model):
    """虛擬病人的知識庫數據"""
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='data')
    title = models.CharField(max_length=200)
    content = models.TextField()
    vector_id = models.CharField(max_length=100, blank=True)  # 向量數據庫中的ID
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.patient.name} - {self.title}"

class LearningProgress(models.Model):
    """用戶的學習進度記錄"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='learning_progress')
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    total_conversations = models.IntegerField(default=0)
    total_score = models.IntegerField(default=0)
    average_score = models.FloatField(default=0.0)
    last_conversation_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['user', 'patient']
    
    def __str__(self):
        return f"{self.user.username} - {self.patient.name}"
    
    def update_progress(self, new_score):
        """更新學習進度"""
        self.total_conversations += 1
        self.total_score += new_score
        self.average_score = self.total_score / self.total_conversations
        self.save()
