
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  vite: {
    // Basic Vite config
  },
  tanstackStart: {
    server: { entry: "server" },
    // Force Nitro to use Vercel preset
    deployment: {
      preset: "vercel",
    },
  },
});
