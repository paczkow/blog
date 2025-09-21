# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

- `npm run dev` - Start the development server
- `npm run build` - Build the project for production
- `npm run preview` - Preview the built site locally
- `npx @biomejs/biome format --write .` - Format code using Biome
- `npx @biomejs/biome lint --fix .` - Lint and fix code using Biome

## Code Architecture

This is an Astro-based personal blog with the following key architectural elements:

### Content Management
- **Content Collections**: Uses Astro's content collections system with two main types:
  - `essays` - Long-form blog posts located in `src/content/essays/`
  - `notes` - Shorter knowledge notes located in `src/content/notes/`
- **Content Schema**: Defined in `src/models.ts` using Zod schemas:
  - Essays: title, date, description, topics, toc (table of contents)
  - Notes: title, date, status (spark/synthesize/evergreen), topics, toc
- **Content Config**: Located in `src/content.config.ts` using glob loaders

### Technology Stack
- **Framework**: Astro 5 with React integration for interactive components
- **Styling**: TailwindCSS v4 with Tailwind Typography plugin
- **Icons**: astro-icon for SVG icon management
- **Search**: Fuse.js for fuzzy search functionality in writing pages
- **Content Processing**: MDX support with rehype plugins for slug generation and autolink headings
- **Reading Time**: Custom remark plugin (`plugins/minutes-read.mjs`) calculates reading time
- **OG Images**: Dynamic Open Graph image generation in `src/og/`

### Key Components Structure
- **Layouts**: `src/layouts/Base.astro` - main layout wrapper
- **Components**: Mix of Astro (.astro) and React (.tsx) components
  - Astro components for static elements (Button, Link, Prose, etc.)
  - React components for interactive features (Search, Card, writing components)
- **Pages**: File-based routing with dynamic routes for blog posts (`[slug]`)
- **State Management**: Nanostores for lightweight client-side state

### Content Organization
- Essays and notes support frontmatter with topics for categorization
- Notes have a status system (spark → synthesize → evergreen) for knowledge maturity
- Automatic table of contents generation based on frontmatter
- RSS feed generation for content syndication

### Styling Approach
- Uses Radix UI colors for consistent color system
- Inter Variable font for typography
- Custom prose styling in `src/components/Prose.astro`
- Dark/light theme support with theme toggle

### Build Configuration
- Biome for linting and formatting (config in `biome.json`)
- Custom Astro config with rehype/remark plugins for enhanced markdown processing
- Shiki syntax highlighting with Catppuccin Latte theme
