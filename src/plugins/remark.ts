import type { Root } from "mdast";
import { visit } from "unist-util-visit";

export function remarkDowngradeHeading() {
	return (tree: Root, file: { data: Record<string, unknown> }) => {
		const astro = file.data.astro as
			| { frontmatter?: { downgradeHeading?: { enabled?: unknown } } }
			| undefined;

		if (astro?.frontmatter?.downgradeHeading?.enabled === false) {
			return;
		}

		visit(tree, "heading", (node) => {
			node.depth = Math.min(node.depth + 1, 6) as typeof node.depth;
		});
	};
}

export default remarkDowngradeHeading;
