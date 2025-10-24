// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    turbo: {}, // ✅ Turbopack用に空オブジェクトを指定
  },
};

module.exports = withPWA(nextConfig);
