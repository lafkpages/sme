<script lang="ts">
	import { BitArray } from '$lib/bitArray';
	import { Button, ButtonSet, Checkbox, ProgressBar } from 'carbon-components-svelte';
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

			controller = new AbortController();

			testRunning = true;
			testCharCode = 0;

			console.debug('Char test start');
			status = 'active';

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
				helperText = `Tested ${testCharCode} of 65535 characters`;

				if (controller.signal.aborted) {
					testRunning = false;
					status = 'error';
					helperText = 'Test aborted';
					return;
				}
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

	let refWidth = 0;

	let status: 'active' | 'finished' | 'error' = $state('active');
	let helperText = $state('');

	let charTestRef: HTMLSpanElement;
	let charTestsContainer: HTMLDivElement;
	let charTests: HTMLCollection;

	let controller: AbortController | null = null;

	let testRunning = $state(false);
	let testHasSubmitted = $state(false);
	let submitTest = $state(true);
	let testCharCode = $state(0);

	if (data.charTestId !== null) {
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

<ProgressBar max={65535} value={testCharCode} {status} labelText="Test status" {helperText} />

<span class="char-test" bind:this={charTestRef}>abcd</span>
<div bind:this={charTestsContainer}>
	{#each { length: 128 } as _, i}
		<span class="char-test"></span>
	{/each}
</div>

<style>
	.char-test {
		color: transparent;
		pointer-events: none;
		position: fixed;
		top: 0px;
		left: 0px;
	}
</style>
