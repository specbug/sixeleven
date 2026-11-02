import { BookIcon, GithubIcon, XIcon } from "./icons"

// Where else Rishit writes and reads: each mark beside its name, in the navigation style
const links = [
  { href: "https://x.com/irishvora", label: "X", Icon: XIcon },
  { href: "https://github.com/specbug", label: "GitHub", Icon: GithubIcon },
  { href: "https://www.goodreads.com/user/show/71020611-specbug", label: "Goodreads", Icon: BookIcon },
]

export default function SocialLinks() {
  return (
    <ul className="flex flex-wrap gap-x-6 gap-y-2 font-flex text-[0.875rem]">
      {links.map(({ href, label, Icon }) => (
        <li key={href}>
          <a href={href} target="_blank" rel="noopener noreferrer" className="nav-link inline-flex items-center gap-2">
            <Icon size={16} />
            {label}
          </a>
        </li>
      ))}
    </ul>
  )
}
