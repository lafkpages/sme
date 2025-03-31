<script lang="ts">
	import '@carbon/charts-svelte/styles.css';
	import 'carbon-components-svelte/css/white.css';

	import {
		CodeSnippet,
		Content,
		Header,
		HeaderGlobalAction,
		HeaderNav,
		HeaderNavItem,
		HeaderNavMenu,
		HeaderUtilities,
		Modal
	} from 'carbon-components-svelte';
	import { LogoGithub } from 'carbon-icons-svelte';

	function handleError(err: unknown) {
		console.error(err);

		errorModalOpen = true;
		try {
			if (err instanceof ErrorEvent) {
				errorModalError = err.message;
			} else {
				// @ts-expect-error
				errorModalError = err.toString();

				if (errorModalError.slice(0, 8) === '[object ') {
					errorModalError = JSON.stringify(err);
				}
			}
		} catch {
			try {
				// @ts-expect-error
				errorModalError = err.toString();
			} catch (err) {
				errorModalError = 'Unknown error';
			}
		}
	}

	let errorModalOpen = $state(false);
	let errorModalError = $state('');
</script>

<svelte:window
	onerror={handleError}
	onunhandledrejection={(e) => {
		handleError(e.reason);
	}}
/>

<Modal
	modalHeading="Error"
	primaryButtonText="Reload"
	hasScrollingContent
	on:click:button--primary={() => {
		location.reload();
	}}
	bind:open={errorModalOpen}
>
	<CodeSnippet type="multi" code={errorModalError} />
</Modal>

<Header platformName="SME">
	<HeaderNav>
		<HeaderNavItem href="/" text="SME" />
		<HeaderNavMenu text="Invisible Characters">
			<HeaderNavItem href="/invis-chars/stats" text="Statistics" />
			<HeaderNavItem href="/invis-chars/test" text="Test" />
		</HeaderNavMenu>
		<HeaderNavItem
			href="https://youtu.be/aJISpi8E6gU"
			target="_blank"
			rel="noopener noreferrer"
			text="Demo Video"
		/>
	</HeaderNav>
	<HeaderUtilities>
		<HeaderGlobalAction iconDescription="GitHub" icon={LogoGithub} tooltipAlignment="end" />
	</HeaderUtilities>
</Header>

<Content>
	<slot />
</Content>

<!-- <style lang="scss">
	// https://github.com/carbon-design-system/carbon/blob/v10/docs/guides/sass.md
	// @import '../../node_modules/carbon-components-svelte/css/all.scss';
	// https://github.com/carbon-design-system/carbon-charts/tree/main/packages/svelte#usage
	// @import '@carbon/charts-svelte/scss'
</style> -->
