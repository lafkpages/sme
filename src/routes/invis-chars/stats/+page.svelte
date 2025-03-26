<script lang="ts">
	// TODO: only register the necessary components
	import { DataTable } from 'carbon-components-svelte';
	import { Chart } from 'chart.js/auto';
	import { onMount } from 'svelte';
	import type { PageProps } from './$types';

	function charCodeLabel(charCode: number) {
		return `U+${charCode.toString(16).toUpperCase().padStart(4, '0')}`;
	}

	let chartElm: HTMLCanvasElement;

	let { data }: PageProps = $props();

	let chart: Chart;
	const labels: string[] = [];
	const datasets: {
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

	for (const char of data.stats) {
		labels.push(charCodeLabel(char.id));
		datasets[0].data.push({ x: char.id, y: char.browserNameCount });
		datasets[1].data.push({ x: char.id, y: char.cpuArchitectureCount });
		datasets[2].data.push({ x: char.id, y: char.deviceModelCount });
		datasets[3].data.push({ x: char.id, y: char.deviceVendorCount });
		datasets[4].data.push({ x: char.id, y: char.engineNameCount });
		datasets[5].data.push({ x: char.id, y: char.osNameCount });
		datasets[6].data.push({ x: char.id, y: char.score });
	}

	onMount(() => {
		chart = new Chart(chartElm, {
			type: 'line',
			data: {
				labels,
				datasets
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
	<canvas bind:this={chartElm}></canvas>
</div>

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
	rows={data.stats}
>
	<svelte:fragment slot="cell" let:cell>
		{#if cell.key === 'id'}
			{charCodeLabel(cell.value)}
		{:else}
			{cell.value}
		{/if}
	</svelte:fragment>
</DataTable>
