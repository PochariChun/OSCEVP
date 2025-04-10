import pytest
from django.urls import reverse
from virtual_patient.conversations.models import Patient

@pytest.mark.django_db
def test_patient_list(authenticated_client):
    """測試獲取虛擬病人列表"""
    # 創建測試虛擬病人
    Patient.objects.create(
        name="測試病人",
        description="這是一個測試用的虛擬病人"
    )
    
    # 訪問虛擬病人列表端點
    url = reverse('patient-list')
    response = authenticated_client.get(url)
    
    # 檢查響應
    assert response.status_code == 200
    assert len(response.data) >= 1
    assert response.data[0]['name'] == "測試病人" 