let userConfig = undefined
try {
  userConfig = await import('./v0-user-next.config')
} catch (e) {
  // ignore error
}

import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {},
  turbopack: {
    root: resolve(__dirname),
  },
  // Explicit Markdown URLs also work for clients unable to set Accept.
  async rewrites() {
    return [
      { source: "/blog/:slug.md", destination: "/markdown/blog/:slug" },
      { source: "/projects/:slug.md", destination: "/markdown/projects/:slug" },
      { source: "/about.md", destination: "/markdown/about" },
      { source: "/index.md", destination: "/markdown" },
      { source: "/blog.md", destination: "/markdown/blog" },
      { source: "/archive.md", destination: "/markdown/archive" },
      { source: "/projects.md", destination: "/markdown/projects" },
    ]
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
}

mergeConfig(nextConfig, userConfig)

function mergeConfig(nextConfig, userConfig) {
  if (!userConfig) {
    return
  }

  for (const key in userConfig) {
    if (
      typeof nextConfig[key] === 'object' &&
      !Array.isArray(nextConfig[key])
    ) {
      nextConfig[key] = {
        ...nextConfig[key],
        ...userConfig[key],
      }
    } else {
      nextConfig[key] = userConfig[key]
    }
  }
}

export default nextConfig
