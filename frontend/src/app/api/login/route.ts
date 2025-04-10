import { NextResponse } from 'next/server';
import { generateToken } from '@/utils/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;
    
    // 在實際應用中，這裡應該驗證用戶憑據
    // 這裡只是一個簡單的模擬
    if (email && password) {
      // 模擬成功登入
      const user = {
        id: 'user-123',
        name: email.split('@')[0],
        email
      };
      
      // 生成令牌
      const token = generateToken(user);
      
      return NextResponse.json({
        success: true,
        token,
        user
      });
    }
    
    // 登入失敗
    return NextResponse.json(
      { error: '無效的憑據' },
      { status: 401 }
    );
  } catch (error) {
    console.error('登入時出錯:', error);
    return NextResponse.json(
      { error: '登入時出錯' },
      { status: 500 }
    );
  }
} 