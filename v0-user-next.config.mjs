/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure `pageExtensions` to include markdown and MDX files
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  // Configure image domains for external images
  images: {
    domains: ['v0.blob.com'],
    unoptimized: process.env.NODE_ENV !== 'production',
  },
}

export default nextConfig

