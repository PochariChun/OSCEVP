import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from ..models import User

@pytest.mark.django_db
def test_user_login_with_registered_credentials():
    """測試已註冊用戶是否能成功登入"""
    client = APIClient()
    
    # 創建測試用戶
    user = User.objects.create_user(
        username='logintest',
        email='login@example.com',
        password='securepassword123',
        name='登入測試用戶'
    )
    
    # 準備登入數據
    login_data = {
        'username': 'logintest',
        'password': 'securepassword123'
    }
    
    # 發送登入請求
    url = reverse('token_obtain_pair')
    response = client.post(url, login_data, format='json')
    
    # 檢查響應狀態碼
    assert response.status_code == 200
    
    # 檢查響應中是否包含 JWT token
    assert 'access' in response.data
    assert 'refresh' in response.data
    
    # 使用獲取的 token 訪問受保護的端點
    profile_url = reverse('profile')
    auth_client = APIClient()
    auth_client.credentials(HTTP_AUTHORIZATION=f"Bearer {response.data['access']}")
    
    profile_response = auth_client.get(profile_url)
    
    # 檢查是否能成功訪問個人資料
    assert profile_response.status_code == 200
    assert profile_response.data['username'] == 'logintest'
    assert profile_response.data['email'] == 'login@example.com'
    assert profile_response.data['name'] == '登入測試用戶' 