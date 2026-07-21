import type { AstroIntegration } from "astro";

import remarkDowngradeHeading from "./plugins/remark";
import { downgradeHeading } from "./plugins/satteri";

const integrationName = "astro-downgrade-heading";

export function astroDowngradeHeading(): AstroIntegration {
	return {
		name: integrationName,
		hooks: {
			"astro:config:setup": ({ config, logger }) => {
				const { processor } = config.markdown;
				const options = processor.options as Record<string, unknown>;

				if (
					processor.name === "satteri" &&
					Array.isArray(options.mdastPlugins)
				) {
					const alreadyRegistered = options.mdastPlugins.some(
						(plugin) =>
							typeof plugin === "object" &&
							plugin !== null &&
							"name" in plugin &&
							plugin.name === integrationName,
					);

					if (!alreadyRegistered) {
						options.mdastPlugins.push(downgradeHeading());
					}

					return;
				}

				if (
					processor.name === "unified" &&
					Array.isArray(options.remarkPlugins)
				) {
					const alreadyRegistered = options.remarkPlugins.some(
						(plugin) =>
							plugin === remarkDowngradeHeading ||
							(Array.isArray(plugin) && plugin[0] === remarkDowngradeHeading),
					);

					if (!alreadyRegistered) {
						options.remarkPlugins.push(remarkDowngradeHeading);
					}

					return;
				}

				logger.warn(
					`Cannot register with unsupported Markdown processor "${processor.name}".`,
				);
			},
		},
	};
}

export default astroDowngradeHeading;
