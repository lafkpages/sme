<script lang="ts">
	// TODO: only register the necessary components
	import type { PageProps } from './$types';

	import { AreaChart, ScaleTypes } from '@carbon/charts-svelte';
	import {
		Column,
		DataTable,
		Dropdown,
		Grid,
		Row,
		Tab,
		TabContent,
		Tabs
	} from 'carbon-components-svelte';

	function charCodeLabel(charCode: number) {
		return `U+${charCode.toString(16).toUpperCase().padStart(4, '0')}`;
	}

	let { data }: PageProps = $props();
	type Row = (typeof data.zeroWidthCharsStats)[number];

	let zeroWidthCharsScores = new Set<number>();
	let invisibleCharsScores = new Set<number>();
	for (const { score } of data.zeroWidthCharsStats) {
		zeroWidthCharsScores.add(score);
	}
	for (const { score } of data.invisibleCharsStats) {
		invisibleCharsScores.add(score);
	}

	const zeroWidthCharsSortedScores = Array.from(zeroWidthCharsScores).sort((a, b) => b - a);
	const invisibleCharsSortedScores = Array.from(invisibleCharsScores).sort((a, b) => b - a);

	let compat = $state(-1);
</script>

<svelte:head>
	<title>Secret Message Encoder - Invisible Characters Statistics</title>
</svelte:head>

<Grid padding>
	<Row>
		<Column>
			<Dropdown
				titleText="Cross-platform compatibility"
				bind:selectedId={compat}
				items={[
					{ id: 0, text: 'Maximum' },
					{ id: 1, text: 'Good' },
					{ id: 2, text: 'Less' },
					{ id: -1, text: 'None (all characters)' }
				]}
			/>
		</Column>
	</Row>

	<Row>
		<Column>
			<Tabs autoWidth selected={1}>
				<Tab label="Zero-width characters" />
				<Tab label="Invisible characters" />

				<svelte:fragment slot="content">
					<TabContent>
						{@render tab(data.zeroWidthCharsStats, 'Zero-width', zeroWidthCharsSortedScores)}
					</TabContent>
					<TabContent>
						{@render tab(data.invisibleCharsStats, 'Invisible', invisibleCharsSortedScores)}
					</TabContent>
				</svelte:fragment>
			</Tabs>
		</Column>
	</Row>
</Grid>

{#snippet tab(data: Row[], title: string, scores: number[])}
	<Grid>
		<Row>
			<Column>
				<AreaChart
					{data}
					options={{
						title: `${title} characters statistics`,
						height: '400px',
						legend: { enabled: false },
						axes: {
							left: {
								title: 'Score',
								mapsTo: 'score',
								thresholds: compat
									? [
											{
												label: 'Maximum compatibility',
												value: scores[0]
											},
											{
												label: 'Good compatibility',
												value: scores[1]
											},
											{
												label: 'Less compatibility',
												value: scores[2]
											}
										]
									: undefined,
								domain: compat === -1 ? undefined : [scores[compat], scores[0]]
							},
							bottom: {
								title: 'Char code',
								mapsTo: 'id',
								scaleType: ScaleTypes.LABELS
							}
						}
					}}
				/>
			</Column>
		</Row>

		<Row>
			<Column>
				<DataTable
					sortable
					size="compact"
					stickyHeader
					title="{title} characters data"
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
					rows={data}
				>
					<svelte:fragment slot="cell" let:cell>
						{#if cell.key === 'id'}
							{charCodeLabel(cell.value)}
						{:else}
							{cell.value}
						{/if}
					</svelte:fragment>
				</DataTable>
			</Column>
		</Row>
	</Grid>
{/snippet}
