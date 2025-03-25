import { Github, BookOpen } from "lucide-react"

export default function SocialLinks() {
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-2 text-lg">
      <a
        href="https://x.com/irishvora"
        target="_blank"
        rel="noopener noreferrer"
        className="text-accent/60 transition-colors flex items-center gap-2"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z"
            fill="currentColor"
          />
        </svg>
      </a>
      <a
        href="https://github.com/specbug"
        target="_blank"
        rel="noopener noreferrer"
        className="text-accent/60 transition-colors flex items-center gap-2"
      >
        <Github size={18} />
        GitHub
      </a>
      <a
        href="https://www.goodreads.com/user/show/71020611-specbug"
        target="_blank"
        rel="noopener noreferrer"
        className="text-accent/60 transition-colors flex items-center gap-2"
      >
        <BookOpen size={18} />
        Goodreads
      </a>
    </div>
  )
}

