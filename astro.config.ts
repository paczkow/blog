import mdx from "@astrojs/mdx";
import { unified } from "@astrojs/markdown-remark";
import sitemap from "@astrojs/sitemap";
import svelte from "@astrojs/svelte";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";
import { defineConfig } from "astro/config";
import { h } from "hastscript";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import { remarkReadingTime } from "./plugins/minutes-read.mjs";

import type { Element } from "node_modules/rehype-autolink-headings/lib";
import { SITE } from "./config";

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
    shikiConfig: {
      theme: "catppuccin-latte",
    },
    processor: unified({
      remarkPlugins: [remarkReadingTime],
      rehypePlugins: [
        rehypeSlug,
        [
          rehypeAutolinkHeadings,
          {
            behavior: "wrap",
            test: (node: { tagName: string }) => node.tagName === "h2",
            headingProperties: () => ({
              class: "scroll-mt-[132px]",
            }),
            content: (heading: Element) => [
              h(
                "div",
                {
                  className: "group flex gap-2 -ml-5",
                },
                [
                  h(
                    "span",
                    {
                      className:
                        "opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                    },
                    "#",
                  ),
                  h("span", heading.children),
                ],
              ),
            ],
          },
        ],
      ],
    }),
  },
  integrations: [
    icon(),
    mdx(),
    svelte(),
    // Emits sitemap-index.xml, which src/components/Head.astro already links.
    // The i18n block mirrors the top-level `i18n` config so each page lists its
    // locale alternates; `prefixDefaultLocale: false` means unprefixed URLs are
    // the English ones.
    sitemap({
      i18n: {
        defaultLocale: "en",
        locales: { en: "en-US", pl: "pl-PL" },
      },
      // Keep the index to real pages: the 404 is not a destination, and og.png
      // routes are image endpoints rather than crawlable documents.
      filter: (page) => !page.includes("/404") && !page.endsWith("og.png"),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
