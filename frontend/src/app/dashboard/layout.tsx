import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "儀表板 | 虛擬病人對話系統",
  description: "查看您的對話歷史和統計數據",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      {children}
    </div>
  );
} 