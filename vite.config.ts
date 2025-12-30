import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),

    tailwindcss(),

    VitePWA({
      registerType: "autoUpdate", // auto-updates the service worker
      includeAssets: [
        "favicon.svg",
        "favicon.ico",
        "robots.txt",
        "apple-touch-icon.png",
      ],
      manifest: {
        name: "scan2pay.dir",
        short_name: "Scan2Pay",
        description: "Scan2Pay application.",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        scope: "/users/",
        start_url: "/users/",
        icons: [
          {
            src: "small.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "big.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "big.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
  server: {
    port: 4000, // 👈 change to any port you want
  },
  base: "/users/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});

//checking the stagge