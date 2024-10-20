import { resolve } from "path";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    publicDir: resolve("src/main/assets"),
    build: {
      copyPublicDir: true
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        "@renderer": resolve("src/renderer")
      }
    },
    plugins: [react(), TanStackRouterVite()]
  }
});
