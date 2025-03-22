"use client"

import Link from "next/link"
import { Twitter, Github, BookOpen } from "lucide-react"

export default function SimpleSocialLinks() {
  return (
    <div className="my-8">
      <div className="flex flex-wrap gap-4">
        <Link
          href="https://twitter.com/irishvora"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800/40 transition-colors"
        >
          <Twitter size={20} />
          <span>Twitter</span>
        </Link>

        <Link
          href="https://github.com/specbug"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <Github size={20} />
          <span>GitHub</span>
        </Link>

        <Link
          href="https://www.goodreads.com/user/show/71020611-specbug"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-300 rounded-lg hover:bg-amber-200 dark:hover:bg-amber-800/40 transition-colors"
        >
          <BookOpen size={20} />
          <span>Goodreads</span>
        </Link>
      </div>
    </div>
  )
}

