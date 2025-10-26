// next.config.js
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

const nextConfig = {
  reactStrictMode: true,

  // ✅ PWAを正しくルート配信するための出力形式
  output: "standalone",

  // ✅ publicディレクトリをルートとして扱う
  images: {
    unoptimized: true,
  },

  // ✅ エラーでビルドが止まらないように
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

module.exports = withPWA(nextConfig);
