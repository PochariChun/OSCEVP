from django.urls import path
from .views import PatientListView, ConversationListView, ConversationDetailView, MessageView

urlpatterns = [
    path('patients/', PatientListView.as_view(), name='patient-list'),
    path('', ConversationListView.as_view(), name='conversation-list'),
    path('<int:pk>/', ConversationDetailView.as_view(), name='conversation-detail'),
    path('<int:conversation_id>/messages/', MessageView.as_view(), name='message-create'),
] 