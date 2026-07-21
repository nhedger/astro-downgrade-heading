import { markdownToHtml } from "satteri";
import { describe, expect, it } from "vitest";

import { downgradeHeading } from "../src/plugins/satteri";

describe("downgradeHeading", () => {
	it("downgrades headings by one level", () => {
		const result = markdownToHtml("# One\n\n## Two", {
			mdastPlugins: [downgradeHeading()],
		});

		expect(result.html).toBe("<h2>One</h2>\n<h3>Two</h3>\n");
	});

	it("clamps heading levels at six", () => {
		const result = markdownToHtml("##### Five\n\n###### Six", {
			mdastPlugins: [downgradeHeading()],
		});

		expect(result.html).toBe("<h6>Five</h6>\n<h6>Six</h6>\n");
	});

	it("preserves headings when disabled in Astro frontmatter", () => {
		const result = markdownToHtml("# One\n\n## Two", {
			mdastPlugins: [downgradeHeading()],
			data: {
				astro: { frontmatter: { downgradeHeading: { enabled: false } } },
			},
		});

		expect(result.html).toBe("<h1>One</h1>\n<h2>Two</h2>\n");
	});
});
