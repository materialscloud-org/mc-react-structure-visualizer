import { resolve } from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { libInjectCss } from "vite-plugin-lib-inject-css";

import * as packageJson from "./package.json";

export default defineConfig({
  plugins: [react(), libInjectCss()],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.js"),
      name: "Structure Visualizer",
      fileName: "main",
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: [...Object.keys(packageJson.peerDependencies)],
      output: {
        exports: "named",
      },
    },
  },
});
