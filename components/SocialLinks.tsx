import SpecialCode from "@/components/SpecialCode"

export default function SocialLinks() {
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-2 text-lg">
      <a
        href="https://twitter.com/irishvora"
        target="_blank"
        rel="noopener noreferrer"
        className="text-accent/60 transition-colors"
      >
        Twitter
      </a>
      <a
        href="https://github.com/specbug"
        target="_blank"
        rel="noopener noreferrer"
        className="text-accent/60 transition-colors"
      >
        GitHub
      </a>
      <a
        href="https://www.goodreads.com/user/show/71020611-specbug"
        target="_blank"
        rel="noopener noreferrer"
        className="text-accent/60 transition-colors"
      >
        Goodreads
      </a>
      <SpecialCode />
    </div>
  )
}

