import type { BuildConfig } from "bun";

import { cp, symlink } from "node:fs/promises";

import { $ } from "bun";

import { getBuildTimestamp } from "./macros";

// Delete previous builds
await $`rm -rf dist`;

// Set build timestamp
await Bun.write("dist/.build-timestamp.txt", Date.now().toString());

// Build web
await Bun.build({
  entrypoints: ["src/index.html"],
  minify: true,
  outdir: "dist",
  naming: { chunk: "chunks/[name]-[hash].[ext]" },
});

// Build service worker
await Bun.build({
  entrypoints: ["src/sw.ts"],
  minify: true,
  outdir: "dist",
  naming: { entry: `sw-${getBuildTimestamp()}.[ext]` },
});

// Build scriptlet
async function buildScriptlet(buildConfig?: Partial<BuildConfig>) {
  return await Bun.build({
    entrypoints: ["src/scriptlet.ts"],
    target: "browser",
    banner: "(()=>{",
    footer: "})()",
    naming: {},
    ...buildConfig,
  });
}

const scriptletBuild = await buildScriptlet();
if (!scriptletBuild.success) {
  console.error(scriptletBuild.logs);
  throw new Error("Failed to build scriptlet");
}

const scriptletMinBuild = await buildScriptlet({
  minify: true,
});
if (!scriptletMinBuild.success) {
  console.error(scriptletMinBuild.logs);
  throw new Error("Failed to build minified scriptlet");
}

const scriptlet = await scriptletBuild.outputs[0].text();
const scriptletMin = await scriptletMinBuild.outputs[0].text();

await Bun.write("dist/scriptlet.js", scriptlet);
await Bun.write("dist/scriptlet.min.js", scriptletMin);

// Copy scriptlet to userscript
const userscriptMeta = (
  await Bun.file("src/userscript.meta.js").text()
).replace(/{{USERSCRIPT_VERSION}}/g, `1.0.${getBuildTimestamp()}`);
await Bun.write(
  "dist/userscript.user.js",
  `\
${userscriptMeta}
${scriptlet}`,
);

// Copy userscript meta
await Bun.write("dist/userscript.meta.js", userscriptMeta);

// Copy assets
if (process.env.CF_PAGES === "1") {
  await cp("../assets", "dist/assets", { recursive: true });
} else {
  await symlink("../assets", "dist/assets");
}
