import type { MdastNode, MdastVisitorContext } from "satteri";

import type { DowngradeHeadingOptions } from "../options";

export type { DowngradeHeadingOptions } from "../options";

type Heading = Extract<MdastNode, { type: "heading" }>;

export interface DowngradeHeadingPlugin {
	name: "astro-downgrade-heading";
	heading(node: Readonly<Heading>, ctx: MdastVisitorContext): void;
}

export function downgradeHeading({
	by = 1,
}: DowngradeHeadingOptions = {}): DowngradeHeadingPlugin {
	return {
		name: "astro-downgrade-heading",
		heading(node, ctx) {
			const astro = ctx.data.astro as
				| {
						frontmatter?: {
							downgradeHeading?: false | { enabled?: unknown };
						};
				  }
				| undefined;
			const frontmatterOptions = astro?.frontmatter?.downgradeHeading;

			if (
				frontmatterOptions === false ||
				frontmatterOptions?.enabled === false
			) {
				return;
			}

			const depth = Math.min(node.depth + by, 6) as typeof node.depth;

			if (depth !== node.depth) {
				ctx.setProperty(node, "depth", depth);
			}
		},
	};
}

export default downgradeHeading;
