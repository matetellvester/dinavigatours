import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter(),
		alias: {
			'@/*': './path/to/lib/*',
			'$bns-route': './src/routes/(business)/*',
			'$bns-comps': './src/lib/components/bns/*',
			'$adm-route': './src/routes/(admin)/*',
			'$adm-comps': './src/lib/components/admin/*'
		}
	}
};

export default config;
