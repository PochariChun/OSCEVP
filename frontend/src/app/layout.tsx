import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import { ThemeProvider } from "next-themes";
import ScrollToTop from "@/components/ScrollToTop";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    template: '%s | 虛擬病人對話系統',
    default: '虛擬病人對話系統',
  },
  description: '通過與虛擬病人的互動，提升醫護人員的溝通技能和臨床決策能力',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/images/patient.png', type: 'image/png' }
    ],
    shortcut: '/images/patient.png',
    apple: '/images/patient.png',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: '/images/patient.png',
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-TW" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Header />
          <div className="dark:bg-gray-900 min-h-screen">
            {children}
          </div>
          <Footer />
          <ScrollToTop />
        </ThemeProvider>
      </body>
    </html>
  )
}
