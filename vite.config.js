import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { purgeCss } from 'vite-plugin-tailwind-purgecss';
import Icons from 'unplugin-icons/vite';
// import basicSsl from '@vitejs/plugin-basic-ssl';

export default defineConfig({
	//https://www.skeleton.dev/docs/purgecss
	plugins: [
		sveltekit(),
		Icons({
			compiler: 'svelte'
		}),
		purgeCss({
			safelist: {
				greedy: [/^hljs-/]
			}
		})
		// basicSsl()
	],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
