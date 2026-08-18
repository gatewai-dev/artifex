import { defineConfig } from "tsdown";

export default defineConfig({
	entry: {
		"index": "src/metadata.ts",
		"server": "src/server/index.ts"
},
	format: ["esm"],
	dts: true,
	clean: true,
	sourcemap: true,
	treeshake: true,
});
