import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
// process.env.NO_SLOW || slowTransformIndexHtml(),
// https://vitejs.dev/config/
export default defineConfig({
   plugins: [react()],
   resolve: {
      alias: {
         "@": resolve(__dirname, "./src"),
         "@tests": resolve(__dirname, "./tests"),
      },
   },
});
