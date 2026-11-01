// Where else Rishit writes and reads. Words, in the navigation style.
const links = [
  { href: "https://x.com/irishvora", label: "X" },
  { href: "https://github.com/specbug", label: "GitHub" },
  { href: "https://www.goodreads.com/user/show/71020611-specbug", label: "Goodreads" },
]

export default function SocialLinks() {
  return (
    <ul className="flex flex-wrap gap-x-6 gap-y-2 font-flex text-[0.875rem]">
      {links.map((link) => (
        <li key={link.href}>
          <a href={link.href} target="_blank" rel="noopener noreferrer" className="nav-link">
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  )
}
