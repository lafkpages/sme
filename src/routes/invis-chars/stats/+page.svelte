<script lang="ts">
	// TODO: only register the necessary components
	import { ContentSwitcher, DataTable, Switch } from 'carbon-components-svelte';
	import { Chart } from 'chart.js/auto';
	import { onMount } from 'svelte';
	import type { PageProps } from './$types';

	function charCodeLabel(charCode: number) {
		return `U+${charCode.toString(16).toUpperCase().padStart(4, '0')}`;
	}

	let zeroWidthCharsChartElm: HTMLCanvasElement;
	let invisibleCharsChartElm: HTMLCanvasElement;

	let { data }: PageProps = $props();

	let selectedIndex = $state(0);

	let zeroWidthCharsChart: Chart;
	let invisibleCharsChart: Chart;

	const zeroWidthCharsLabels: string[] = [];
	const invisibleCharsLabels: string[] = [];

	const zeroWidthCharsDatasets: {
		label: string;
		data: { x: number; y: number }[];
	}[] = [
		{
			label: 'Browsers',
			data: []
		},
		{
			label: 'CPU Architectures',
			data: []
		},
		{
			label: 'Device Models',
			data: []
		},
		{
			label: 'Device Vendors',
			data: []
		},
		{
			label: 'Engines',
			data: []
		},
		{
			label: 'Operating Systems',
			data: []
		},
		{
			label: 'Score',
			data: []
		}
	];
	const invisibleCharsDatasets = structuredClone(zeroWidthCharsDatasets);

	for (const char of data.zeroWidthCharsStats) {
		zeroWidthCharsLabels.push(charCodeLabel(char.id));
		zeroWidthCharsDatasets[0].data.push({ x: char.id, y: char.browserNameCount });
		zeroWidthCharsDatasets[1].data.push({ x: char.id, y: char.cpuArchitectureCount });
		zeroWidthCharsDatasets[2].data.push({ x: char.id, y: char.deviceModelCount });
		zeroWidthCharsDatasets[3].data.push({ x: char.id, y: char.deviceVendorCount });
		zeroWidthCharsDatasets[4].data.push({ x: char.id, y: char.engineNameCount });
		zeroWidthCharsDatasets[5].data.push({ x: char.id, y: char.osNameCount });
		zeroWidthCharsDatasets[6].data.push({ x: char.id, y: char.score });
	}
	for (const char of data.invisibleCharsStats) {
		invisibleCharsLabels.push(charCodeLabel(char.id));
		invisibleCharsDatasets[0].data.push({ x: char.id, y: char.browserNameCount });
		invisibleCharsDatasets[1].data.push({ x: char.id, y: char.cpuArchitectureCount });
		invisibleCharsDatasets[2].data.push({ x: char.id, y: char.deviceModelCount });
		invisibleCharsDatasets[3].data.push({ x: char.id, y: char.deviceVendorCount });
		invisibleCharsDatasets[4].data.push({ x: char.id, y: char.engineNameCount });
		invisibleCharsDatasets[5].data.push({ x: char.id, y: char.osNameCount });
		invisibleCharsDatasets[6].data.push({ x: char.id, y: char.score });
	}

	onMount(() => {
		zeroWidthCharsChart = new Chart(zeroWidthCharsChartElm, {
			type: 'line',
			data: {
				labels: zeroWidthCharsLabels,
				datasets: zeroWidthCharsDatasets
			},
			options: {
				animation: false
			}
		});
		invisibleCharsChart = new Chart(invisibleCharsChartElm, {
			type: 'line',
			data: {
				labels: invisibleCharsLabels,
				datasets: invisibleCharsDatasets
			},
			options: {
				animation: false
			}
		});
	});
</script>

<svelte:head>
	<title>Secret Message Encoder - Invisible Characters Statistics</title>
</svelte:head>

<div>
	<canvas bind:this={zeroWidthCharsChartElm} class:hide={selectedIndex}></canvas>

	<canvas bind:this={invisibleCharsChartElm} class:hide={!selectedIndex}></canvas>
</div>

<ContentSwitcher bind:selectedIndex>
	<Switch text="Zero-width characters" />
	<Switch text="Invisible characters" />
</ContentSwitcher>

<DataTable
	sortable
	size="compact"
	stickyHeader
	headers={[
		{ key: 'id', value: 'Char code' },
		{ key: 'browserNameCount', value: 'Browsers' },
		{ key: 'cpuArchitectureCount', value: 'CPU Architectures' },
		{ key: 'deviceModelCount', value: 'Device Models' },
		{ key: 'deviceVendorCount', value: 'Device Vendors' },
		{ key: 'engineNameCount', value: 'Engines' },
		{ key: 'osNameCount', value: 'Operating Systems' },
		{ key: 'score', value: 'Score' }
	]}
	rows={selectedIndex ? data.invisibleCharsStats : data.zeroWidthCharsStats}
>
	<svelte:fragment slot="cell" let:cell>
		{#if cell.key === 'id'}
			{charCodeLabel(cell.value)}
		{:else}
			{cell.value}
		{/if}
	</svelte:fragment>
</DataTable>

<style>
	canvas.hide {
		display: none !important;
	}
</style>
