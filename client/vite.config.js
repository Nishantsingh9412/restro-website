import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  // server: {
  //   host: "0.0.0.0",
  //   port: 5173,
  // },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          chakra: ["@chakra-ui/react", "@hypertheme-editor/chakra-ui"],
          redux: ["react-redux", "redux"],
          toast: ["react-toastify"],
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Optional: Reduce warning threshold
  },
  plugins: [react()],
});
