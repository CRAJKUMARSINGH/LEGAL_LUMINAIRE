import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react({
      // Enable React 19 compiler for automatic memoization
      babel: {
        plugins: [
          ["babel-plugin-react-compiler", {
            target: "19",
            runtime: "automatic"
          }]
        ]
      }
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
    dedupe: ["react", "react-dom"],
  },
  root: __dirname,
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
    // Optimize build for better performance
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['wouter'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-select', 'lucide-react'],
          utils: ['clsx', 'tailwind-merge', 'date-fns'],
        }
      }
    },
    // Enable source maps for debugging
    sourcemap: true,
  },
  server: {
    port: 5173,
    host: "0.0.0.0",
    proxy: {
      // Hybrid draft stream (FastAPI) — same path the SPA calls in dev
      "/api/legal": {
        target: process.env.VITE_BACKEND_URL || "http://127.0.0.1:8000",
        changeOrigin: true,
      },
    },
    fs: {
      allow: [
        __dirname,
        path.resolve(__dirname, "../../node_modules"),
      ],
    },
  },
  // Optimize dependencies for faster startup
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'wouter',
      '@radix-ui/react-dialog',
      '@radix-ui/react-select',
      'lucide-react',
      'clsx',
      'tailwind-merge',
      'date-fns',
    ]
  }
});
