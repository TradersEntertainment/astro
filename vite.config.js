import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        rollupOptions: {
            input: ['index.html', 'uzmanliklar.html', 'rapor.html', 'hediye.html'],
        },
    },
});
