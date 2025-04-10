'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import DashboardLayout from '@/components/layouts/DashboardLayout';

// 类型定义
interface Conversation {
  id: string;
  patientName: string;
  date: string;
  score: number;
  duration: string;
  status: 'completed' | 'in_progress';
}

interface Stats {
  totalConversations: number;
  averageScore: number;
  completedCases: number;
  inProgressCases: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    totalConversations: 0,
    averageScore: 0,
    completedCases: 0,
    inProgressCases: 0
  });
  const [recentConversations, setRecentConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // 检查用户是否已登录
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    // 获取仪表板数据
    const fetchDashboardData = async () => {
      try {
        // 模拟API调用
        // 实际项目中应该替换为真实的API调用
        // const statsResponse = await axios.get('/api/dashboard/stats', {
        //   headers: { Authorization: `Bearer ${token}` }
        // });
        
        // const conversationsResponse = await axios.get('/api/dashboard/recent-conversations', {
        //   headers: { Authorization: `Bearer ${token}` }
        // });
        
        // 模拟数据
        const mockStats = {
          totalConversations: 12,
          averageScore: 85,
          completedCases: 10,
          inProgressCases: 2
        };
        
        const mockConversations = [
          {
            id: '1',
            patientName: '张三 - 发热腹泻',
            date: '2023-05-15',
            score: 92,
            duration: '15分钟',
            status: 'completed' as const
          },
          {
            id: '2',
            patientName: '李四 - 咳嗽胸痛',
            date: '2023-05-10',
            score: 78,
            duration: '12分钟',
            status: 'completed' as const
          },
          {
            id: '3',
            patientName: '王五 - 头痛眩晕',
            date: '2023-05-05',
            score: 85,
            duration: '18分钟',
            status: 'completed' as const
          },
          {
            id: '4',
            patientName: '赵六 - 腰背痛',
            date: '2023-04-28',
            score: 0,
            duration: '进行中',
            status: 'in_progress' as const
          }
        ];
        
        setStats(mockStats);
        setRecentConversations(mockConversations);
      } catch (err) {
        console.error('获取仪表板数据失败:', err);
        setError('无法加载仪表板数据，请稍后再试');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [router]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">仪表板</h1>
          <p className="mt-1 text-sm text-gray-500">
            查看您的学习进度和最近的对话记录
          </p>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* 总对话数 */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                  <svg className="h-6 w-6 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      总对话数
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">
                        {stats.totalConversations}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* 平均得分 */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                  <svg className="h-6 w-6 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 6L9 17l-5-5"></path>
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      平均得分
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">
                        {stats.averageScore}分
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* 已完成案例 */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                  <svg className="h-6 w-6 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4-8c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4 4 1.79 4 4 4zm-2 0c0-2.21-1.79-4-4-4s-4 1.79-4 4 1.79 4 4 4 4-1.79 4-4 4z"></path>
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      已完成案例
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">
                        {stats.completedCases}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* 进行中案例 */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                  <svg className="h-6 w-6 text-yellow-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4-8c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4 4 1.79 4 4 4zm-2 0c0-2.21-1.79-4-4-4s-4 1.79-4 4 1.79 4 4 4z"></path>
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      进行中案例
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">
                        {stats.inProgressCases}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 最近对话 */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                最近对话
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                您最近的虚拟病人对话记录
              </p>
            </div>
            <Link 
              href="/dashboard/history"
              className="text-sm font-medium text-blue-600 hover:text-blue-500 flex items-center"
            >
              查看全部
              <svg className="ml-1 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 5l1.42 1.42L5.84 10H22v2H5.84l4.58 4.58L9 19l-6-6 6-6z"></path>
              </svg>
            </Link>
          </div>
          <div className="border-t border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      病例
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      日期
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      时长
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      得分
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      状态
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentConversations.map((conversation) => (
                    <tr key={conversation.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {conversation.patientName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {conversation.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {conversation.duration}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {conversation.status === 'completed' ? (
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            conversation.score >= 90 ? 'bg-green-100 text-green-800' :
                            conversation.score >= 70 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {conversation.score}分
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {conversation.status === 'completed' ? (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            已完成
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            进行中
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {conversation.status === 'completed' ? (
                          <Link 
                            href={`/dashboard/result/${conversation.id}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            查看结果
                          </Link>
                        ) : (
                          <Link 
                            href={`/dashboard/conversation/${conversation.id}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            继续对话
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 开始新对话按钮 */}
        <div className="flex justify-center">
          <Link 
            href="/dashboard/conversation/new"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            开始新对话
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
} 