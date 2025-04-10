'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Mic, MicOff, StopCircle, Clock } from 'lucide-react';

// 模擬評分標準
const scoringCriteria = [
  { id: "確認床號", 分類: "病人辨識", 項目: "確認床號", 配分: 2, 已得分: false },
  { id: "詢問病人姓名", 分類: "病人辨識", 項目: "詢問病人姓名", 配分: 2, 已得分: false },
  { id: "核對病人手圈或腳圈", 分類: "病人辨識", 項目: "核對病人手圈或腳圈", 配分: 2, 已得分: false },
  // ... 其他評分標準
];

export default function ConversationPage() {
  const router = useRouter();
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [conversation, setConversation] = useState<{role: string, content: string, timestamp: Date, time: string}[]>([]);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isConversationActive, setIsConversationActive] = useState(false);
  const [scores, setScores] = useState(scoringCriteria);
  const [totalScore, setTotalScore] = useState(0);
  const [maxPossibleScore, setMaxPossibleScore] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const conversationEndRef = useRef<HTMLDivElement>(null);
  
  // 計算總分和最大可能分數
  useEffect(() => {
    const max = scores.reduce((sum, item) => sum + item.配分, 0);
    setMaxPossibleScore(max);
    
    const current = scores.reduce((sum, item) => sum + (item.已得分 ? item.配分 : 0), 0);
    setTotalScore(current);
  }, [scores]);
  
  // 初始化語音識別
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      // @ts-ignore
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'zh-TW';
      
      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        
        if (finalTranscript) {
          setTranscript(finalTranscript);
          handleUserInput(finalTranscript);
        }
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('語音識別錯誤:', event.error);
        setIsRecording(false);
      };
    } else {
      console.error('您的瀏覽器不支持語音識別');
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);
  
  // 開始對話
  const startConversation = () => {
    setIsConversationActive(true);
    
    // 不添加歡迎消息到對話記錄中
    // 只設置空的對話數組
    setConversation([]);
    
    // 開始計時器
    timerRef.current = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
    
    // 自動開始錄音
    setTimeout(() => {
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsRecording(true);
      }
    }, 1000);
  };
  
  // 結束對話
  const endConversation = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsRecording(false);
    setIsConversationActive(false);
    
    // 保存對話結果
    const conversationData = {
      conversation: conversation.map(msg => ({
        ...msg,
        timestamp: msg.timestamp.toISOString()
      })),
      scores,
      totalScore,
      maxPossibleScore,
      duration: elapsedTime,
      timestamp: new Date().toISOString()
    };
    
    // 保存到 localStorage
    localStorage.setItem('lastConversation', JSON.stringify(conversationData));
    
    // 導航到結果頁面
    router.push('/conversation/result');
  };
  
  // 切換錄音狀態
  const toggleRecording = () => {
    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }
      setIsRecording(true);
    }
  };
  
  // 格式化時間
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // 使用 TTS 播放文字
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-TW';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      
      window.speechSynthesis.speak(utterance);
    } else {
      console.error('您的瀏覽器不支持語音合成');
    }
  };
  
  // 處理用戶輸入
  const handleUserInput = (text: string) => {
    // 添加用戶消息到對話
    const userMessage = {
      role: 'user',
      content: text,
      timestamp: new Date(),
      time: formatTime(elapsedTime)
    };
    setConversation(prev => [...prev, userMessage]);
    setTranscript('');
    
    // 模擬評分
    const newScores = [...scores];
    
    // 根據用戶輸入更新評分
    if (text.includes('床號') || text.includes('病床')) {
      const index = newScores.findIndex(item => item.id === '確認床號');
      if (index !== -1 && !newScores[index].已得分) {
        newScores[index].已得分 = true;
      }
    }
    
    if (text.includes('姓名') || text.includes('叫什麼')) {
      const index = newScores.findIndex(item => item.id === '詢問病人姓名');
      if (index !== -1 && !newScores[index].已得分) {
        newScores[index].已得分 = true;
      }
    }
    
    if (text.includes('手圈') || text.includes('腳圈') || text.includes('識別')) {
      const index = newScores.findIndex(item => item.id === '核對病人手圈或腳圈');
      if (index !== -1 && !newScores[index].已得分) {
        newScores[index].已得分 = true;
      }
    }
    
    setScores(newScores);
    
    // 模擬虛擬病人回應
    setTimeout(() => {
      let response = '';
      
      if (text.includes('床號') || text.includes('病床')) {
        response = '我們在5號床。';
      } else if (text.includes('姓名') || text.includes('叫什麼')) {
        response = '我是小明的媽媽，小明今年3歲。';
      } else if (text.includes('手圈') || text.includes('腳圈')) {
        response = '好的，您可以看一下小明的手圈。';
      } else if (text.includes('不舒服') || text.includes('症狀') || text.includes('怎麼了')) {
        response = '小明從昨天開始一直腹瀉，今天早上又開始嘔吐，所以我們來醫院了。';
      } else if (text.includes('大便') || text.includes('腹瀉')) {
        response = '昨天開始腹瀉，一天大概5-6次，大便很稀，有點黃綠色，沒有看到血絲。';
      } else if (text.includes('嘔吐')) {
        response = '今天早上開始嘔吐，已經吐了3次，吐出來的是一些食物殘渣和黃色的液體。';
      } else if (text.includes('食慾') || text.includes('吃東西')) {
        response = '食慾不太好，昨天只吃了一點點飯，今天早上喝了一點牛奶就開始嘔吐了。';
      } else {
        response = '對不起，我不太明白您的意思。您能再說一次嗎？';
      }
      
      const botMessage = {
        role: 'system',
        content: response,
        timestamp: new Date(),
        time: formatTime(elapsedTime)
      };
      
      setConversation(prev => [...prev, botMessage]);
      
      // 使用 TTS 播放回應
      speakText(response);
      
      // 滾動到對話底部
      if (conversationEndRef.current) {
        conversationEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 1000);
  };
  
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* 頂部計時器和結束按鈕 */}
      <div className="bg-white dark:bg-gray-800 p-4 shadow-md flex justify-between items-center">
        <div className="flex items-center">
          <Clock className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
          <span className="text-lg font-medium">{formatTime(elapsedTime)}</span>
        </div>
        
        <Button 
          variant="destructive" 
          onClick={endConversation}
          disabled={!isConversationActive}
        >
          <StopCircle className="h-4 w-4 mr-2" />
          結束對話
        </Button>
      </div>
      
      {/* 主要內容區 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 左側虛擬病人區域 */}
        <div className="w-1/2 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 p-6">
          <div className="relative mb-6">
            <Image
              src="/images/virtualpatient.png"
              alt="虛擬病人"
              width={400}
              height={400}
              className="rounded-lg shadow-lg"
            />
            
            {isSpeaking && (
              <div className="absolute bottom-4 right-4 bg-white dark:bg-gray-700 rounded-full p-2 shadow-md">
                <div className="flex space-x-1">
                  <span className="w-2 h-4 bg-blue-500 rounded-full animate-pulse"></span>
                  <span className="w-2 h-4 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-4 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}
          </div>
          
          {!isConversationActive ? (
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                虛擬病人對話訓練
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                歡迎來到虛擬病人對話系統。在這個模擬中，您將與一位3歲兒童的母親進行入院評估對話。
                <br /><br />
                請點擊「開始對話」按鈕開始模擬，並使用麥克風進行語音交流。
              </p>
              <Button 
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                size="lg"
                onClick={startConversation}
              >
                開始對話
              </Button>
            </div>
          ) : (
            <Card className="w-full max-w-md">
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">評估提示</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  請記得詢問以下關鍵信息：
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <Badge variant={scores[0].已得分 ? "success" : "outline"} className="mr-2">
                      {scores[0].已得分 ? "✓" : "•"}
                    </Badge>
                    確認床號
                  </li>
                  <li className="flex items-center">
                    <Badge variant={scores[1].已得分 ? "success" : "outline"} className="mr-2">
                      {scores[1].已得分 ? "✓" : "•"}
                    </Badge>
                    詢問病人姓名
                  </li>
                  <li className="flex items-center">
                    <Badge variant={scores[2].已得分 ? "success" : "outline"} className="mr-2">
                      {scores[2].已得分 ? "✓" : "•"}
                    </Badge>
                    核對病人手圈或腳圈
                  </li>
                </ul>
              </div>
            </Card>
          )}
        </div>
        
        {/* 右側對話區域 */}
        <div className="w-1/2 flex flex-col bg-white dark:bg-gray-900">
          {/* 對話歷史 */}
          <div className="flex-1 overflow-y-auto p-4">
            {conversation.map((message, index) => (
              <div 
                key={index} 
                className={`mb-4 ${message.role === 'user' ? 'text-right' : ''}`}
              >
                <div 
                  className={`inline-block max-w-[80%] px-4 py-2 rounded-lg ${
                    message.role === 'user' 
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100' 
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                  }`}
                >
                  <p>{message.content}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {message.time}
                  </p>
                </div>
              </div>
            ))}
            <div ref={conversationEndRef} />
          </div>
          
          {/* 語音輸入區域 */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            {isConversationActive && (
              <div className="flex items-center">
                <Button
                  variant={isRecording ? "destructive" : "default"}
                  size="icon"
                  className="h-12 w-12 rounded-full mr-4"
                  onClick={toggleRecording}
                  disabled={isSpeaking}
                >
                  {isRecording ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                </Button>
                
                <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-3 min-h-[50px]">
                  {isRecording ? (
                    <div className="flex items-center">
                      <div className="flex space-x-1 mr-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></span>
                      </div>
                      <span className="text-gray-500 dark:text-gray-400">正在聆聽...</span>
                    </div>
                  ) : (
                    <span className="text-gray-500 dark:text-gray-400">
                      {transcript || "點擊麥克風按鈕開始說話"}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 