import { defineConfig } from "tsdown";

export default defineConfig({
	entry: {
		index: "src/index.ts",
		remark: "src/plugins/remark.ts",
		satteri: "src/plugins/satteri.ts",
	},
	format: ["esm"],
	dts: {
		sourcemap: true,
	},
	clean: true,
	sourcemap: true,
	platform: "neutral",
	target: "es2022",
	deps: {
		skipNodeModulesBundle: true,
		onlyImport: ["astro", "mdast", "satteri", "unist-util-visit"],
	},
});
