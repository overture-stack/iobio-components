import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), dts({ rollupTypes: true })],
	build: {
		sourcemap: true,
		lib: {
			entry: resolve(__dirname, 'src/index.ts'),
			name: 'components',
			fileName: 'index',
			formats: ['es'],
		},
		rollupOptions: {
			external: ['react', 'react/jsx-runtime'],
		},
	},
});
