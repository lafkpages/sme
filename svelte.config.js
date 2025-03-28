import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

import { optimizeCss, optimizeImports } from 'carbon-preprocess-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: [vitePreprocess(), optimizeImports(), optimizeCss()],

	kit: {
		adapter: adapter({
			platformProxy: {
				environment: 'production'
			}
		})
	}
};

export default config;
