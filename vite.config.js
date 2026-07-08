import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        rollupOptions: {
            input: ['index.html', 'rapor.html', 'hediye.html'],
        },
    },
});
