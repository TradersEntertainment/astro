import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        target: 'es2022',
        modulePreload: { polyfill: false },
        rollupOptions: {
            input: { index: 'index.html', landing: 'landing.html', kvkk: 'kvkk.html' },
            output: {
                advancedChunks: { groups: [{ name: 'gsap', test: /node_modules[\\/]gsap[\\/](?!MorphSVG|MotionPath)/ }] },
            },
        },
    },
});
