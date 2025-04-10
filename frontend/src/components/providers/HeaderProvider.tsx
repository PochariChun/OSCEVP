'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface HeaderContextType {
  showGlobalHeader: boolean;
  setShowGlobalHeader: (show: boolean) => void;
}

// 創建默認值以避免未定義錯誤
const defaultContextValue: HeaderContextType = {
  showGlobalHeader: true,
  setShowGlobalHeader: () => {},
};

const HeaderContext = createContext<HeaderContextType>(defaultContextValue);

export function useHeader() {
  const context = useContext(HeaderContext);
  return context;
}

export function HeaderProvider({ children }: { children: ReactNode }) {
  const [showGlobalHeader, setShowGlobalHeader] = useState(true);
  const [mounted, setMounted] = useState(false);

  // 確保客戶端渲染
  useEffect(() => {
    setMounted(true);
  }, []);

  const value = {
    showGlobalHeader,
    setShowGlobalHeader
  };

  // 在客戶端渲染之前返回一個佔位符
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <HeaderContext.Provider value={value}>
      {children}
    </HeaderContext.Provider>
  );
} 