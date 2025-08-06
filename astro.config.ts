import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
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
  markdown: {
    syntaxHighlight: "shiki",
    shikiConfig: {
      theme: "catppuccin-latte",
    },
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
      remarkReadingTime,
    ],
  },
  integrations: [icon(), mdx(), react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
