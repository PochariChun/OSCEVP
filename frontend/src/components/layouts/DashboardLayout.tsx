'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Home, 
  MessageSquare, 
  History, 
  Settings, 
  LogOut, 
  Menu, 
  X 
} from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    // 清除本地存儲的token
    localStorage.removeItem('token');
    // 重定向到登錄頁面
    router.push('/login');
  };

  const navigation = [
    { name: '儀表板', href: '/dashboard', icon: Home },
    { name: '開始對話', href: '/dashboard/conversation', icon: MessageSquare },
    { name: '歷史記錄', href: '/dashboard/history', icon: History },
    { name: '設置', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 移動端側邊欄 */}
      <div className="lg:hidden">
        <div className="fixed inset-0 flex z-40">
          {/* 側邊欄背景遮罩 */}
          {isSidebarOpen && (
            <div 
              className="fixed inset-0 bg-gray-600 bg-opacity-75"
              onClick={() => setIsSidebarOpen(false)}
            ></div>
          )}

          {/* 側邊欄 */}
          <div 
            className={`fixed inset-y-0 left-0 flex flex-col w-64 bg-white transform ${
              isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } transition-transform duration-300 ease-in-out`}
          >
            <div className="flex items-center justify-between h-16 px-4 border-b">
              <Link href="/dashboard" className="flex items-center">
                <Image
                  src="/images/logo.svg"
                  alt="虛擬病人系統"
                  width={40}
                  height={40}
                />
                <span className="ml-2 text-xl font-semibold">虛擬病人系統</span>
              </Link>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <nav className="px-2 py-4 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                      pathname === item.href
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="p-4 border-t">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
              >
                <LogOut className="mr-3 h-5 w-5" />
                退出登錄
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 桌面端側邊欄 */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:border-r lg:border-gray-200 lg:bg-white">
        <div className="flex items-center h-16 px-4 border-b">
          <Link href="/dashboard" className="flex items-center">
            <Image
              src="/images/logo.svg"
              alt="虛擬病人系統"
              width={40}
              height={40}
            />
            <span className="ml-2 text-xl font-semibold">虛擬病人系統</span>
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto">
          <nav className="px-2 py-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  pathname === item.href
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
          >
            <LogOut className="mr-3 h-5 w-5" />
            退出登錄
          </button>
        </div>
      </div>

      {/* 主內容區域 */}
      <div className="lg:pl-64">
        {/* 頂部導航欄 */}
        <div className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 bg-white border-b lg:hidden">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-gray-500 hover:text-gray-700"
          >
            <Menu size={24} />
          </button>
          <Link href="/dashboard">
            <Image
              src="/images/logo.svg"
              alt="虛擬病人系統"
              width={40}
              height={40}
            />
          </Link>
          <div className="w-6"></div> {/* 占位元素，保持居中 */}
        </div>

        {/* 頁面內容 */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
} 