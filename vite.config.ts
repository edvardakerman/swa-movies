import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",

      // ✅ These match EXACTLY what you already have in /public
      includeAssets: [
        "favicon.ico",
        "favicon-16x16.png",
        "favicon-32x32.png",
        "apple-touch-icon.png",
      ],

      manifest: {
        name: "Movies",
        short_name: "Movies",
        description: "Discover and track your favorite movies",
        theme_color: "#030712",
        background_color: "#030712",
        display: "standalone",
        start_url: "/",

        // ✅ These match your existing android icons
        icons: [
          {
            src: "android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "apple-touch-icon.png",
            sizes: "180x180",
            type: "image/png",
          },
        ],
      },
      workbox: {
        navigateFallbackDenylist: [/^\/\.auth\/.*/],
      },
    }),
  ],

  server: {
    port: 3000,
  },

  build: {
    outDir: "dist",
  },
});
