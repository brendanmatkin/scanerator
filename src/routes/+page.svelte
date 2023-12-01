<script>
	import { CodeBlock } from '@skeletonlabs/skeleton';

	// start highlightjs
	import hljs from 'highlight.js/lib/core';
	import json from 'highlight.js/lib/languages/json';
	hljs.registerLanguage('json', json);
	import 'highlight.js/styles/github-dark.css';
	import { storeHighlightJs } from '@skeletonlabs/skeleton';
	storeHighlightJs.set(hljs);
	//end

	/** @type {import('./$types').PageData} */
	export let data;
</script>

<div class="container mx-auto p-8 space-y-8">
	<h1 class="h1">Scanerator Notion Data</h1>
	<CodeBlock language="json" code={JSON.stringify(data.db, null, 2)} />
</div>
