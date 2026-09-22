import { unified } from "@astrojs/markdown-remark";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import svelte from "@astrojs/svelte";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";
import { defineConfig } from "astro/config";
import { h } from "hastscript";
import rehypeSlug from "rehype-slug";
import { remarkReadingTime } from "./plugins/minutes-read.mjs";

import { SITE } from "./config";
import { type Lang, activeLangs } from "./src/i18n/config.ts";

// BCP 47 tags for the sitemap's `hreflang` attributes.
const LOCALE_TAGS: Record<Lang, string> = {
  en: "en-US",
  pl: "pl-PL",
};

type HastNode = {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};

// Markdown hands us a lone `<img>` wrapped in a `<p>`; the reading design wants
// a `<figure>` with a `fig. N — alt` caption. Only the alt text is emitted here
// — the label and the number come from a CSS counter in Prose.astro, so nothing
// has to carry a running count (or a locale) through the tree.
const rehypeFigures = () => (tree: HastNode) => {
  const wrap = (node: HastNode): HastNode => {
    if (node.children) node.children = node.children.map(wrap);
    if (node.type !== "element" || node.tagName !== "p") return node;

    const content = node.children?.filter(
      (child) => child.type !== "text" || child.value?.trim() !== "",
    );
    if (content?.length !== 1) return node;

    const [image] = content;
    if (image.type !== "element" || image.tagName !== "img") return node;

    const caption = String(image.properties?.alt ?? "").trim();
    return h(
      "figure",
      caption ? [image, h("figcaption", caption)] : [image],
    ) as HastNode;
  };

  wrap(tree);
};

export default defineConfig({
  site: SITE.website,
  i18n: {
    locales: ["en", "pl"],
    defaultLocale: "en",
    routing: {
      prefixDefaultLocale: false,
    },
  },
  markdown: {
    syntaxHighlight: "shiki",
    // The palette flips on a `.dark` class, not `prefers-color-scheme`, so a
    // single theme cannot serve both. `defaultColor: false` makes Shiki emit
    // `--shiki-light` / `--shiki-dark` on every token and Prose.astro picks the
    // side that matches. Vitesse is the low-chroma pair that sits closest to the
    // rest of the design.
    shikiConfig: {
      themes: { light: "vitesse-light", dark: "vitesse-dark" },
      defaultColor: false,
    },
    processor: unified({
      remarkPlugins: [remarkReadingTime],
      rehypePlugins: [rehypeSlug, rehypeFigures],
    }),
  },
  integrations: [
    icon(),
    mdx(),
    svelte(),
    // Emits sitemap-index.xml, which src/components/Head.astro already links.
    // The i18n block mirrors the top-level `i18n` config so each page lists its
    // locale alternates; `prefixDefaultLocale: false` means unprefixed URLs are
    // the English ones. Paused locales (see `enabledLangs`) are left out so the
    // sitemap never advertises a version that is no longer built — the routing
    // block above keeps every locale, since the helpers still have to resolve
    // URLs for them.
    sitemap({
      i18n: {
        defaultLocale: "en",
        locales: Object.fromEntries(
          activeLangs.map((lang) => [lang, LOCALE_TAGS[lang]]),
        ),
      },
      // Keep the index to real pages: the 404 is not a destination, and og.png
      // routes are image endpoints rather than crawlable documents.
      filter: (page) => !page.includes("/404") && !page.endsWith("og.png"),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    build: {
      rollupOptions: {
        output: {
          // Rollup splits Svelte's runtime into seven tiny chunks (if, snippet,
          // this, attributes, render, ...), each of which is a separate request
          // on every page that hydrates an island. Collapsing the runtime into
          // one chunk keeps it shared across islands while costing one request.
          manualChunks(id: string) {
            if (id.includes("node_modules/svelte/")) return "svelte";
          },
        },
      },
    },
  },
});
