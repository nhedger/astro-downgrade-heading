import { type MdastPluginInput, markdownToHtml } from "satteri";
import { describe, expect, it, vi } from "vitest";

import astroDowngradeHeading, {
	type DowngradeHeadingOptions,
} from "../src/index";

interface TestProcessor {
	name: string;
	options: Record<string, unknown>;
}

function runSetup(
	processor: TestProcessor,
	options?: DowngradeHeadingOptions,
	warn = vi.fn(),
) {
	const hook = astroDowngradeHeading(options).hooks["astro:config:setup"];

	if (!hook) {
		throw new Error("Missing astro:config:setup hook");
	}

	hook({ config: { markdown: { processor } }, logger: { warn } } as never);
	return warn;
}

describe("astroDowngradeHeading", () => {
	it("registers the Satteri plugin once", () => {
		const existingPlugin = { name: "existing" };
		const mdastPlugins: unknown[] = [existingPlugin];
		const processor = { name: "satteri", options: { mdastPlugins } };

		runSetup(processor);
		runSetup(processor);

		expect(mdastPlugins).toHaveLength(2);
		expect(mdastPlugins[0]).toBe(existingPlugin);
		expect(mdastPlugins[1]).toMatchObject({ name: "astro-downgrade-heading" });
	});

	it("registers the remark plugin once", () => {
		const existingPlugin = () => undefined;
		const remarkPlugins: unknown[] = [existingPlugin];
		const processor = { name: "unified", options: { remarkPlugins } };

		runSetup(processor);
		runSetup(processor);

		expect(remarkPlugins).toHaveLength(2);
		expect(remarkPlugins[0]).toBe(existingPlugin);
		expect(remarkPlugins[1]).toEqual([expect.any(Function), {}]);
	});

	it("forwards options to both processor plugins", async () => {
		const options = { by: 2 };
		const mdastPlugins: unknown[] = [];
		const remarkPlugins: unknown[] = [];

		runSetup({ name: "satteri", options: { mdastPlugins } }, options);
		runSetup({ name: "unified", options: { remarkPlugins } }, options);

		const result = await markdownToHtml("# One", {
			mdastPlugins: mdastPlugins as MdastPluginInput[],
		});
		expect(result.html).toBe("<h3>One</h3>\n");
		expect(remarkPlugins[0]).toEqual([expect.any(Function), options]);
	});

	it("warns when the Markdown processor is unsupported", () => {
		const warn = runSetup({ name: "custom", options: {} });

		expect(warn).toHaveBeenCalledOnce();
		expect(warn).toHaveBeenCalledWith(
			'Cannot register with unsupported Markdown processor "custom".',
		);
	});
});
