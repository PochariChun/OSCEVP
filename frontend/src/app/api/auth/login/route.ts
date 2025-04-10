import { NextResponse } from 'next/server';
import { userStore } from '@/lib/userStore';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // 基本驗證
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: '電子郵箱和密碼都是必填的' },
        { status: 400 }
      );
    }

    // 查找用戶
    const user = userStore.validate(email, password);
    console.log('嘗試登入:', email);
    console.log('用戶存在:', !!user);
    console.log('當前用戶數:', userStore.getAll().length);
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: '電子郵箱或密碼不正確' },
        { status: 401 }
      );
    }

    // 創建模擬 token
    const token = `mock-token-${Date.now()}`;

    // 返回成功響應
    return NextResponse.json(
      { 
        success: true, 
        message: '登入成功',
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('登入錯誤:', error);
    return NextResponse.json(
      { success: false, message: '服務器錯誤' },
      { status: 500 }
    );
  }
} 