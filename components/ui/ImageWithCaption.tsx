import Image from "next/image"

interface ImageWithCaptionProps {
  src: string
  alt: string
  caption?: string
  width?: number
  height?: number
}

export function ImageWithCaption({ src, alt, caption, width = 800, height = 500 }: ImageWithCaptionProps) {
  return (
    <figure className="my-8">
      <Image src={src || "/placeholder.svg"} alt={alt} width={width} height={height} className="rounded-lg w-full" />
      {caption && (
        <figcaption className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">{caption}</figcaption>
      )}
    </figure>
  )
}

