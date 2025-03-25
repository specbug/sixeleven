import { Github, Mail } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="py-6 sm:py-8 border-t border-gray-200 dark:border-gray-800">
      <div className="px-3 sm:px-6 md:px-8 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0 text-center md:text-left">
            <p className="text-gray-600 dark:text-gray-400">© {currentYear} sixeleven</p>
          </div>
          <div className="flex space-x-6 sm:space-x-8">
            <a
              href="https://github.com/specbug"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-400 hover:text-accent/60 dark:hover:text-accent/60"
              aria-label="GitHub"
            >
              <Github size={20} />
            </a>
            <a
              href="https://x.com/irishvora"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-400 hover:text-accent/60 dark:hover:text-accent/60"
              aria-label="X"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z"
                  fill="currentColor"
                />
              </svg>
            </a>
            <a
              href="mailto:rishitv@proton.me"
              className="text-gray-600 dark:text-gray-400 hover:text-accent/60 dark:hover:text-accent/60"
              aria-label="Email"
            >
              <Mail size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
