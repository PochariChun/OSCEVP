import pytest
from django.urls import reverse

@pytest.mark.django_db
def test_user_login_with_registered_credentials(api_client, test_user):
    """測試已註冊用戶是否能成功登入"""
    # 準備登入數據
    login_data = {
        'username': 'testuser',
        'password': 'securepassword123'
    }
    
    # 發送登入請求
    url = reverse('token_obtain_pair')
    response = api_client.post(url, login_data, format='json')
    
    # 檢查響應狀態碼
    assert response.status_code == 200
    
    # 檢查響應中是否包含 JWT token
    assert 'access' in response.data
    assert 'refresh' in response.data

@pytest.mark.django_db
def test_user_profile_access(authenticated_client, test_user):
    """測試已認證用戶是否能訪問個人資料"""
    # 訪問個人資料端點
    url = reverse('profile')
    response = authenticated_client.get(url)
    
    # 檢查是否能成功訪問個人資料
    assert response.status_code == 200
    assert response.data['username'] == test_user.username
    assert response.data['email'] == test_user.email
    assert response.data['name'] == test_user.name 