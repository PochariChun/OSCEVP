'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { 
  Clock, 
  Award, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  ArrowRight
} from 'lucide-react';

// 類型定義
interface ResultData {
  id: string;
  patientName: string;
  date: string;
  duration: string;
  totalScore: number;
  categories: {
    name: string;
    score: number;
    maxScore: number;
    questions: {
      question: string;
      asked: boolean;
      score: number;
      maxScore: number;
    }[];
  }[];
}

export default function ResultPage() {
  const [resultData, setResultData] = useState<ResultData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    // 檢查用戶是否已登錄
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    // 獲取評分結果數據
    const fetchResultData = async () => {
      try {
        // 模擬API調用
        // 實際項目中應該替換為真實的API調用
        // const response = await axios.get(`/api/conversation/result/${id}`, {
        //   headers: { Authorization: `Bearer ${token}` }
        // });
        
        // 模擬數據
        const mockResultData: ResultData = {
          id: id as string,
          patientName: '張三 - 發熱腹瀉',
          date: '2023-05-15',
          duration: '15分鐘',
          totalScore: 92,
          categories: [
            {
              name: '禮貌性問題',
              score: 20,
              maxScore: 20,
              questions: [
                {
                  question: '詢問患者姓名',
                  asked: true,
                  score: 5,
                  maxScore: 5
                },
                {
                  question: '詢問患者年齡',
                  asked: true,
                  score: 5,
                  maxScore: 5
                },
                {
                  question: '詢問患者職業',
                  asked: true,
                  score: 5,
                  maxScore: 5
                },
                {
                  question: '詢問患者住址',
                  asked: true,
                  score: 5,
                  maxScore: 5
                }
              ]
            },
            {
              name: '主訴相關問題',
              score: 35,
              maxScore: 40,
              questions: [
                {
                  question: '詢問發熱程度',
                  asked: true,
                  score: 10,
                  maxScore: 10
                },
                {
                  question: '詢問發熱持續時間',
                  asked: true,
                  score: 10,
                  maxScore: 10
                },
                {
                  question: '詢問腹瀉頻率',
                  asked: true,
                  score: 10,
                  maxScore: 10
                },
                {
                  question: '詢問腹瀉性質',
                  asked: true,
                  score: 5,
                  maxScore: 10
                }
              ]
            },
            {
              name: '相關症狀問題',
              score: 37,
              maxScore: 40,
              questions: [
                {
                  question: '詢問是否有嘔吐',
                  asked: true,
                  score: 10,
                  maxScore: 10
                },
                {
                  question: '詢問是否有腹痛',
                  asked: true,
                  score: 10,
                  maxScore: 10
                },
                {
                  question: '詢問是否有食慾變化',
                  asked: true,
                  score: 10,
                  maxScore: 10
                },
                {
                  question: '詢問是否有頭痛',
                  asked: false,
                  score: 7,
                  maxScore: 10
                }
              ]
            }
          ]
        };
        
        setResultData(mockResultData);
      } catch (err) {
        console.error('獲取評分結果數據失敗:', err);
        setError('無法加載評分結果數據，請稍後再試');
      } finally {
        setIsLoading(false);
      }
    };

    fetchResultData();
  }, [id, router]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !resultData) {
    return (
      <DashboardLayout>
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {error || '無法加載評分結果數據'}
              </p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">對話評分結果</h1>
          <p className="mt-1 text-sm text-gray-500">
            查看您與虛擬病人的對話評分詳情
          </p>
        </div>

        {/* 評分概覽 */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {resultData.patientName}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              {resultData.date}
            </p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                  <Award className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500">總分</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {resultData.totalScore}
                    <span className="text-sm text-gray-500">/100</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                  <Clock className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500">對話時長</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {resultData.duration}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                  <CheckCircle className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500">完成狀態</p>
                  <p className="text-lg font-semibold text-green-600">
                    已完成
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 分類評分詳情 */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              評分詳情
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              按問題類別劃分的評分詳情
            </p>
          </div>
          <div className="border-t border-gray-200">
            {resultData.categories.map((category, index) => (
              <div key={index} className="border-b border-gray-200 last:border-b-0">
                <div className="px-4 py-5 sm:px-6">
                  <div className="flex justify-between items-center">
                    <h4 className="text-md font-medium text-gray-900">
                      {category.name}
                    </h4>
                    <div className="flex items-center">
                      <span className="text-lg font-semibold text-gray-900">
                        {category.score}
                      </span>
                      <span className="text-sm text-gray-500 ml-1">
                        /{category.maxScore}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${(category.score / category.maxScore) * 100}%` }}
                    ></div>
                  </div>
                  <div className="mt-4 space-y-3">
                    {category.questions.map((question, qIndex) => (
                      <div key={qIndex} className="flex justify-between items-center">
                        <div className="flex items-center">
                          {question.asked ? (
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500 mr-2" />
                          )}
                          <span className="text-sm text-gray-700">
                            {question.question}
                          </span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-900">
                            {question.score}
                          </span>
                          <span className="text-sm text-gray-500">
                            /{question.maxScore}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 開始反思按鈕 */}
        <div className="flex justify-center">
          <Link 
            href={`/dashboard/reflection/${id}`}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            開始反思
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
} 