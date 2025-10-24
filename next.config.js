const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  runtimeCaching: [
    {
      // ✅ HTML, JS, CSSをキャッシュ（30日）
      urlPattern: /^https?.*\.(?:js|css|html)$/,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "static-resources",
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30日
        },
      },
    },
    {
      // ✅ 画像キャッシュ（7日間）
      urlPattern: /^https?.*\.(?:png|jpg|jpeg|svg|gif|webp)$/,
      handler: "CacheFirst",
      options: {
        cacheName: "images",
        expiration: {
          maxEntries: 30,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 7日
        },
      },
    },
    {
      // ✅ APIレスポンスキャッシュ（5分）
      urlPattern: /^https?.*\/api\/.*$/,
      handler: "NetworkFirst",
      options: {
        cacheName: "api-cache",
        networkTimeoutSeconds: 5,
        expiration: {
          maxEntries: 20,
          maxAgeSeconds: 5 * 60, // 5分
        },
      },
    },
  ],
});
const nextConfig = {
  reactStrictMode: true,
  turbopack: {},
  pwa: {
    cleanupOutdatedCaches: true, // ✅ これを追加
  },
};
