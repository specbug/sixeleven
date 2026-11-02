import { GithubIcon, MailIcon, XIcon } from "./icons"

// Year, wordmark, and three ways to reach Rishit as marks, named for screen readers
const links = [
  { href: "https://github.com/specbug", label: "GitHub", Icon: GithubIcon },
  { href: "https://x.com/irishvora", label: "X", Icon: XIcon },
  { href: "mailto:rishitv@proton.me", label: "Email", Icon: MailIcon },
]

export default function Footer() {
  return (
    <footer className="py-8 border-t border-[var(--rule)]">
      <div className="max-w-[640px] mx-auto px-6 md:px-0 flex justify-between items-center meta">
        <p>{new Date().getFullYear()} sixeleven</p>
        <ul className="flex items-center gap-6">
          {links.map(({ href, label, Icon }) => (
            <li key={href} className="flex">
              <a
                href={href}
                aria-label={label}
                title={label}
                className="nav-link flex"
                {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                <Icon size={18} />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}
