export default function SocialLinks() {
  return (
    <div className="my-8 flex flex-wrap gap-x-6 gap-y-2 text-lg">
      <a
        href="https://twitter.com/yourusername"
        target="_blank"
        rel="noopener noreferrer"
        className="text-accent/60 border-b border-accent/20 hover:border-accent/60 transition-colors"
      >
        Twitter
      </a>
      <a
        href="https://github.com/yourusername"
        target="_blank"
        rel="noopener noreferrer"
        className="text-accent/60 border-b border-accent/20 hover:border-accent/60 transition-colors"
      >
        GitHub
      </a>
      <a
        href="https://goodreads.com/yourusername"
        target="_blank"
        rel="noopener noreferrer"
        className="text-accent/60 border-b border-accent/20 hover:border-accent/60 transition-colors"
      >
        Goodreads
      </a>
      <a
        href="mailto:your.email@example.com"
        className="text-accent/60 border-b border-accent/20 hover:border-accent/60 transition-colors"
      >
        Email
      </a>
      <a
        href="/pgp-key.txt"
        target="_blank"
        rel="noopener noreferrer"
        className="text-accent/60 border-b border-accent/20 hover:border-accent/60 transition-colors"
      >
        PGP Key
      </a>
    </div>
  )
}

