import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">關於我們</h1>
      
      <div className="prose dark:prose-invert max-w-none">
        <p className="text-lg mb-4">
          虛擬病人系統是一個創新的醫學教育平台，旨在幫助醫學生和醫療專業人員通過模擬真實的臨床情境來提高診斷和溝通技能。
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">我們的使命</h2>
        <p>
          我們的使命是通過提供高質量、真實的虛擬病人互動體驗，幫助醫學教育更加實用和有效。我們相信，通過實踐和反饋，醫學生和醫療專業人員可以更好地準備面對真實的臨床挑戰。
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">我們的團隊</h2>
        <p>
          我們的團隊由醫學專家、教育工作者和技術專家組成，致力於創建最先進的虛擬病人模擬系統。
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">聯繫我們</h2>
        <p>
          如果您有任何問題或建議，請隨時聯繫我們：
          <br />
          電子郵件：contact@virtualpatient.example.com
          <br />
          電話：+886-123-456789
        </p>
        
        <div className="mt-8">
          <Link 
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            返回首頁
          </Link>
        </div>
      </div>
    </div>
  );
} 