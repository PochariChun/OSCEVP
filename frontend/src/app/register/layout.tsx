import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '虛擬病人對話系統 - 註冊',
  description: '創建您的虛擬病人系統帳號',
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 