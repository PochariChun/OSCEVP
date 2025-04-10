# 數據庫配置
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'virtual_patient_db',
        'USER': 'postgres',
        'PASSWORD': 'your_password',  # 請替換為您的實際密碼
        'HOST': 'localhost',
        'PORT': '5432',
    }
}

# 設置自定義用戶模型
AUTH_USER_MODEL = 'accounts.User'

# 安裝的應用
INSTALLED_APPS = [
    # Django 內置應用
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # 第三方應用
    'rest_framework',
    'rest_framework.authtoken',
    'corsheaders',  # 處理跨域請求
    
    # 自定義應用
    'accounts',
    'conversations',
    'rag',
]

# REST Framework 配置
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.TokenAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
}

# JWT 配置
from datetime import timedelta
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': False,
    'BLACKLIST_AFTER_ROTATION': True,
}

# 跨域配置
CORS_ALLOW_ALL_ORIGINS = True  # 開發環境使用，生產環境應限制來源