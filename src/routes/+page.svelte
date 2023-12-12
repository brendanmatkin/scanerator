<script>
	import { CodeBlock } from "@skeletonlabs/skeleton";

	// start highlightjs
	import hljs from "highlight.js/lib/core";
	import json from "highlight.js/lib/languages/json";
	hljs.registerLanguage("json", json);
	import "highlight.js/styles/github-dark.css";
	import { storeHighlightJs } from "@skeletonlabs/skeleton";
	import Scanner from "$lib/Scanner.svelte";
	storeHighlightJs.set(hljs);
	//end

	/** @type {import('./$types').PageData} */
	export let data;
</script>

<Scanner />
<CodeBlock language="json" code={JSON.stringify(data.db, null, 2)} />
