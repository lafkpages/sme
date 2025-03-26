import type { BuildConfig } from 'bun';

const buildTimestamp = Date.now();

// Build scriptlet
async function buildScriptlet(buildConfig?: Partial<BuildConfig>) {
	return await Bun.build({
		entrypoints: ['src/scriptlet/index.ts'],
		target: 'browser',
		banner: '(()=>{',
		footer: '})()',
		naming: {},
		...buildConfig
	});
}

const scriptletBuild = await buildScriptlet();
if (!scriptletBuild.success) {
	console.error(scriptletBuild.logs);
	throw new Error('Failed to build scriptlet');
}

const scriptletMinBuild = await buildScriptlet({
	minify: true
});
if (!scriptletMinBuild.success) {
	console.error(scriptletMinBuild.logs);
	throw new Error('Failed to build minified scriptlet');
}

const scriptlet = await scriptletBuild.outputs[0].text();
const scriptletMin = await scriptletMinBuild.outputs[0].text();

await Bun.write('.svelte-kit/cloudflare/scriptlet.js', scriptlet);
await Bun.write('.svelte-kit/cloudflare/scriptlet.min.js', scriptletMin);

// Copy scriptlet to userscript
const userscriptMeta = (await Bun.file('src/scriptlet/userscript.meta.js').text()).replace(
	/{{USERSCRIPT_VERSION}}/g,
	`1.0.${buildTimestamp}`
);
await Bun.write(
	'.svelte-kit/cloudflare/userscript.user.js',
	`\
${userscriptMeta}
${scriptlet}`
);

// Copy userscript meta
await Bun.write('.svelte-kit/cloudflare/userscript.meta.js', userscriptMeta);
