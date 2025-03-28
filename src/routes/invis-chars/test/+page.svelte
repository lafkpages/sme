<script lang="ts">
	import type { PageProps } from './$types';

	import { onMount } from 'svelte';

	import {
		Button,
		ButtonSet,
		Checkbox,
		ExpandableTile,
		ProgressBar
	} from 'carbon-components-svelte';

	import { BitArray } from '$lib/bitArray';
	import { rmsDiff } from '$lib/utils';

	function zeroTimeout() {
		return new Promise((resolve) => setTimeout(resolve, 0));
	}

	function setupCharTest() {
		const rect = charTestRef.getBoundingClientRect();

		refWidth = rect.width;
		refHeight = rect.height;
	}

	async function doCharTest() {
		try {
			if (!refWidth) {
				throw new Error('Char test not set up');
			}

			if (testRunning) {
				throw new Error('Test already running');
			}

			controller = new AbortController();

			testRunning = true;
			testProgress = 0;
			zeroWidthCharsCount = 0;
			invisibleCharsCount = 0;

			console.debug('Zero-width char test start');
			status = 'active';
			helperText = 'Testing zero-width characters...';

			const zeroWidthChars = new BitArray();
			let charCode = 0;

			console.time('Zero-width chars test');
			while (charCode < 0xffff) {
				for (let i = 0; i < 128; i++) {
					charTests[i].textContent = `ab${String.fromCharCode(charCode + i)}cd`;
				}

				await zeroTimeout();

				for (let i = 0; i < 128; i++) {
					const testWidth = charTests[i].getBoundingClientRect().width;

					if (testWidth === refWidth) {
						const code = charCode + i;
						console.debug('Char', code, 'has zero width');
						zeroWidthChars.set(BigInt(code), true);
						zeroWidthCharsCount++;
					}
				}

				charCode += 128;
				testProgress = charCode;

				if (controller.signal.aborted) {
					testRunning = false;
					status = 'error';
					helperText = 'Test aborted';
					return;
				}
			}
			console.timeEnd('Zero-width chars test');

			helperText = 'Testing invisible characters...';

			// Draw reference canvas
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.fillStyle = 'black';
			ctx.fillText('abcd', 0, refHeight);
			const refImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

			const invisibleChars = new BitArray();

			console.time('Invisible chars test');
			for (let i = 0n; i < 65536n; i++) {
				if (zeroWidthChars.get(i)) {
					// Draw char on canvas
					ctx.clearRect(0, 0, canvas.width, canvas.height);
					ctx.fillStyle = 'black';
					ctx.fillText(`ab${String.fromCharCode(Number(i))}cd`, 0, refHeight);

					// Compare with reference
					const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
					const diff = rmsDiff(refImageData, imageData);

					console.debug('Char', i, 'diff', diff);
					if (diff < charInvisibilityThreshold) {
						console.debug('Char', i, 'is invisible');
						invisibleChars.set(i, true);
						invisibleCharsCount++;
					}
				}
				testProgress++;
			}
			console.timeEnd('Invisible chars test');

			testProgress = 131071;
			testRunning = false;

			if (invisibleCharsCount) {
				if (submitTest) {
					const body = new Uint8Array(16384);
					body.set(zeroWidthChars.toUint8Array(8192));
					body.set(invisibleChars.toUint8Array(8192), 8192);

					const resp = await fetch('/invis-chars/test', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/octet-stream'
						},
						body
					});

					if (resp.status === 201) {
						status = 'finished';
						testHasSubmitted = true;
						submitTest = false;
					} else if (resp.status === 503) {
						status = 'error';
						helperText = 'Endpoint is disabled';
					} else {
						throw new Error('Char test request failed');
					}
				} else {
					status = 'finished';
					helperText = 'Test not submitted';
				}
			} else {
				status = 'finished';
				helperText = 'No invisible characters found';
			}
		} catch (err) {
			testRunning = false;
			status = 'error';
			if (err instanceof Error) {
				helperText = err.message;
			} else {
				helperText = 'Unknown error';
			}

			throw err;
		}
	}

	const { data }: PageProps = $props();

	let status: 'active' | 'finished' | 'error' = $state('active');
	let helperText = $state('');

	let charTestRef: HTMLSpanElement;
	let charTestsContainer: HTMLDivElement;
	let charTests: HTMLCollection;
	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;

	let controller: AbortController | null = null;

	let testRunning = $state(false);
	let testHasSubmitted = $state(false);
	let submitTest = $state(true);
	let testProgress = $state(0);

	let refWidth = $state(0);
	let refHeight = $state(0);
	let zeroWidthCharsCount = $state(0);
	let invisibleCharsCount = $state(0);

	const charInvisibilityThreshold = 0.1;

	if (data.charTestId !== null) {
		testHasSubmitted = true;
		submitTest = false;
	}

	onMount(() => {
		charTests = charTestsContainer.children;
		setupCharTest();

		const context = canvas.getContext('2d');
		if (!context) {
			throw new Error('Canvas context not available');
		}
		ctx = context;
	});
</script>

<svelte:head>
	<title>Secret Message Encoder - Invisible Characters Test</title>
</svelte:head>

<ButtonSet>
	<Button disabled={testRunning} onclick={doCharTest}>Start test</Button>
	<Button
		kind="danger-tertiary"
		disabled={!testRunning}
		onclick={() => {
			controller?.abort();
		}}>Stop test</Button
	>
</ButtonSet>

<Checkbox labelText="Submit test" disabled={testHasSubmitted} bind:checked={submitTest} />

<ProgressBar max={131071} value={testProgress} {status} labelText="Test status" {helperText} />

<p>
	Found {zeroWidthCharsCount} zero-width characters, {invisibleCharsCount} invisible characters.
</p>

<ExpandableTile>
	<div slot="above">Zero-width characters tests</div>
	<div slot="below">
		<span bind:this={charTestRef}>abcd</span>
		<div bind:this={charTestsContainer}>
			{#each { length: 128 } as _, i}
				<span></span>
			{/each}
		</div>
	</div>
</ExpandableTile>

<ExpandableTile>
	<div slot="above">Invisible characters tests</div>
	<div slot="below">
		<canvas width={refWidth} height={refHeight * 2} bind:this={canvas}></canvas>
	</div>
</ExpandableTile>
