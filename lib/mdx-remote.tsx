"use client"

import { useState, useEffect } from "react"
import { serialize } from "next-mdx-remote/serialize"
import { MDXRemote as MDXRemoteComponent } from "next-mdx-remote"
import { ColoredText } from "@/components/ui/ColoredText"
import { YouTube } from "@/components/ui/YouTube"
import Image from "next/image"

// Define the components to be used in MDX
const components = {
  Image,
  ColoredText,
  YouTube,
  img: (props: any) => (
    <div className="my-6">
      <Image
        src={props.src || "/placeholder.svg"}
        alt={props.alt || ""}
        width={800}
        height={500}
        className="rounded-lg"
      />
    </div>
  ),
}

interface MDXRemoteProps {
  source: string
}

export function MDXRemote({ source }: MDXRemoteProps) {
  const [mdxSource, setMdxSource] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function serializeMdx() {
      try {
        const serialized = await serialize(source, {
          mdxOptions: {
            development: process.env.NODE_ENV === "development",
          },
        })
        setMdxSource(serialized)
      } catch (err) {
        console.error("Error serializing MDX:", err)
        setError("Failed to render content")
      }
    }

    serializeMdx()
  }, [source])

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  if (!mdxSource) {
    return <div className="animate-pulse">Loading content...</div>
  }

  return <MDXRemoteComponent {...mdxSource} components={components} />
}

