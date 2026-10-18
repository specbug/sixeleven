export default function BlogPostSchema({
  title,
  excerpt,
  date,
  slug,
  image,
  tags,
  wordCount,
  author = "Rishit Vora",
  authorUrl = "https://sixeleven.in/about",
  baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://sixeleven.in",
}: {
  title: string
  excerpt: string
  date: string
  slug: string
  image?: string
  tags?: string[]
  wordCount?: number
  author?: string
  authorUrl?: string
  baseUrl?: string
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: excerpt,
    author: {
      "@type": "Person",
      name: author,
      url: authorUrl,
    },
    datePublished: date,
    dateModified: date,
    image: image || `${baseUrl}/api/og?title=${encodeURIComponent(title)}`,
    url: `${baseUrl}/blog/${slug}`,
    ...(tags?.length ? { keywords: tags.map((t) => t.trim()).join(", ") } : {}),
    ...(wordCount ? { wordCount } : {}),
    inLanguage: "en",
    publisher: {
      "@type": "Organization",
      name: "sixeleven",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/blog/${slug}`,
    },
  }

  // Ensure the JSON is properly stringified with spacing for readability
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd, null, 2),
      }}
    />
  )
}
