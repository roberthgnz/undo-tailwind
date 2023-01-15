import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  optimizeDeps: {
    exclude: [
      "@iconify/utils/lib/loader/fs",
      "@iconify/utils/lib/loader/install-pkg",
      "@iconify/utils/lib/loader/node-loader",
      "@iconify/utils/lib/loader/node-loaders",
    ],
  },
  build: {
    emptyOutDir: true,
    rollupOptions: {
      external: [
        "@iconify/utils/lib/loader/fs",
        "@iconify/utils/lib/loader/install-pkg",
        "@iconify/utils/lib/loader/node-loader",
        "@iconify/utils/lib/loader/node-loaders",
      ],
      input: ["./index.html"],
    },
  },
});
