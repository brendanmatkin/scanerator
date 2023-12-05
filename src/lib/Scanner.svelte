<script>
	import QrScanner from 'qr-scanner';
	import { onMount } from 'svelte';
	import LucideLightbulbOff from '~icons/lucide/lightbulb-off';
	import LucideLightbulb from '~icons/lucide/lightbulb'; //https://icones.js.org/collection/

	/** @type {HTMLVideoElement} */
	let videoElem;
	/** @type {QrScanner}*/
	let qrScanner;

	let hasCamera = false;
	let isScanning = false;
	let hasFlash = false;
	let flashOn = false;
	let latestScan = '';

	async function toggleScan() {
		if (!isScanning) {
			try {
				await qrScanner.start();
				isScanning = true;
				hasFlash = await qrScanner.hasFlash();
				flashOn = qrScanner.isFlashOn();
				console.log(`[QR] scan start. Flash is ${hasFlash ? 'available.' : 'UNAVAILABLE'}`);
			} catch (e) {
				console.warn('[QR]', e);
			}
		} else {
			qrScanner.stop();
			isScanning = false;
			console.log('[QR] scan stop');
		}
	}

	async function toggleFlash() {
		await qrScanner.toggleFlash();
		flashOn = qrScanner.isFlashOn();
	}

	onMount(async () => {
		hasCamera = await QrScanner.hasCamera();
		console.warn(`[QR] Camera ${hasCamera ? 'available.' : 'UNAVAILABLE'}`);
		if (hasCamera) {
			qrScanner = new QrScanner(
				videoElem,
				(result) => {
					console.log('[QR] decoded qr code:', result);
					latestScan = result.data;
				},
				{
					/* your options or returnDetailedScanResult: true if you're not specifying any other options */
					preferredCamera: 'environment',
					maxScansPerSecond: 25,
					// calculateScanRegion: // method that sets x,y,width,height of scan region.
					highlightScanRegion: true,
					highlightCodeOutline: true
					// overlay: //some div that is a sibling of videoElem. used for scanRegion and codeOutline
					// returnDetailedScanResult:
				}
			);
		}
	});
</script>

<div class="flex flex-col">
	{#if hasCamera}
		<div>
			<button on:click={toggleScan} class:isScanning class="btn variant-filled" type="button"
				>Toggle Scan</button
			>
			<button on:click={toggleFlash} class="btn variant-filled" type="button" disabled={!hasFlash}
				>Toggle Flash
				{#if flashOn}
					<LucideLightbulb />
				{:else}
					<LucideLightbulbOff />
				{/if}
			</button>
		</div>
	{:else}
		<p>No Camera!</p>
	{/if}
	<p>{latestScan}</p>
	<div id="video-container">
		<!-- svelte-ignore a11y-media-has-caption -->
		<video bind:this={videoElem} class="camera"></video>
	</div>
</div>

<style>
	/* @import ~the styles from QrScanner~ for layer purposes instead of !important*/
	.camera {
		display: block;
		height: 100%;
		object-fit: cover;
		/* https://www.digitalocean.com/community/tutorials/css-cropping-images-object-fit */
	}

	.isScanning {
		--hazard2: #444;
		background-color: black;
		background-image: repeating-linear-gradient(
			-45deg,
			transparent,
			transparent 0.6rem,
			var(--hazard2) 0.6rem,
			var(--hazard2) 1.2rem
		);
		background-size: 200% 100%;
		animation: barberpole 10s linear infinite;
	}
	@keyframes barberpole {
		100% {
			background-position: 100% 100%;
		}
	}

	#video-container {
		position: relative;
		overflow: hidden;
		margin: 0 auto;
		aspect-ratio: 1/1;
		max-width: 300px;
	}

	#video-container :global(.scan-region-highlight) {
		animation: none;
	}
	/* #video-container :global(.scan-region-highlight) {
		border-radius: 30px;
		outline: rgba(0, 0, 0, 0.5) solid 10vmax;
	}
	#video-container :global(.scan-region-highlight-svg) {
		display: none;
	}
	#video-container :global(.code-outline-highlight) {
		stroke: rgba(255, 242, 0, 0.8) !important;
		stroke-width: 10 !important;
		stroke-dasharray: 30 10 20 10 !important;
		stroke-linecap: butt !important;
	} */
</style>
