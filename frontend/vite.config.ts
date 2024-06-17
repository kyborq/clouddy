import * as path from "path";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  server: {
    proxy: {
      "^/api/*": {
        target: "http://localhost:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "^/ai/*": {
        target: "http://localhost:8000",
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq, req) => {
            // proxyReq.b
            // if (req.headers["authorization"]) {
            // proxyReq.setHeader("Authorization", req.headers["authorization"]);
            // }
            // if (req.headers["token"]) {
            // proxyReq.setHeader("Token", req.headers["token"]);
            // }
          });
          // proxy.on("proxyReq", (proxyRes, req) => {
          // console.log(proxyRes);
          // });
        },

        rewrite: (path) => path.replace(/^\/ai/, ""),
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@components": path.resolve(__dirname, "./src/components"),
    },
  },
  plugins: [react(), svgr()],
});
