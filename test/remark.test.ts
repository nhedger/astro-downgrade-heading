import { remark } from "remark";
import { describe, expect, it } from "vitest";

import remarkDowngradeHeading from "../src/plugins/remark";

describe("remarkDowngradeHeading", () => {
	it("downgrades nested MDAST headings and clamps them at six", () => {
		const result = remark()
			.use(remarkDowngradeHeading)
			.processSync("# One\n\n> ##### Five");

		expect(String(result)).toBe("## One\n\n> ###### Five\n");
	});

	it("preserves headings when disabled in Astro frontmatter", () => {
		const result = remark()
			.use(remarkDowngradeHeading)
			.processSync({
				value: "# One\n\n## Two",
				data: {
					astro: { frontmatter: { downgradeHeading: { enabled: false } } },
				},
			});

		expect(String(result)).toBe("# One\n\n## Two\n");
	});
});
