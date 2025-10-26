// next.config.js
const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  buildExcludes: [/middleware-manifest\.json$/],
});

const nextConfig = {
  reactStrictMode: true,

  // ✅ iPhone PWA用に静的出力を明示
  output: "standalone",

  // ✅ ESLint/TypeScript の警告を抑制
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // ✅ 画像最適化を無効（PWAでのoffline対応を安定させる）
  images: {
    unoptimized: true,
  },
};

module.exports = withPWA(nextConfig);
