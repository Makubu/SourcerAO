import { defineConfig } from "vite";
import { resolve } from "path";
import react from "@vitejs/plugin-react-swc";
import eslint from "vite-plugin-eslint";

const projectRootDir = resolve(__dirname);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      // default settings on build (i.e. fail on error)
      ...eslint(),
      apply: "build",
    },
    {
      // do not fail on serve (i.e. local development)
      ...eslint({
        failOnWarning: false,
        failOnError: false,
        fix: true,
      }),
      apply: "serve",
      enforce: "post",
    },
  ],
  resolve: {
    alias: { "@app": resolve(projectRootDir, "/src") },
  },
});
