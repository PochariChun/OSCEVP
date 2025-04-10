from rest_framework import serializers
from .models import Patient, Conversation, Message

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = '__all__'

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'sender', 'content', 'created_at']
        read_only_fields = ['id', 'created_at']

class ConversationSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True, read_only=True)
    
    class Meta:
        model = Conversation
        fields = ['id', 'user', 'patient', 'title', 'score', 'feedback', 'created_at', 'updated_at', 'messages']
        read_only_fields = ['id', 'created_at', 'updated_at'] 