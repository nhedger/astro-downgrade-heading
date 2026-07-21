import { describe, expect, it, vi } from "vitest";

import astroDowngradeHeading from "../src/index";

interface TestProcessor {
	name: string;
	options: Record<string, unknown>;
}

function runSetup(processor: TestProcessor, warn = vi.fn()) {
	const hook = astroDowngradeHeading().hooks["astro:config:setup"];

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
		expect(remarkPlugins[1]).toBeTypeOf("function");
	});

	it("warns when the Markdown processor is unsupported", () => {
		const warn = runSetup({ name: "custom", options: {} });

		expect(warn).toHaveBeenCalledOnce();
		expect(warn).toHaveBeenCalledWith(
			'Cannot register with unsupported Markdown processor "custom".',
		);
	});
});
