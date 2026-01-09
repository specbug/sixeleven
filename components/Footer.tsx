// Minimal, geometric icons inspired by Braun/Rams design
function GithubIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" />
    </svg>
  )
}

function XIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  )
}

function MailIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="4" width="20" height="16" rx="0" />
      <path d="M22 6L12 13 2 6" />
    </svg>
  )
}

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="py-8 border-t border-[var(--border)]">
      <div className="max-w-[680px] mx-auto px-6 md:px-0">
        <div className="flex justify-between items-center">
          {/* Copyright - lowercase */}
          <p className="text-sm text-[var(--foreground-muted)] lowercase">
            {currentYear} sixeleven
          </p>

          {/* Social icons - orange on hover */}
          <div className="flex items-center space-x-6">
            <a
              href="https://github.com/specbug"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--foreground-muted)] hover:text-[var(--braun-orange)] transition-colors"
              aria-label="GitHub"
            >
              <GithubIcon size={18} />
            </a>
            <a
              href="https://x.com/irishvora"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--foreground-muted)] hover:text-[var(--braun-orange)] transition-colors"
              aria-label="X"
            >
              <XIcon size={18} />
            </a>
            <a
              href="mailto:rishitv@proton.me"
              className="text-[var(--foreground-muted)] hover:text-[var(--braun-orange)] transition-colors"
              aria-label="Email"
            >
              <MailIcon size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
