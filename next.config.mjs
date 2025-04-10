/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 禁用 App Router
  experimental: {
    appDir: false,
  },
  // 確保 TypeScript 路徑別名正確配置
  webpack: (config) => {
    return config;
  },
  async rewrites() {
    return [
      {
        source: '/api/users/:path*',
        destination: 'http://localhost:8000/api/users/:path*', // Django 後端 URL
      },
    ];
  },
};

export default nextConfig; 