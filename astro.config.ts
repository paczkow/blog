import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";
import { defineConfig } from "astro/config";
import { h } from "hastscript";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import { remarkReadingTime } from "./plugins/minutes-read.mjs";

import type { Element } from "node_modules/rehype-autolink-headings/lib";
import { SITE } from "./config";

import svelte from "@astrojs/svelte";

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
  },
  integrations: [icon(), mdx(), svelte()],
  vite: {
    plugins: [tailwindcss()],
  },
});
