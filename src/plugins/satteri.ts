import type { MdastNode, MdastVisitorContext } from "satteri";

type Heading = Extract<MdastNode, { type: "heading" }>;

export interface DowngradeHeadingPlugin {
	name: "astro-downgrade-heading";
	heading(node: Readonly<Heading>, ctx: MdastVisitorContext): void;
}

export function downgradeHeading(): DowngradeHeadingPlugin {
	return {
		name: "astro-downgrade-heading",
		heading(node, ctx) {
			const depth = Math.min(node.depth + 1, 6) as typeof node.depth;

			if (depth !== node.depth) {
				ctx.setProperty(node, "depth", depth);
			}
		},
	};
}

export default downgradeHeading;
