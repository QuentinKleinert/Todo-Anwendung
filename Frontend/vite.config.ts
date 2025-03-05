import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            "/api": {
                target: "http://localhost/TodoApp/Todo-Anwendung/Backend",
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ""), // Entfernt das "/api" Präfix
            },
        },
    },
});
