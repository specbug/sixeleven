import type { ReactNode } from "react"

// Line icons on a 20×20 grid: 1.5px stroke, rounded caps and joins, no fills.
function Icon({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {children}
    </svg>
  )
}

export const SunIcon = () => (
  <Icon>
    <circle cx="10" cy="10" r="3.25" />
    <path d="M10 2.5v1.5M10 16v1.5M2.5 10H4M16 10h1.5M4.7 4.7l1.06 1.06M14.24 14.24l1.06 1.06M4.7 15.3l1.06-1.06M14.24 5.76l1.06-1.06" />
  </Icon>
)

export const MoonIcon = () => (
  <Icon>
    <path d="M16.5 11.6A6.75 6.75 0 1 1 8.4 3.5a5.25 5.25 0 0 0 8.1 8.1z" />
  </Icon>
)

export const MenuIcon = () => (
  <Icon>
    <path d="M3.5 6h13M3.5 10h13M3.5 14h13" />
  </Icon>
)

export const CloseIcon = () => (
  <Icon>
    <path d="M5 5l10 10M15 5L5 15" />
  </Icon>
)

export const SearchIcon = () => (
  <Icon>
    <circle cx="9" cy="9" r="5.25" />
    <path d="M13 13l3.5 3.5" />
  </Icon>
)

export const ChevronIcon = ({ open = false }: { open?: boolean }) => (
  <Icon className={`transition-transform duration-200 ${open ? "rotate-90" : ""}`}>
    <path d="M8 5.5l4.5 4.5L8 14.5" />
  </Icon>
)
