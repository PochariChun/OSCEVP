import { NextResponse } from 'next/server';
import { userStore, User } from '@/lib/userStore';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, role } = body;

    // 基本驗證
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { success: false, message: '所有欄位都是必填的' },
        { status: 400 }
      );
    }

    // 檢查郵箱是否已被使用
    const existingUser = userStore.findByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: '此電子郵箱已被註冊' },
        { status: 400 }
      );
    }

    // 創建新用戶
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      password, // 注意：實際應用中應該對密碼進行哈希處理
      role,
      createdAt: new Date()
    };

    // 添加到用戶存儲
    userStore.add(newUser);
    console.log('註冊用戶:', newUser.email);
    console.log('當前用戶數:', userStore.getAll().length);

    // 返回成功響應
    return NextResponse.json(
      { 
        success: true, 
        message: '註冊成功',
        user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('註冊錯誤:', error);
    return NextResponse.json(
      { success: false, message: '服務器錯誤' },
      { status: 500 }
    );
  }
} 