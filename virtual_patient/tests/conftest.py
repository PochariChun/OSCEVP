"""
pytest 配置文件，包含共享的 fixtures
"""
import pytest
from rest_framework.test import APIClient
from accounts.models import User

@pytest.fixture
def api_client():
    """返回一個 API 客戶端實例"""
    return APIClient()

@pytest.fixture
def test_user():
    """創建並返回一個測試用戶"""
    user = User.objects.create_user(
        username='testuser',
        email='test@example.com',
        password='securepassword123',
        name='測試用戶'
    )
    return user

@pytest.fixture
def authenticated_client(api_client, test_user):
    """返回一個已認證的 API 客戶端"""
    from rest_framework_simplejwt.tokens import RefreshToken
    refresh = RefreshToken.for_user(test_user)
    
    api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")
    return api_client 