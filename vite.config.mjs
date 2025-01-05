import { defineConfig } from 'vite';

export default defineConfig({
    test: {
        setupFiles: './test/setup-db.js',
        clearMocks: true,
    },
});
