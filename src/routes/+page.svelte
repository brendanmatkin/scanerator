<script>
	import Highlight from 'svelte-highlight';
	import json from 'svelte-highlight/languages/json';
	import 'svelte-highlight/styles/github.css';

	/** @type {import('./$types').PageData} */
	export let data;
</script>

<h1>Scanerator Notion Data</h1>
<Highlight language={json} code={JSON.stringify(data.db, null, 2)} />
