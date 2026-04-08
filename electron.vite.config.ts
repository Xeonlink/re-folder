import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "electron-vite";
import { resolve } from "path";

export default defineConfig({
  main: {
    plugins: [],
    publicDir: resolve("src/main/assets"),
    build: {
      copyPublicDir: true,
      externalizeDeps: true,
    },
  },
  preload: {
    plugins: [],
    build: {
      externalizeDeps: true,
    },
  },
  renderer: {
    resolve: {
      alias: {
        "@": resolve("src"),
      },
    },
    plugins: [viteReact(), tanstackRouter(), tailwindcss()],
  },
});
