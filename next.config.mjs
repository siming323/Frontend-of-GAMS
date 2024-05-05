/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [{
      source: '/api/:path*',
      // destination:'http://127.0.0.1:4523/m1/4395424-4039824-default/api/:path*'
      destination: 'http://localhost:3005/api/:path*'
    }]
  }
};

export default nextConfig;
