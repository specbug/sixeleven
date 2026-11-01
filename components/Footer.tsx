// Year, wordmark and three ways to reach Rishit. Words, not brand glyphs: the brands have
// no line icons that match the site's.
const links = [
  { href: "https://github.com/specbug", label: "GitHub" },
  { href: "https://x.com/irishvora", label: "X" },
  { href: "mailto:rishitv@proton.me", label: "Email" },
]

export default function Footer() {
  return (
    <footer className="py-8 border-t border-[var(--rule)]">
      <div className="max-w-[640px] mx-auto px-6 md:px-0 flex justify-between items-baseline meta">
        <p>{new Date().getFullYear()} sixeleven</p>
        <ul className="flex gap-6">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="nav-link"
                {...(link.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}
