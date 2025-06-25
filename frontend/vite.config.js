import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        open: true,
        strictPort: true,
        hmr: true,
        watch: {
            usePolling: true,
        },
        fs: {
            strict: true,
            allow: ['.']
        },
        // 👇 ADD THIS PROXY BLOCK
        proxy: {
            '/api': 'http://localhost:5000'
        }
    },
    build: {
        outDir: 'dist'
    },
    resolve: {
        alias: {
            '@': '/src' // ✅ Corrected alias
        }
    }
});