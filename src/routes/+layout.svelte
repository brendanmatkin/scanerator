<script>
	import "../app.pcss";
	import { AppBar } from "@skeletonlabs/skeleton";
	import { AppShell } from "@skeletonlabs/skeleton";
	import { LightSwitch } from "@skeletonlabs/skeleton";
</script>

<!-- <AppShell slotPageContent="bg-gradient-to-br variant-gradient-secondary-tertiary"> -->
<AppShell>
	<svelte:fragment slot="header">
		<AppBar>
			<svelte:fragment slot="lead">(icon)</svelte:fragment>
			<h2 class="h2">Scanerator Notion Data</h2>
			<svelte:fragment slot="trail"><LightSwitch /></svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<!-- <slot /> -->
	<!-- <div class="container mx-auto p-8 space-y-8"> -->
	<div class="container mx-auto px-8 py-4">
		<slot />
	</div>
</AppShell>
