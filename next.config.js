// next.config.js
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    turbo: {}, // ✅ Next.js 16用: Turbopack対応
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = withPWA(nextConfig);
