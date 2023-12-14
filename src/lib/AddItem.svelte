<script>
	import { focusTrap } from "@skeletonlabs/skeleton";
	let isFocused = true;

	// Object.entries(database.properties).forEach(([propertyName, propertyValue]) => {
	// 	console.log(`${propertyName}: ${propertyValue.type}`);
	// });
	export let pageSchema = {};
</script>

<form use:focusTrap={isFocused}>
	<input type="text" placeholder="Name" />
	<button class="btn variant-filled-primary">Submit</button>
</form>
