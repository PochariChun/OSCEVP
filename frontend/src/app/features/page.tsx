import React from 'react';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function FeaturesPage() {
  const features = [
    {
      title: '真實的病例模擬',
      description: '基於真實臨床案例的虛擬病人，提供真實的診斷和治療體驗。'
    },
    {
      title: '自然語言交互',
      description: '使用先進的自然語言處理技術，讓您可以用自然語言與虛擬病人進行對話。'
    },
    {
      title: '詳細的反饋和評分',
      description: '每次對話後獲得詳細的反饋和評分，幫助您了解自己的表現和需要改進的地方。'
    },
    {
      title: '多樣化的病例庫',
      description: '涵蓋各種疾病和症狀的豐富病例庫，滿足不同專業和學習階段的需求。'
    },
    {
      title: '進度追蹤',
      description: '追蹤您的學習進度和表現，幫助您持續改進。'
    },
    {
      title: '隨時隨地學習',
      description: '雲端平台支持，讓您可以在任何設備上隨時隨地進行學習。'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">功能特點</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {features.map((feature, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-start mb-4">
              <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" />
              <h3 className="text-xl font-semibold">{feature.title}</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
          </div>
        ))}
      </div>
      
      <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-8 mb-12">
        <h2 className="text-2xl font-semibold mb-4">為什麼選擇我們的虛擬病人系統？</h2>
        <p className="text-lg mb-6">
          我們的系統結合了先進的人工智能技術和醫學專家的知識，提供最真實、最有效的虛擬病人互動體驗。無論您是醫學生、住院醫師還是有經驗的醫生，我們的系統都能幫助您提高臨床技能。
        </p>
        <Link 
          href="/register"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          立即註冊
        </Link>
      </div>
      
      <div className="text-center">
        <Link 
          href="/"
          className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          返回首頁
        </Link>
      </div>
    </div>
  );
} 