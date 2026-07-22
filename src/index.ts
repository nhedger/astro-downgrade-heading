import type { AstroIntegration } from "astro";

import type { DowngradeHeadingOptions } from "./options";
import remarkDowngradeHeading from "./plugins/remark";
import { downgradeHeading } from "./plugins/satteri";

export type { DowngradeHeadingOptions } from "./options";

const integrationName = "astro-downgrade-heading";

export function astroDowngradeHeading(
	integrationOptions: DowngradeHeadingOptions = {},
): AstroIntegration {
	return {
		name: integrationName,
		hooks: {
			"astro:config:setup": ({ config, logger }) => {
				const { processor } = config.markdown;
				const processorOptions = processor.options as Record<string, unknown>;

				if (
					processor.name === "satteri" &&
					Array.isArray(processorOptions.mdastPlugins)
				) {
					const alreadyRegistered = processorOptions.mdastPlugins.some(
						(plugin) =>
							typeof plugin === "object" &&
							plugin !== null &&
							"name" in plugin &&
							plugin.name === integrationName,
					);

					if (!alreadyRegistered) {
						processorOptions.mdastPlugins.push(
							downgradeHeading(integrationOptions),
						);
					}

					return;
				}

				if (
					processor.name === "unified" &&
					Array.isArray(processorOptions.remarkPlugins)
				) {
					const alreadyRegistered = processorOptions.remarkPlugins.some(
						(plugin) =>
							plugin === remarkDowngradeHeading ||
							(Array.isArray(plugin) && plugin[0] === remarkDowngradeHeading),
					);

					if (!alreadyRegistered) {
						processorOptions.remarkPlugins.push([
							remarkDowngradeHeading,
							integrationOptions,
						]);
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
