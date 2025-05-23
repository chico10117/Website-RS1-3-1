import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			maxDuration: 300
		}),
		alias: {
			$lib: './src/lib'
		}
	},
	preprocess: vitePreprocess()
};

export default config;