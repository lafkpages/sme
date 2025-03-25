<script lang="ts">
	import { BitArray } from '$lib/bitArray';
	import { onMount } from 'svelte';
	import type { PageProps } from './$types';

	function zeroTimeout() {
		return new Promise((resolve) => setTimeout(resolve, 0));
	}

	function setupCharTest() {
		refWidth = charTestRef.getBoundingClientRect().width;
	}

	async function doCharTest() {
		try {
			if (!refWidth) {
				throw new Error('Char test not set up');
			}

			if (testRunning) {
				throw new Error('Test already running');
			}

			testRunning = true;
			testCharCode = 0;

			console.debug('Char test start');
			indicator = 'running';

			const chars = new BitArray();

			const startTime = performance.now();
			while (testCharCode < 0xffff) {
				for (let i = 0; i < 128; i++) {
					charTests[i].textContent = `ab${String.fromCharCode(testCharCode + i)}cd`;
				}

				await zeroTimeout();

				for (let i = 0; i < 128; i++) {
					const testWidth = charTests[i].getBoundingClientRect().width;

					if (testWidth === refWidth) {
						const code = testCharCode + i;
						console.debug('Char', code, 'is invisible');
						chars.set(BigInt(code), true);
					}
				}

				testCharCode += 128;
			}
			const endTime = performance.now();

			console.debug('Char test end', endTime - startTime);
			testRunning = false;

			if (chars.buffer) {
				if (submitTest) {
					const resp = await fetch('/invis-chars/test', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/octet-stream'
						},
						body: chars.toUint8Array(8192)
					});

					if (resp.status === 201) {
						indicator = 'success';
						testHasSubmitted = true;
						submitTest = false;
					} else if (resp.status === 503) {
						indicator = 'disabled';
					} else {
						throw new Error('Char test request failed');
					}
				} else {
					indicator = 'disabled';
				}
			} else {
				indicator = 'empty';
			}
		} catch (err) {
			indicator = 'fail';
			testRunning = false;
			throw err;
		}
	}

	const { data }: PageProps = $props();

	let refWidth = 0;

	let indicator = $state('');

	let charTestRef: HTMLSpanElement;
	let charTestsContainer: HTMLDivElement;
	let charTests: HTMLCollection;

	let testRunning = $state(false);
	let testHasSubmitted = $state(false);
	let submitTest = $state(true);
	let testCharCode = $state(0);

	if (data.charTestId !== null) {
		indicator = 'already';
		testHasSubmitted = true;
		submitTest = false;
	}

	onMount(() => {
		charTests = charTestsContainer.children;
		setupCharTest();
	});
</script>

<svelte:head>
	<title>Secret Message Encoder - Invisible Characters Test</title>
</svelte:head>

<div class="outlined">
	<button id="start-test" disabled={testRunning} onclick={doCharTest}>Start test</button>
	<button id="stop-test" disabled={!testRunning}>Stop test</button>

	<label>
		<input type="checkbox" disabled={testHasSubmitted} bind:checked={submitTest} />
		Submit test
	</label>

	<progress max="65535" value={testCharCode}></progress>

	<p>
		<span id="char-test-indicator" class="char-test-indicator-{indicator}"></span>
		{indicator}
	</p>
</div>

<span class="char-test" bind:this={charTestRef}>abcd</span>
<div bind:this={charTestsContainer}>
	{#each { length: 128 } as _, i}
		<span class="char-test"></span>
	{/each}
</div>

<style>
	#char-test-indicator {
		display: inline-block;
		vertical-align: baseline;
		width: 8px;
		height: 8px;
		border-radius: 50%;
	}

	#char-test-indicator.char-test-indicator-success {
		background-color: green;
	}

	#char-test-indicator.char-test-indicator-empty {
		background-color: yellow;
	}

	#char-test-indicator.char-test-indicator-disabled {
		background-color: gray;
	}

	#char-test-indicator.char-test-indicator-fail {
		background-color: red;
	}

	#char-test-indicator.char-test-indicator-already {
		background-color: orange;
	}

	#char-test-indicator.char-test-indicator-running {
		background-color: blue;
	}

	.char-test {
		color: transparent;
		pointer-events: none;
		position: fixed;
		top: 0px;
		left: 0px;
	}
</style>
