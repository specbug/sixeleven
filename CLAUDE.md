# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal blog website ("sixeleven") for Rishit Vora, built with Next.js 15, React 19, TypeScript, and Tailwind CSS. The blog supports MDX content with enhanced features including LaTeX math rendering, syntax highlighting, and custom markdown components.

## Core Commands

### Development
- `npm run dev` - Start the Next.js development server
- `npm run build` - Build the production application
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint on the codebase

## Architecture

### Content System

The blog uses a file-based content system with MDX files stored in `content/`:

- **Blog posts**: `content/posts/*.mdx` - Each post has frontmatter with `title`, `date`, `excerpt`, `readingTime`, and `tags`
- **Projects**: `content/projects/*.mdx` - Project descriptions with `title`, `excerpt`, `technologies`, and optional `link`
- **About page**: `content/about.mdx` - Static about page content

Content is loaded via helper functions in `lib/mdx.ts`:
- `getAllPosts()` - Returns all blog posts sorted by date (newest first)
- `getPostBySlug(slug)` - Returns a single post by slug
- `getAllProjects()` - Returns all projects
- `getProjectBySlug(slug)` - Returns a single project
- `getAboutContent()` - Returns the about page content

### Routing Structure

The app uses Next.js 15 App Router:
- `/` - Homepage (app/page.tsx)
- `/blog` - Blog list page (app/blog/page.tsx)
- `/blog/[slug]` - Individual blog post pages (app/blog/[slug]/page.tsx)
- `/projects` - Projects listing page (app/projects/page.tsx)
- `/about` - About page (app/about/page.tsx)
- `/archive` - Blog archive page (app/archive/)
- `/api/og` - Open Graph image generation endpoint

### Component Architecture

**Key Components:**
- `enhanced-markdown.tsx` - Custom markdown renderer with support for:
  - Block and inline LaTeX math expressions
  - YouTube embeds via `{{youtube:VIDEO_ID}}`
  - Colored text via `{{color:COLOR|TEXT}}`
  - Info/warning callouts via `{{callout:TYPE|TEXT}}`
  - Creative Commons attribution
- `code-block.tsx` - Syntax highlighted code blocks using Prism.js
- `Navigation.tsx` - Site navigation header
- `Footer.tsx` - Site footer
- `TableOfContents.tsx` - Auto-generated TOC from markdown headings
- `ReadingProgressBar.tsx` - Shows reading progress on blog posts

**UI Components:**
Located in `components/ui/` - Radix UI-based components styled with Tailwind CSS (accordion, alert-dialog, avatar, button, card, dialog, dropdown-menu, etc.)

### Styling System

- **Tailwind CSS** configured in `tailwind.config.ts`
- **Typography Plugin** for prose styling with custom font families
- **Custom Fonts** defined in `lib/fonts.ts`:
  - `serifFont` - For body text
  - `sansFont` - For headings
  - `monoFont` - For code
  - `logoFont` - For site branding
  - `blogTitleFont` - For blog post titles
- **Dark Mode** support via class-based theme switching
- **Global Styles** in `app/globals.css`

### Path Aliases

The project uses `@/*` path alias (configured in tsconfig.json) that maps to the root directory:
```typescript
import { getAllPosts } from "@/lib/mdx"
import Navigation from "@/components/Navigation"
```

### MDX Frontmatter Format

Blog posts require the following frontmatter:
```yaml
---
title: "Post Title"
date: "Month DD, YYYY"
excerpt: "Brief description"
readingTime: "5"
tags: ["tag1", "tag2"]
---
```

### Build Configuration

The Next.js config (`next.config.mjs`) has:
- ESLint and TypeScript errors ignored during builds (`ignoreDuringBuilds: true`, `ignoreBuildErrors: true`)
- Unoptimized images
- Experimental features: parallel builds and webpack worker enabled
- Merges with `v0-user-next.config.mjs` if present

### Static Generation

Blog posts and projects use static site generation (SSG):
- `generateStaticParams()` in blog/[slug]/page.tsx generates all blog post routes at build time
- Metadata (title, description, OG images) is generated per-post using `generateMetadata()`

## Working with Content

When adding new blog posts:
1. Create a new `.mdx` file in `content/posts/`
2. Add proper frontmatter with all required fields
3. The slug is automatically derived from the filename
4. Posts are automatically sorted by date (newest first)

Custom markdown features available in posts:
- LaTeX: `$$...$$` for block math, `$...$` for inline math
- YouTube: `{{youtube:VIDEO_ID}}`
- Callouts: `{{callout:info|Your message}}` or `{{callout:warning|Your message}}`
- Colored text: `{{color:#FF0000|Red text}}`
