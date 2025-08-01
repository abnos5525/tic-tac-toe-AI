import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base:"./",
  plugins: [
    react(),
    tailwindcss(),
    {
      name: "build-html",
      apply: "build",
      transformIndexHtml: (html) => {
        return {
          html,
          tags: [
            {
              tag: "script",
              attrs: {
                src: "/env.js",
              },
              injectTo: "head",
            },
          ],
        };
      },
    },
  ],
});
