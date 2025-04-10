// 在客戶端環境中，我們不能使用 jsonwebtoken
// 這個文件提供了一個簡單的模擬實現

// 模擬 JWT 令牌驗證
export function verifyToken(token: string) {
  // 在開發環境中，始終返回一個模擬用戶
  if (process.env.NODE_ENV === 'development') {
    return {
      id: 'dev-user-id',
      name: '測試用戶',
      email: 'test@example.com'
    };
  }
  
  try {
    // 在生產環境中，我們應該使用 jsonwebtoken
    // 但在客戶端，我們不能直接使用它
    // 這裡只是一個簡單的模擬
    if (token === 'invalid-token') {
      return null;
    }
    
    // 解析令牌（這只是一個模擬）
    return {
      id: 'user-id',
      name: '用戶名',
      email: 'user@example.com'
    };
  } catch (error) {
    console.error('令牌驗證錯誤:', error);
    return null;
  }
}

// 生成令牌（僅用於模擬）
export function generateToken(user: any) {
  // 在實際應用中，這應該使用 jsonwebtoken 生成令牌
  return 'mock-token-' + Math.random().toString(36).substring(2);
} 