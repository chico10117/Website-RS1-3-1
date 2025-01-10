import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	build: {
		rollupOptions: {
			external: [
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