<script lang="ts">
	// TODO: only register the necessary components
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
		labels.push(charCodeLabel(char.charCode));
		datasets[0].data.push({ x: char.charCode, y: char.browserNameCount });
		datasets[1].data.push({ x: char.charCode, y: char.cpuArchitectureCount });
		datasets[2].data.push({ x: char.charCode, y: char.deviceModelCount });
		datasets[3].data.push({ x: char.charCode, y: char.deviceVendorCount });
		datasets[4].data.push({ x: char.charCode, y: char.engineNameCount });
		datasets[5].data.push({ x: char.charCode, y: char.osNameCount });
		datasets[6].data.push({ x: char.charCode, y: char.score });
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

<a href="/">Back to SME</a>

<div class="outlined">
	<canvas bind:this={chartElm}></canvas>
</div>

<div class="outlined">
	<table>
		<thead>
			<tr>
				<th>Character</th>
				<th>Preview</th>
				<th>Browsers</th>
				<th>CPU Architectures</th>
				<th>Device Models</th>
				<th>Device Vendors</th>
				<th>Engines</th>
				<th>Operating Systems</th>
				<th>Score</th>
			</tr>
		</thead>
		<tbody>
			{#each data.stats as char}
				<tr>
					<td>{charCodeLabel(char.charCode)}</td>
					<td>ab{String.fromCharCode(char.charCode)}cd</td>
					<td>{char.browserNameCount}</td>
					<td>{char.cpuArchitectureCount}</td>
					<td>{char.deviceModelCount}</td>
					<td>{char.deviceVendorCount}</td>
					<td>{char.engineNameCount}</td>
					<td>{char.osNameCount}</td>
					<td>{char.score}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
