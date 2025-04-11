'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Send, StopCircle, Clock, Circle } from 'lucide-react';
import toast from 'react-hot-toast';

// 模擬語音識別服務
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

// 虛擬病人角色設定
const virtualPatientRole = {
  name: "小威媽媽",
  patientName: "張小威",
  patientAge: "2歲",
  condition: "腹瀉發燒"
};

export default function ConversationPage() {
  const router = useRouter();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string; timestamp: number }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationStarted, setConversationStarted] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const [imageEnlarged, setImageEnlarged] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [isBrowserSupported, setIsBrowserSupported] = useState(true);
  const [isSecureContext, setIsSecureContext] = useState(true);
  
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 檢查瀏覽器支持和安全上下文
  useEffect(() => {
    // 檢查是否在客戶端
    if (typeof window === 'undefined') return;
    
    // 檢查是否在安全上下文中
    const isContextSecure = window.isSecureContext !== undefined ? window.isSecureContext : location.protocol === 'https:';
    setIsSecureContext(isContextSecure);
    
    if (!isContextSecure) {
      console.warn('應用運行在非安全上下文中，語音識別可能不可用');
    }
    
    // 檢查語音識別API
    const hasSpeechRecognition = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
    
    // 檢查媒體設備API
    const hasMediaDevices = navigator && 'mediaDevices' in navigator;
    
    setIsBrowserSupported(hasSpeechRecognition && hasMediaDevices);
    
    if (!hasSpeechRecognition) {
      console.warn('此瀏覽器不支持語音識別API');
    }
    
    if (!hasMediaDevices) {
      console.warn('此瀏覽器不支持媒體設備API');
    }
  }, []);

  // 請求麥克風權限 - 使用更穩健的方法
  const requestMicrophonePermission = async () => {
    try {
      // 檢查是否在安全上下文中
      if (!isSecureContext) {
        console.error('非安全上下文中無法訪問麥克風');
        toast.error('請在 HTTPS 或 localhost 環境中使用語音功能');
        return false;
      }
      
      // 檢查navigator.mediaDevices是否存在
      if (!navigator || !navigator.mediaDevices) {
        console.error('此瀏覽器不支持媒體設備API');
        toast.error('您的瀏覽器不支持麥克風功能，請使用模擬輸入或更換瀏覽器');
        return false;
      }
      
      // 使用 try-catch 包裝 getUserMedia 調用
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // 獲取權限後立即釋放媒體流
        stream.getTracks().forEach(track => track.stop());
        setPermissionGranted(true);
        return true;
      } catch (mediaError: any) {
        console.error('麥克風訪問錯誤:', mediaError.name, mediaError.message);
        
        if (mediaError.name === 'NotAllowedError' || mediaError.name === 'PermissionDeniedError') {
          toast.error('麥克風權限被拒絕，請在瀏覽器設置中允許訪問');
        } else if (mediaError.name === 'NotFoundError' || mediaError.name === 'DevicesNotFoundError') {
          toast.error('未檢測到麥克風設備');
        } else if (mediaError.name === 'NotReadableError' || mediaError.name === 'TrackStartError') {
          toast.error('麥克風被其他應用程序佔用');
        } else {
          toast.error(`麥克風訪問錯誤: ${mediaError.message || mediaError.name}`);
        }
        return false;
      }
    } catch (error) {
      console.error('無法獲取麥克風權限:', error);
      toast.error('請允許麥克風權限以使用語音功能，或使用模擬輸入');
      return false;
    }
  };

  // 初始化語音識別
  useEffect(() => {
    const initSpeechRecognition = async () => {
      if (typeof window === 'undefined') return;
      
      // 如果瀏覽器不支持或非安全上下文，則不初始化
      if (!isBrowserSupported || !isSecureContext) {
        console.warn('瀏覽器不支持語音功能或非安全上下文，將使用模擬輸入');
        return;
      }
      
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          // 嘗試初始化語音識別
          recognitionRef.current = new SpeechRecognition();
          recognitionRef.current.continuous = true;
          recognitionRef.current.interimResults = true;
          recognitionRef.current.lang = 'zh-TW';

          recognitionRef.current.onresult = (event: any) => {
            let finalTranscript = '';
            let interimTranscript = '';
            
            for (let i = event.resultIndex; i < event.results.length; i++) {
              const transcript = event.results[i][0].transcript;
              if (event.results[i].isFinal) {
                finalTranscript += transcript;
              } else {
                interimTranscript += transcript;
              }
            }
            
            // 更新中間結果
            if (interimTranscript) {
              setTranscript(interimTranscript);
            }
            
            // 處理最終結果
            if (finalTranscript) {
              setTranscript(finalTranscript);
              // 如果是最終結果，可以自動發送
              if (conversationStarted && finalTranscript.trim()) {
                sendMessageWithText(finalTranscript.trim());
                setTranscript(''); // 清空輸入框
              }
            }
          };

          recognitionRef.current.onerror = (event: any) => {
            console.error('語音識別錯誤:', event.error);
            // 忽略 no-speech 錯誤，這是正常情況
            if (event.error !== 'no-speech') {
              toast.error(`語音識別錯誤: ${event.error}`);
              setIsListening(false);
            }
          };

          recognitionRef.current.onend = () => {
            console.log('語音識別已停止');
            // 如果仍處於聆聽狀態，則重新啟動
            if (isListening && conversationStarted) {
              try {
                recognitionRef.current.start();
                console.log('語音識別已重新啟動');
              } catch (error) {
                console.error('重新啟動語音識別失敗:', error);
              }
            }
          };

          console.log('語音識別初始化成功');
        } catch (error) {
          console.error('初始化語音識別失敗:', error);
        }
      } else {
        console.warn('此瀏覽器不支持語音識別API');
      }
    };
    
    initSpeechRecognition();
  }, [isBrowserSupported, conversationStarted, isListening]);

  // 自動滾動到最新消息
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  // 格式化時間
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 開始對話
  const startConversation = async () => {
    // 如果瀏覽器支持語音識別，請求麥克風權限
    if (isBrowserSupported && isSecureContext) {
      const hasPermission = await requestMicrophonePermission();
      if (!hasPermission) {
        toast.error('請使用模擬輸入按鈕進行對話');
      }
    }
    
    setConversationStarted(true);
    setImageEnlarged(true);
    
    // 開始計時
    const interval = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
    
    setTimerInterval(interval);
    
    // 如果有語音識別且已獲得權限，開始聆聽
    if (isBrowserSupported && isSecureContext && permissionGranted) {
      startListening();
    }
  };

  // 結束對話並跳轉到評估結果頁面
  const endConversation = async () => {
    if (!conversationStarted) return;
    
    // 停止語音識別
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error('停止語音識別失敗:', error);
      }
    }
    
    // 停止計時器
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    
    try {
      // 準備評估數據
      const conversationData = {
        messages: messages,
        duration: elapsedTime,
        timestamp: new Date().toISOString(),
        patientRole: virtualPatientRole.name
      };
      
      // 保存對話記錄到本地存儲
      localStorage.setItem('conversationHistory', JSON.stringify(messages));
      localStorage.setItem('conversationDuration', elapsedTime.toString());
      
      // 發送對話數據到服務器進行評估
      try {
        // 使用 scoring_criteria_rag.json 中的評分標準進行評估
        const response = await fetch('/api/conversations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...conversationData,
            evaluationType: 'rag' // 指定使用 RAG 評估方法
          }),
        });
        
        if (!response.ok) {
          throw new Error(`評估請求失敗: ${response.status}`);
        }
        
        const result = await response.json();
        
        // 保存評估結果
        localStorage.setItem('conversationEvaluation', JSON.stringify(result));
        
        console.log('對話評估完成，準備跳轉到評估頁面', result);
        
        // 跳轉到評估結果頁面
        router.push('/conversation/result');
      } catch (apiError) {
        console.error('API請求失敗:', apiError);
        
        // 如果API請求失敗，使用本地評估
        console.log('使用本地評估作為備選方案');
        
        // 基於對話內容和評分標準進行本地評估
        const userMessages = messages.filter(m => m.role === 'user');
        
        // 從本地加載評分標準
        let scoringCriteria;
        try {
          // 嘗試從本地存儲獲取評分標準
          const storedCriteria = localStorage.getItem('scoringCriteria');
          if (storedCriteria) {
            scoringCriteria = JSON.parse(storedCriteria);
          } else {
            // 如果本地沒有，使用硬編碼的簡化版評分標準
            scoringCriteria = [
              { id: "詢問病人姓名", 分類: "病人辨識", 配分: 2 },
              { id: "開始不舒服的時間", 分類: "病人情況", 配分: 4 },
              { id: "大便情況", 分類: "病人情況", 配分: 10 },
              { id: "嘔吐情況", 分類: "病人情況", 配分: 10 },
              { id: "食慾", 分類: "病人情況", 配分: 6 },
              { id: "發燒史評估", 分類: "病人情況", 配分: 8 },
              { id: "小便情況", 分類: "病人情況", 配分: 4 },
              { id: "就醫過程", 分類: "病人情況", 配分: 6 },
              { id: "腹瀉護理指導", 分類: "護理指導", 配分: 10 },
              { id: "發燒", 分類: "記錄", 配分: 4 },
              { id: "腹瀉", 分類: "記錄", 配分: 6 },
              { id: "嘔吐", 分類: "記錄", 配分: 5 },
              { id: "護理評估流暢度", 分類: "綜合性表現", 配分: 2 },
              { id: "關心病童及家屬反應", 分類: "綜合性表現", 配分: 2 },
              { id: "態度及語調親切", 分類: "綜合性表現", 配分: 2 }
            ];
          }
        } catch (error) {
          console.error('獲取評分標準失敗:', error);
          scoringCriteria = [];
        }
        
        // 計算得分
        let totalScore = 0;
        let maxPossibleScore = 0;
        const scoringDetails = {};
        
        // 簡單的關鍵詞匹配評分
        scoringCriteria.forEach(criterion => {
          const criterionId = criterion.id;
          const maxScore = criterion.配分;
          maxPossibleScore += maxScore;
          
          // 檢查用戶消息中是否包含相關關鍵詞
          let criterionScore = 0;
          const keywords = [criterionId, ...((criterion.關鍵詞 || []).map(kw => kw.toLowerCase()))];
          
          for (const msg of userMessages) {
            const content = msg.content.toLowerCase();
            if (keywords.some(keyword => content.includes(keyword.toLowerCase()))) {
              criterionScore = maxScore;
              break;
            }
          }
          
          totalScore += criterionScore;
          scoringDetails[criterionId] = {
            score: criterionScore,
            maxScore: maxScore,
            category: criterion.分類
          };
        });
        
        // 計算百分比得分
        const percentageScore = Math.round((totalScore / Math.max(maxPossibleScore, 1)) * 100);
        
        // 按類別分組得分
        const categoryScores = {};
        Object.entries(scoringDetails).forEach(([id, detail]: [string, any]) => {
          const category = detail.category;
          if (!categoryScores[category]) {
            categoryScores[category] = { score: 0, maxScore: 0 };
          }
          categoryScores[category].score += detail.score;
          categoryScores[category].maxScore += detail.maxScore;
        });
        
        // 計算每個類別的百分比得分
        const categoryPercentages = {};
        Object.entries(categoryScores).forEach(([category, scores]: [string, any]) => {
          categoryPercentages[category] = Math.round((scores.score / Math.max(scores.maxScore, 1)) * 100);
        });
        
        // 保存評估結果
        const evaluationResult = {
          score: percentageScore,
          details: {
            ...categoryPercentages,
            communicationSkill: categoryPercentages['綜合性表現'] || 85,
            timeManagement: Math.min(90, 70 + Math.floor(elapsedTime / 30)),
            clinicalSkill: categoryPercentages['評估檢查'] || 80,
            patientCare: categoryPercentages['護理指導'] || 85
          },
          criteriaScores: scoringDetails,
          feedback: "基於評分標準的自動評估",
          conversationId: Date.now().toString()
        };
        
        localStorage.setItem('conversationEvaluation', JSON.stringify(evaluationResult));
        
        // 跳轉到評估結果頁面
        router.push('/conversation/result');
      }
    } catch (error) {
      console.error('結束對話過程中發生錯誤:', error);
      toast.error('評估過程中發生錯誤，請稍後再試');
    }
  };

  // 開始聆聽
  const startListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        console.log('開始聆聽');
      } catch (error) {
        console.error('啟動語音識別失敗:', error);
        toast.error('無法啟動語音識別，請嘗試刷新頁面');
      }
    } else {
      toast.error('語音識別未初始化，請使用模擬輸入');
    }
  };

  // 停止聆聽
  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        setIsListening(false);
        console.log('停止聆聽');
      } catch (error) {
        console.error('停止語音識別失敗:', error);
      }
    }
  };

  // 模擬語音輸入
  const simulateVoiceInput = () => {
    const simulatedInputs = [
      "請問小朋友叫什麼名字？",
      "他是從什麼時候不舒服的？",
      "總共腹瀉幾次？",
      "請問大便性狀是什麼？是水便還是糊便？",
      "請問顏色呢？有血絲嗎？",
      "請問有嘔吐嗎？"
    ];
    
    const randomIndex = Math.floor(Math.random() * simulatedInputs.length);
    const simulatedText = simulatedInputs[randomIndex];
    
    sendMessageWithText(simulatedText);
  };

  // 使用指定文本發送消息
  const sendMessageWithText = async (text: string) => {
    if (!text.trim()) return;
    
    // 添加用戶消息
    const userMessage = {
      role: 'user' as const,
      content: text,
      timestamp: elapsedTime
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      // 模擬API調用延遲
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 根據用戶輸入查找匹配的回覆
      const response = getResponseFromVectorSearch(text);
      
      // 添加助手消息
      const assistantMessage = {
        role: 'assistant' as const,
        content: response,
        timestamp: elapsedTime + 1
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('處理回覆時出錯:', error);
      toast.error('無法獲取回覆，請稍後再試');
    } finally {
      setIsLoading(false);
    }
  };
  
  // 從向量搜索獲取回覆
  const getResponseFromVectorSearch = (query: string) => {
    // 這裡應該是實際的向量搜索邏輯
    // 目前使用簡單的關鍵詞匹配模擬
    
    // 定義一些關鍵詞和回覆的映射
    const keywordResponses: Record<string, string> = {
      "名字": "張小威，2歲",
      "幾歲": "2歲",
      "不舒服": "他昨天晚上開始腹瀉發燒",
      "腹瀉": "到今天中午總共拉五次",
      "大便": "開始三次是糊便，後來二次就水便",
      "便便": "開始三次是糊便，後來二次就水便",
      "顏色": "黃色，有一點血絲",
      "血": "黃色，有一點血絲",
      "嘔吐": "有",
      "吐": "有"
    };
    
    // 查找匹配的關鍵詞
    for (const [keyword, response] of Object.entries(keywordResponses)) {
      if (query.includes(keyword)) {
        return response;
      }
    }
    
    // 默認回覆
    return "對不起，我不太明白您的問題。請問您能再說明一下嗎？";
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* 頂部標題欄 */}
          <div className="bg-blue-600 dark:bg-blue-800 p-4 text-white flex justify-between items-center rounded-t-lg">
            <h1 className="text-xl font-bold">虛擬病人對話</h1>
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              <span>{formatTime(elapsedTime)}</span>
            </div>
          </div>
          
          {/* 控制按鈕區域 - 放在頂部標題欄下方 */}
          {conversationStarted && (
            <div className="bg-gray-50 dark:bg-gray-800 p-3 border-b border-gray-200 dark:border-gray-700 flex justify-center space-x-4">
              {isListening ? (
                <Button 
                  onClick={stopListening}
                  variant="destructive"
                  size="sm"
                >
                  <MicOff className="h-4 w-4 mr-2" />
                  停止聆聽
                </Button>
              ) : (
                <Button 
                  onClick={startListening}
                  className="bg-blue-600 hover:bg-blue-700"
                  size="sm"
                  disabled={!isBrowserSupported || !isSecureContext}
                >
                  <Mic className="h-4 w-4 mr-2" />
                  開始聆聽
                </Button>
              )}
              
              <Button 
                onClick={simulateVoiceInput}
                variant="outline"
                size="sm"
              >
                模擬語音輸入
              </Button>
              
              <Button 
                onClick={endConversation}
                variant="outline"
                size="sm"
                className="border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900"
              >
                <StopCircle className="h-4 w-4 mr-2" />
                結束對話
              </Button>
            </div>
          )}

          {/* 主要內容區域 */}
          <div className="bg-white dark:bg-gray-800 rounded-b-lg shadow-lg overflow-hidden">
            {!conversationStarted ? (
              <div className="flex flex-col items-center justify-center p-8 h-[60vh]">
                <div className="relative w-80 h-80 mb-8">
                  <Image
                    src="/images/virtualpatient.png"
                    alt="虛擬病人"
                    fill
                    className="object-cover rounded-full"
                    sizes="(max-width: 768px) 100vw, 300px"
                    priority
                  />
                </div>
                
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                  準備好開始對話了嗎？
                </h2>
                
                <p className="text-gray-600 dark:text-gray-300 mb-8 text-center">
                  點擊「開始對話」按鈕，與虛擬病人開始交流。<br />
                  系統會自動開始錄音您的語音輸入。
                </p>
                
                <Button 
                  onClick={startConversation}
                  className="bg-blue-600 hover:bg-blue-700"
                  size="lg"
                >
                  開始對話
                </Button>
                
                {(!isBrowserSupported || !isSecureContext) && (
                  <p className="text-yellow-600 dark:text-yellow-400 text-sm mt-4">
                    注意：{!isSecureContext ? '應用運行在非安全上下文中，語音功能不可用。' : '您的瀏覽器不支持語音識別功能。'}
                    請使用Chrome、Edge或Safari瀏覽器在HTTPS環境下獲得最佳體驗。
                  </p>
                )}
              </div>
            ) : (
              <div className="flex flex-col">
                {/* 虛擬病人區域 - 滿版圖片 */}
                <div className="relative w-full h-[50vh]">
                  <Image
                    src="/images/virtualpatient.png"
                    alt="虛擬病人"
                    fill
                    className="object-contain"
                    sizes="100vw"
                    priority
                  />
                  
                  {/* 收音中動態效果 */}
                  {isListening && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                      <div className="flex space-x-2">
                        <div className="w-2 h-8 bg-white rounded-full animate-sound-wave"></div>
                        <div className="w-2 h-12 bg-white rounded-full animate-sound-wave" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-6 bg-white rounded-full animate-sound-wave" style={{ animationDelay: '0.4s' }}></div>
                        <div className="w-2 h-10 bg-white rounded-full animate-sound-wave" style={{ animationDelay: '0.6s' }}></div>
                        <div className="w-2 h-4 bg-white rounded-full animate-sound-wave" style={{ animationDelay: '0.8s' }}></div>
                      </div>
                    </div>
                  )}
                  
                  {/* 顯示當前聆聽狀態 */}
                  {isListening && transcript && (
                    <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 p-2 bg-gray-800 bg-opacity-70 rounded-lg max-w-md">
                      <p className="text-sm text-white">
                        <span className="font-medium">正在聆聽:</span> {transcript}
                      </p>
                    </div>
                  )}
                  
                  {/* 最新虛擬病人對話氣泡 */}
                  {messages.length > 0 && messages[messages.length - 1].role === 'assistant' && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 max-w-md bg-white dark:bg-gray-700 p-4 rounded-lg shadow-lg">
                      <div className="font-medium mb-1 text-gray-700 dark:text-gray-300">
                        {virtualPatientRole.name}
                      </div>
                      <div className="text-gray-800 dark:text-gray-200">
                        {messages[messages.length - 1].content}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* 對話記錄區域 - 時間軸樣式 */}
                <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">對話時間軸</h3>
                    
                    <div className="relative pl-8 pb-4">
                      {/* 垂直時間軸線 */}
                      <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-blue-500"></div>
                      
                      {/* 對話記錄 */}
                      {messages.map((message, index) => (
                        <div key={index} className="mb-4 relative">
                          {/* 時間點 */}
                          <div className="absolute left-[-12px] top-0 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                            <Circle className="h-3 w-3 text-white" />
                          </div>
                          
                          {/* 時間戳 */}
                          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                            {formatTime(message.timestamp)}
                          </div>
                          
                          {/* 消息內容 */}
                          <div className={`p-3 rounded-lg ${
                            message.role === 'user' 
                              ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' 
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                          }`}>
                            <div className="font-medium mb-1">
                              {message.role === 'user' ? '您' : virtualPatientRole.name}
                            </div>
                            <div>{message.content}</div>
                          </div>
                        </div>
                      ))}
                      
                      {/* 加載中指示器 */}
                      {isLoading && (
                        <div className="mb-4 relative">
                          <div className="absolute left-[-12px] top-0 w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center">
                            <div className="h-3 w-3 rounded-full bg-white animate-pulse"></div>
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                            {formatTime(elapsedTime)}
                          </div>
                          <div className="p-3 rounded-lg bg-gray-200 dark:bg-gray-700">
                            <div className="flex space-x-2">
                              <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"></div>
                              <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                              <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div ref={messagesEndRef} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 