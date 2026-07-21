import type { Root } from "mdast";
import { visit } from "unist-util-visit";

export function remarkDowngradeHeading(): (tree: Root) => void {
	return (tree) => {
		visit(tree, "heading", (node) => {
			node.depth = Math.min(node.depth + 1, 6) as typeof node.depth;
		});
	};
}

export default remarkDowngradeHeading;
