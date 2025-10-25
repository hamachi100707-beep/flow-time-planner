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

  // ✅ Turbopack完全無効化（Next.js 16で重要）
  webpack: (config) => {
    return config;
  },
  experimental: {
    turbo: false,
  },

  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

module.exports = withPWA(nextConfig);
