'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, MessageSquare, Brain } from 'lucide-react';

interface ConversationData {
  conversation: {
    role: string;
    content: string;
    timestamp: string;
    time: string;
  }[];
  scores: {
    id: string;
    分類: string;
    項目: string;
    配分: number;
    已得分: boolean;
  }[];
  totalScore: number;
  maxPossibleScore: number;
  duration: number;
  timestamp: string;
}

export default function ResultPage() {
  const router = useRouter();
  const [data, setData] = useState<ConversationData | null>(null);
  const [activeView, setActiveView] = useState<'scores' | 'timeline'>('scores');
  
  useEffect(() => {
    // 從 localStorage 獲取對話數據
    const savedData = localStorage.getItem('lastConversation');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setData(parsedData);
      } catch (error) {
        console.error('解析對話數據時出錯:', error);
      }
    }
  }, []);
  
  // 返回儀表板
  const goToDashboard = () => {
    router.push('/dashboard');
  };
  
  // 開始反思
  const startReflection = () => {
    router.push('/conversation/reflection');
  };
  
  // 格式化時間
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}分${secs}秒`;
  };
  
  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>無對話數據</CardTitle>
            <CardDescription>
              未找到最近的對話數據。請先進行一次對話。
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={goToDashboard}>
              返回儀表板
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={goToDashboard}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回儀表板
          </Button>
          
          <Button onClick={startReflection}>
            <Brain className="h-4 w-4 mr-2" />
            開始反思
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">總分</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">
                {data.totalScore}/{data.maxPossibleScore}
              </div>
              <Progress value={(data.totalScore / data.maxPossibleScore) * 100} className="h-2" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">對話時間</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
              <span className="text-2xl font-bold">{formatDuration(data.duration)}</span>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">對話交流</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
              <span className="text-2xl font-bold">{data.conversation.length} 條消息</span>
            </CardContent>
          </Card>
        </div>
        
        <div className="mb-6">
          <div className="flex space-x-4 mb-4">
            <Button 
              variant={activeView === 'scores' ? 'default' : 'outline'}
              onClick={() => setActiveView('scores')}
            >
              評分詳情
            </Button>
            <Button 
              variant={activeView === 'timeline' ? 'default' : 'outline'}
              onClick={() => setActiveView('timeline')}
            >
              對話時間軸
            </Button>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            {activeView === 'scores' ? (
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4">評分詳情</h3>
                <div className="space-y-4">
                  {data.scores.map((score, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Badge variant={score.已得分 ? "success" : "outline"} className="mr-3">
                          {score.已得分 ? "✓" : "✗"}
                        </Badge>
                        <div>
                          <p className="font-medium">{score.項目}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{score.分類}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold">{score.已得分 ? score.配分 : 0}</span>
                        <span className="text-gray-500 dark:text-gray-400">/{score.配分}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4">對話時間軸</h3>
                <div className="space-y-6">
                  {data.conversation.map((message, index) => {
                    const date = new Date(message.timestamp);
                    return (
                      <div key={index} className="flex">
                        {/* 時間軸線 */}
                        <div className="mr-4 relative">
                          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
                          <div className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center ${
                            message.role === 'user' 
                              ? 'bg-blue-500' 
                              : 'bg-green-500'
                          } flex items-center justify-center`}>
                            <MessageSquare className="h-3 w-3 text-white" />
                          </div>
                        </div>
                        
                        {/* 消息卡片 */}
                        <div className="ml-2">
                          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                            {message.time} - {message.role === 'user' ? '您' : '虛擬病人'}
                          </div>
                          <div className={`p-3 rounded-lg ${
                            message.role === 'user' 
                              ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100' 
                              : 'bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-100'
                          }`}>
                            {message.content}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 