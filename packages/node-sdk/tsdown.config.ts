import { defineConfig } from "tsdown";

export default defineConfig({
	entry: {
		server: "server/index.ts",
		browser: "browser/index.ts",
		renderer: "renderer/index.ts",
		index: "./index.ts",
	},
	format: ["esm"],
	dts: true,
	clean: true,
	sourcemap: true,
	treeshake: true,
	external: [
		"react",
		"react-dom",
		"react/jsx-runtime",
		"@gatewai.studio/core",
		"@gatewai.studio/webgpu-renderers",
		"zod",
		"inversify",
		"hono",
	],
});
