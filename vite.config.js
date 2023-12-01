import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { purgeCss } from 'vite-plugin-tailwind-purgecss';

export default defineConfig({
	//https://www.skeleton.dev/docs/purgecss
	plugins: [sveltekit(), purgeCss({
		safelist: {
			greedy: [/^hljs-/],
		}
	})],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
