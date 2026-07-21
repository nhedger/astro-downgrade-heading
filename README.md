# Astro Downgrade Heading

[![npm version](https://npmx.dev/api/registry/badge/version/astro-downgrade-heading?color=bfdbfe&labelColor=404040)](https://npmx.dev/package/astro-downgrade-heading)
[![monthly downloads](https://npmx.dev/api/registry/badge/downloads/astro-downgrade-heading?color=fed7aa&labelColor=404040)](https://npmx.dev/package/astro-downgrade-heading)
[![license](https://npmx.dev/api/registry/badge/license/astro-downgrade-heading?color=bbf7d0&labelColor=404040)](https://npmx.dev/package/astro-downgrade-heading)

Universal heading level downgrader plugin for markdown in Astro.

This package provides plugins for Satteri and remark to downgrade heading levels
in Markdown content. The heading content is preserved, and levels are clamped at
`h6` to ensure valid HTML structure.

> [!TIP]
> Although this package is designed for use with Astro, it can be used in any
> project that uses Satteri or remark.

## Why use this

Astro layouts often render the page title as an `h1`, while the Markdown body
also starts with an `h1`. This creates duplicate top-level headings or forces
authors to write Markdown with artificially lowered heading levels.

This plugin keeps the source Markdown portable and shifts its heading hierarchy
only when rendered. A document starting with `# Introduction` can therefore be
embedded below the layout's page title as `<h2>Introduction</h2>`.

## Install

```sh
npm i astro-downgrade-heading
```

## Astro

Add the integration to `astro.config.mjs`:

```js
import { defineConfig } from "astro/config";
import downgradeHeading from "astro-downgrade-heading";

export default defineConfig({
	integrations: [downgradeHeading()],
});
```

The integration detects Astro's configured Markdown processor and registers the
Satteri or remark plugin without replacing existing processor options.

To preserve the original heading levels for an individual Markdown file, set
`downgradeHeading.enabled` to `false` in its frontmatter:

```md
---
downgradeHeading:
  enabled: false
---
```

## Direct usage

Use the processor-specific plugins directly outside Astro or when configuring
the Markdown pipeline yourself.

### Satteri

```ts
import { markdownToHtml } from "satteri";
import downgradeHeading from "astro-downgrade-heading/satteri";

const { html } = markdownToHtml("# Page heading", {
  mdastPlugins: [downgradeHeading()],
});
```

### Remark

```ts
import { remark } from "remark";
import remarkDowngradeHeading from "astro-downgrade-heading/remark";

const markdown = await remark()
  .use(remarkDowngradeHeading)
  .process("# Page heading");
```

## License

This project is licensed under the [MIT License](./LICENSE).

Copyright (c) 2026 Nicolas Hedger.
