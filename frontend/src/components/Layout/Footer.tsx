"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 pt-16 pb-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center mb-4">
              <Image
                src="/images/patient.png"
                alt="虛擬病人系統"
                width={40}
                height={40}
                className="mr-2"
              />
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                虛擬病人系統
              </span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              通過與虛擬病人的互動，提升醫護人員的溝通技能和臨床決策能力。
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              快速連結
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                >
                  首頁
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                >
                  關於我們
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                >
                  儀表板
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              法律資訊
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/terms"
                  className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                >
                  服務條款
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                >
                  隱私政策
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              聯絡我們
            </h3>
            <ul className="space-y-2">
              <li className="text-gray-600 dark:text-gray-400">
                電子郵件: info@virtualpatientsystem.com
              </li>
              <li className="text-gray-600 dark:text-gray-400">
                電話: +886 123 456 789
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 dark:border-gray-800 mt-12 pt-8">
          <p className="text-center text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} 虛擬病人對話系統. 保留所有權利.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 