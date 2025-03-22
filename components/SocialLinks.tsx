"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Twitter, Github, BookOpen, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

interface SocialLinkProps {
  href: string
  icon: React.ReactNode
  label: string
  color: string
  hoverColor: string
}

const SocialLink = ({ href, icon, label, color, hoverColor }: SocialLinkProps) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "flex items-center gap-3 p-4 rounded-lg transition-all duration-300 group",
        `bg-${color}/10 hover:bg-${hoverColor}/20`,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={cn("p-3 rounded-full transition-all duration-300", `bg-${color}/20 group-hover:bg-${hoverColor}/30`)}
      >
        {icon}
      </div>
      <div>
        <div className="font-medium">{label}</div>
        <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
          <span>Follow me</span>
          <ExternalLink
            size={14}
            className={cn("transition-transform duration-300", isHovered ? "translate-x-1 translate-y-[-1px]" : "")}
          />
        </div>
      </div>
    </Link>
  )
}

export default function SocialLinks() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
      <SocialLink
        href="https://twitter.com/irishvora"
        icon={<Twitter size={24} className="text-blue-500" />}
        label="Twitter"
        color="blue-500"
        hoverColor="blue-600"
      />
      <SocialLink
        href="https://github.com/specbug"
        icon={<Github size={24} className="text-gray-800 dark:text-gray-200" />}
        label="GitHub"
        color="gray-500"
        hoverColor="gray-600"
      />
      <SocialLink
        href="https://www.goodreads.com/user/show/71020611-specbug"
        icon={<BookOpen size={24} className="text-amber-600" />}
        label="Goodreads"
        color="amber-500"
        hoverColor="amber-600"
      />
    </div>
  )
}

