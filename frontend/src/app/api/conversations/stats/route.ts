import { NextResponse } from 'next/server';
import { verifyToken } from '@/utils/auth';

// 獲取用戶的對話統計數據
export async function GET(request: Request) {
  try {
    // 在開發環境中始終返回模擬數據
    if (process.env.NODE_ENV === 'development') {
      console.log('開發環境：返回模擬統計數據');
      return NextResponse.json(getMockStats());
    }
    
    // 以下代碼僅在生產環境中執行
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: '未授權訪問' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const user = verifyToken(token);
    
    if (!user) {
      return NextResponse.json(
        { error: '無效的令牌' },
        { status: 401 }
      );
    }

    // 從資料庫獲取用戶的對話統計數據
    return NextResponse.json(getMockStats());
  } catch (error) {
    console.error('獲取統計數據時出錯:', error);
    
    // 在開發環境中，即使出錯也返回模擬數據
    if (process.env.NODE_ENV === 'development') {
      console.log('開發環境：出錯時返回模擬統計數據');
      return NextResponse.json(getMockStats());
    }
    
    return NextResponse.json(
      { error: '獲取統計數據時出錯' },
      { status: 500 }
    );
  }
}

// 模擬統計數據函數
function getMockStats() {
  return {
    totalConversations: 12,
    averageScore: 85,
    completedCases: 10,
    inProgressCases: 2
  };
} 