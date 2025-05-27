/*import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
//import tailwindcss from 'tailwindcss';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
    ],
});*/

// vite.config.js
/*import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    server: {
        historyApiFallback: true, // Add this
    }
});*/

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    server: {
        fs: {
            allow: ['.']
        }
    },
    build: {
        outDir: 'dist'
    },
    // 👇 this makes sure non-root paths like /dashboard work
    resolve: {
        alias: {
            '/@': '/src'
        }
    }
});