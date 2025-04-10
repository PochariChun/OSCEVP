import React from "react";
import Hero from "@/components/Home/Hero";
import Features from "@/components/Home/Features";
import Cook from "@/components/Home/Cook";
import Expert from "@/components/Home/Expert";
import Gallery from "@/components/Home/Gallery";
import Newsletter from "@/components/Home/Newsletter";
import { Metadata } from "next";
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: "虛擬病人對話系統 - 首頁",
  description: "通過與虛擬病人的互動，提升醫護人員的溝通技能和臨床決策能力",
};

export default function Home() {
  return (
    <main className="dark:bg-gray-900">
      {/* 英雄區域 */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-100 dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-900 py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                虛擬病人對話訓練系統
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                通過與虛擬病人的互動，提升醫護人員的溝通技能和臨床決策能力
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link href="/register">
                  <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">
                    立即註冊
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-gray-800">
                    登入系統
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <Image
                src="/images/patient.png"
                alt="虛擬病人系統"
                width={500}
                height={500}
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 特色區域 */}
      <section className="bg-white dark:bg-gray-900 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">系統特色</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              我們的虛擬病人系統提供全面的臨床溝通訓練體驗
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg shadow-md text-center">
              <div className="bg-blue-100 dark:bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 dark:text-white">AI 驅動對話</h3>
              <p className="text-gray-600 dark:text-gray-300">
                使用先進的人工智能技術，提供自然流暢的病人對話體驗
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg shadow-md text-center">
              <div className="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 dark:text-white">引導式反思</h3>
              <p className="text-gray-600 dark:text-gray-300">
                提供結構化的反思問題，幫助學習者深化記憶並鞏固臨床知識
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg shadow-md text-center">
              <div className="bg-purple-100 dark:bg-purple-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 dark:text-white">詳細評估回饋</h3>
              <p className="text-gray-600 dark:text-gray-300">
                提供全面的表現評估和個性化的改進建議
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 如何工作區域 */}
      <section className="bg-gray-50 dark:bg-gray-800 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">如何使用</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              簡單四步驟，開始您的臨床溝通訓練
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* 步驟1 */}
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">1</div>
              <h3 className="text-xl font-semibold mb-3 dark:text-white">註冊帳號</h3>
              <p className="text-gray-600 dark:text-gray-300">創建您的個人帳號，開始使用虛擬病人系統</p>
            </div>
            
            {/* 步驟2 */}
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">2</div>
              <h3 className="text-xl font-semibold mb-3 dark:text-white">選擇虛擬病人</h3>
              <p className="text-gray-600 dark:text-gray-300">從不同病例和難度級別中選擇合適的虛擬病人</p>
            </div>
            
            {/* 步驟3 */}
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">3</div>
              <h3 className="text-xl font-semibold mb-3 dark:text-white">進行對話</h3>
              <p className="text-gray-600 dark:text-gray-300">與虛擬病人進行問診對話，收集病史信息</p>
            </div>
            
            {/* 步驟4 */}
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">4</div>
              <h3 className="text-xl font-semibold mb-3 dark:text-white">獲取回饋</h3>
              <p className="text-gray-600 dark:text-gray-300">查看評分結果和反思指導，提升臨床溝通能力</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
