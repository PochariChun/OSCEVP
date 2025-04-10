/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/api/:path*', // 替换为您的Django后端URL
      },
    ];
  },
};

export default nextConfig;
