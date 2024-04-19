import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vitest/config";
import { TanStackRouterVite } from "@tanstack/router-vite-plugin";

import os from "os";

// https://vitejs.dev/config/

const isMac = os.platform() === "darwin"; // 'darwin' is the platform name for macOS
const certPath = isMac
  ? path.resolve(__dirname, "localhost+3.pem") // Path for macOS
  : path.resolve(__dirname, "cert.pem"); // Path for Windows

const keyPath = isMac
  ? path.resolve(__dirname, "localhost+3-key.pem") // Path for macOS
  : path.resolve(__dirname, "key.pem");

export default defineConfig(({ command, mode }) => {
  const inProduction = mode === "production";
  return {
    base: "/",
    plugins: [react({ tsDecorators: true }), TanStackRouterVite()],
    server: {
      host: true,
      watch: {
        usePolling: true,
      },
      https: inProduction,
    },
    build: {
      outDir: "build",
      sourcemap: inProduction === false,
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@entities": path.resolve(__dirname, "./src/sdk/entities"),
        "@sdk": path.resolve(__dirname, "./src/sdk/"),
      },
    },
    test: {
      setupFiles: ["./vitest-setup.ts"],
      coverage: {
        provider: "v8",
        reporter: ["text", "json", "html"],
      },
      environment: "jsdom",
      include: ["**/*.{test,spec}.{ts,tsx}"],
      globals: true,
    },
  };
});
