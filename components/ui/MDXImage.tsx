import Image from "next/image"

interface MDXImageProps {
  src: string
  alt: string
  caption?: string
  width?: number
  height?: number
}

export function MDXImage({ src, alt, caption, width = 800, height = 500 }: MDXImageProps) {
  // If there's no caption, just return the image
  if (!caption) {
    return (
      <div className="my-6">
        <Image src={src || "/placeholder.svg"} alt={alt} width={width} height={height} className="rounded-lg" />
      </div>
    )
  }

  // With caption, use figure but ensure it's not inside a p tag
  return (
    <figure className="my-6">
      <Image src={src || "/placeholder.svg"} alt={alt} width={width} height={height} className="rounded-lg" />
      <figcaption className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">{caption}</figcaption>
    </figure>
  )
}

