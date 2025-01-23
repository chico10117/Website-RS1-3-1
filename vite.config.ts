import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
	// Load env file based on `mode` in the current working directory.
	// Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
	const env = loadEnv(mode, process.cwd(), '');

	return {
		plugins: [sveltekit()],
		build: {
			sourcemap: true
		},
		server: {
			fs: {
				// Allow serving files from one level up from the package root
				allow: ['..']
			}
		},
		// Vite env config
		define: {
			'process.env': env
		}
	};
}); 