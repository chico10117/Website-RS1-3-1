import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	build: {
		rollupOptions: {
			external: [
				// Añade aquí las dependencias que deberían ser externas
				'pg',
				'pg-native',
				'postgres',
				'@neondatabase/serverless',
				'drizzle-orm'
			]
		}
	},
	optimizeDeps: {
		exclude: ['@neondatabase/serverless']
	},
	ssr: {
		noExternal: ['@neondatabase/serverless']
	}
}); 