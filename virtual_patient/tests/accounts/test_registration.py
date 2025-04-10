import pytest
from django.urls import reverse
import psycopg2
from django.conf import settings
from accounts.models import User

@pytest.mark.django_db
def test_user_registration_in_postgresql(api_client):
    """測試用戶註冊後數據是否正確保存到 PostgreSQL 數據庫"""
    # 準備註冊數據
    registration_data = {
        'username': 'newuser',
        'email': 'newuser@example.com',
        'password': 'securepassword123',
        'name': '新測試用戶'
    }
    
    # 發送註冊請求
    url = reverse('register')
    response = api_client.post(url, registration_data, format='json')
    
    # 檢查響應狀態碼
    assert response.status_code == 201
    
    # 檢查用戶是否在 Django ORM 中創建
    assert User.objects.filter(username='newuser').exists()
    
    # 直接連接 PostgreSQL 檢查數據
    conn = psycopg2.connect(
        dbname=settings.DATABASES['default']['NAME'],
        user=settings.DATABASES['default']['USER'],
        password=settings.DATABASES['default']['PASSWORD'],
        host=settings.DATABASES['default']['HOST'],
        port=settings.DATABASES['default']['PORT']
    )
    
    cursor = conn.cursor()
    
    # 查詢用戶表
    cursor.execute(f"SELECT username, email, name FROM {User._meta.db_table} WHERE username = 'newuser'")
    result = cursor.fetchone()
    
    # 關閉連接
    cursor.close()
    conn.close()
    
    # 驗證數據庫中的數據
    assert result is not None
    assert result[0] == 'newuser'  # username
    assert result[1] == 'newuser@example.com'  # email
    assert result[2] == '新測試用戶'  # name
    
    # 檢查響應中是否包含 JWT token
    assert 'access' in response.data
    assert 'refresh' in response.data 