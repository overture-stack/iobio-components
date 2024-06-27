import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
	const env = loadEnv(mode, process.cwd(), '');
	const { VITE_PORT } = env;
	return {
		plugins: [react()],
		server: {
			port: Number(VITE_PORT) || 5173,
		},
	};
});
