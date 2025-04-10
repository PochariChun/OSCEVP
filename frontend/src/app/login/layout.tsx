import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '虛擬病人對話系統 - 登入',
  description: '登入您的虛擬病人系統帳號',
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 