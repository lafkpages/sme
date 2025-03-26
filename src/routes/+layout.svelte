<script lang="ts">
	import {
		Content,
		Header,
		HeaderNav,
		HeaderNavItem,
		HeaderNavMenu
	} from 'carbon-components-svelte';
	import 'carbon-components-svelte/css/white.css';
</script>

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
		<HeaderNavItem
			href="https://github.com/lafkpages/sme"
			target="_blank"
			rel="noopener noreferrer"
			text="GitHub"
		/>
	</HeaderNav>
</Header>

<Content>
	<slot />
</Content>

<style lang="scss">
	// https://github.com/carbon-design-system/carbon/blob/v10/docs/guides/sass.md
	// @import '../../node_modules/carbon-components-svelte/css/all.scss';
</style>
