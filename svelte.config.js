import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			// Opciones del adaptador de Vercel
			runtime: 'nodejs18.x' // o la versión que prefieras
		})
	},
	preprocess: vitePreprocess()
};

export default config; 