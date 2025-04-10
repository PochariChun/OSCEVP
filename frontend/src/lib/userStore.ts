// 這是一個簡單的內存存儲，僅用於開發測試
// 在生產環境中，應該使用數據庫

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // 注意：實際應用中應該存儲哈希值
  role: string;
  createdAt: Date;
}

// 全局用戶存儲
const users: User[] = [];

// 添加一個默認用戶方便測試
users.push({
  id: '1',
  name: '測試用戶',
  email: 'test@example.com',
  password: 'password123',
  role: 'student',
  createdAt: new Date()
});

export const userStore = {
  // 獲取所有用戶
  getAll: () => [...users],
  
  // 通過電子郵箱查找用戶
  findByEmail: (email: string) => users.find(user => user.email === email),
  
  // 添加新用戶
  add: (user: User) => {
    users.push(user);
    return user;
  },
  
  // 驗證用戶憑證
  validate: (email: string, password: string) => {
    const user = users.find(u => u.email === email && u.password === password);
    return user || null;
  }
}; 