<script lang="ts">
	import {
		Content,
		Header,
		HeaderGlobalAction,
		HeaderNav,
		HeaderNavItem,
		HeaderNavMenu,
		HeaderUtilities
	} from 'carbon-components-svelte';
	import 'carbon-components-svelte/css/white.css';
	import { LogoGithub } from 'carbon-icons-svelte';
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
	</HeaderNav>
	<HeaderUtilities>
		<HeaderGlobalAction iconDescription="GitHub" icon={LogoGithub} tooltipAlignment="end" />
	</HeaderUtilities>
</Header>

<Content>
	<slot />
</Content>

<style lang="scss">
	// https://github.com/carbon-design-system/carbon/blob/v10/docs/guides/sass.md
	// @import '../../node_modules/carbon-components-svelte/css/all.scss';
</style>
