import { NextResponse } from 'next/server';
import { verifyToken } from '@/utils/auth';

// 獲取用戶的對話記錄
export async function GET(request: Request) {
  try {
    // 在開發環境中始終返回模擬數據
    if (process.env.NODE_ENV === 'development') {
      console.log('開發環境：返回模擬數據');
      return NextResponse.json(getMockConversations());
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

    // 從資料庫獲取用戶的對話記錄
    return NextResponse.json(getMockConversations());
  } catch (error) {
    console.error('獲取對話記錄時出錯:', error);
    
    // 在開發環境中，即使出錯也返回模擬數據
    if (process.env.NODE_ENV === 'development') {
      console.log('開發環境：出錯時返回模擬數據');
      return NextResponse.json(getMockConversations());
    }
    
    return NextResponse.json(
      { error: '獲取對話記錄時出錯' },
      { status: 500 }
    );
  }
}

// 模擬數據函數
function getMockConversations() {
  return [
    {
      id: '1',
      patientName: '張三 - 發熱腹瀉',
      date: '2023-05-15',
      score: 92,
      duration: '15分鐘',
      status: 'completed'
    },
    {
      id: '2',
      patientName: '李四 - 頭痛發燒',
      date: '2023-05-10',
      score: 87,
      duration: '12分鐘',
      status: 'completed'
    },
    {
      id: '3',
      patientName: '王五 - 支氣管炎',
      date: '2023-05-05',
      score: 90,
      duration: '18分鐘',
      status: 'completed'
    },
    {
      id: '4',
      patientName: '趙六 - 腰痛',
      date: '2023-04-28',
      score: 0,
      duration: '進行中',
      status: 'in_progress'
    }
  ];
} 