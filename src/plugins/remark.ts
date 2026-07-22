import type { Root } from "mdast";
import { visit } from "unist-util-visit";

import type { DowngradeHeadingOptions } from "../options";

export type { DowngradeHeadingOptions } from "../options";

export function remarkDowngradeHeading({
	by = 1,
}: DowngradeHeadingOptions = {}) {
	return (tree: Root, file: { data: Record<string, unknown> }) => {
		const astro = file.data.astro as
			| {
					frontmatter?: {
						downgradeHeading?: false | { enabled?: unknown };
					};
			  }
			| undefined;
		const frontmatterOptions = astro?.frontmatter?.downgradeHeading;

		if (frontmatterOptions === false || frontmatterOptions?.enabled === false) {
			return;
		}

		visit(tree, "heading", (node) => {
			node.depth = Math.min(node.depth + by, 6) as typeof node.depth;
		});
	};
}

export default remarkDowngradeHeading;
