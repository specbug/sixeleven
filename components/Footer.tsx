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
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-400 hover:text-accent/60 dark:hover:text-accent/60"
            >
              GitHub
            </a>
            <a
              href="mailto:example@example.com"
              className="text-gray-600 dark:text-gray-400 hover:text-accent/60 dark:hover:text-accent/60"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

