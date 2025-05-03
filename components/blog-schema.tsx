export default function BlogPostSchema({
    title,
    excerpt,
    date,
    slug,
    author = "Rishit Vora",
    authorUrl = "https://sixeleven.in/about",
    baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://sixeleven.in",
  }: {
    title: string
    excerpt: string
    date: string
    slug: string
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
      image: `${baseUrl}/api/og?title=${encodeURIComponent(title)}`,
      url: `${baseUrl}/blog/${slug}`,
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
  
    return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
  }
  