from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterView, UserProfileView

urlpatterns = [
    # JWT 認證
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # 用戶註冊和個人資料
    path('register/', RegisterView.as_view(), name='register'),
    path('profile/', UserProfileView.as_view(), name='profile'),
] 