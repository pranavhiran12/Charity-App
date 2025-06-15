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