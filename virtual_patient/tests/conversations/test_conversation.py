import pytest
from django.urls import reverse
from conversations.models import Conversation, Patient

@pytest.mark.django_db
def test_create_conversation(authenticated_client, test_user):
    """測試創建新對話"""
    # 創建測試虛擬病人
    patient = Patient.objects.create(
        name="對話測試病人",
        description="用於測試對話功能的虛擬病人"
    )
    
    # 準備創建對話的數據
    conversation_data = {
        'patient': patient.id,
        'title': '測試對話'
    }
    
    # 發送創建對話請求
    url = reverse('conversation-list')
    response = authenticated_client.post(url, conversation_data, format='json')
    
    # 檢查響應
    assert response.status_code == 201
    assert response.data['title'] == '測試對話'
    
    # 檢查對話是否在數據庫中創建
    assert Conversation.objects.filter(title='測試對話').exists() 