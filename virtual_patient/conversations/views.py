from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import VirtualPatient, Conversation, Message
from .serializers import VirtualPatientSerializer, ConversationSerializer, MessageSerializer
from rag.scoring import ScoreEngine
from rag.vector_store import VectorStore
from rag.dialog_generator import DialogGenerator
import json
from django.utils import timezone

# 全局變量存儲對話生成器和向量存儲
conversation_handlers = {}

class VirtualPatientViewSet(viewsets.ModelViewSet):
    queryset = VirtualPatient.objects.all()
    serializer_class = VirtualPatientSerializer
    
    @action(detail=True, methods=['post'])
    def start_conversation(self, request, pk=None):
        """開始與虛擬病人的對話"""
        virtual_patient = self.get_object()
        
        # 創建新的對話
        conversation = Conversation.objects.create(
            user=request.user,
            virtual_patient=virtual_patient
        )
        
        # 初始化對話處理器
        vector_store = VectorStore()
        dialog_data = virtual_patient.dialog_json
        
        # 為對話問題創建向量索引
        questions = [item['question'] for item in dialog_data]
        vector_store.add_collection("dialog_questions", questions)
        
        # 加載評分標準
        scoring_criteria = virtual_patient.scoring_json
        score_engine = ScoreEngine()
        score_engine.load_criteria(scoring_criteria, f"patient_{conversation.id}")
        
        # 創建對話生成器
        dialog_generator = DialogGenerator(dialog_data)
        
        # 存儲對話處理器
        conversation_handlers[conversation.id] = {
            'vector_store': vector_store,
            'score_engine': score_engine,
            'dialog_generator': dialog_generator
        }
        
        # 發送歡迎消息
        if dialog_data and len(dialog_data) > 0:
            welcome_message = dialog_data[0]['question']
            Message.objects.create(
                conversation=conversation,
                role=Message.PATIENT,
                content=welcome_message
            )
        
        # 返回對話信息
        serializer = ConversationSerializer(conversation)
        return Response(serializer.data)

class ConversationViewSet(viewsets.ModelViewSet):
    serializer_class = ConversationSerializer
    
    def get_queryset(self):
        return Conversation.objects.filter(user=self.request.user)
    
    @action(detail=True, methods=['post'])
    def send_message(self, request, pk=None):
        """發送消息到對話"""
        conversation = self.get_object()
        content = request.data.get('content', '')
        
        if not content:
            return Response(
                {"error": "消息內容不能為空"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # 獲取對話處理器
        handler = conversation_handlers.get(conversation.id)
        if not handler:
            return Response(
                {"error": "對話會話已過期，請重新開始"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # 創建學生消息
        student_message = Message.objects.create(
            conversation=conversation,
            role=Message.STUDENT,
            content=content
        )
        
        # 評分回答
        score_result = handler['score_engine'].score_response(
            content, 
            f"patient_{conversation.id}"
        )
        
        # 更新消息評分
        student_message.score = score_result['score']
        feedback = f"相似度: {score_result['similarity']:.2f}"
        if score_result['matched_criteria']:
            feedback += f"\n匹配問題: {score_result['matched_criteria']}"
        student_message.feedback = feedback
        student_message.save()
        
        # 獲取虛擬病人的回應
        patient_response = handler['dialog_generator'].get_response(
            content, 
            handler['vector_store']
        )
        
        # 創建虛擬病人消息
        patient_message = Message.objects.create(
            conversation=conversation,
            role=Message.PATIENT,
            content=patient_response
        )
        
        # 返回對話
        serializer = ConversationSerializer(conversation)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def end_conversation(self, request, pk=None):
        """結束對話"""
        conversation = self.get_object()
        
        # 計算總分
        messages = Message.objects.filter(
            conversation=conversation,
            role=Message.STUDENT
        )
        total_score = sum(m.score or 0 for m in messages)
        avg_score = total_score / len(messages) if messages else 0
        
        # 更新對話
        conversation.score = avg_score
        conversation.completed_at = timezone.now()
        conversation.save()
        
        # 清理處理器
        if conversation.id in conversation_handlers:
            del conversation_handlers[conversation.id]
        
        return Response(ConversationSerializer(conversation).data)