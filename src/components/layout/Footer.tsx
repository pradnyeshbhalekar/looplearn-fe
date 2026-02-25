import Logo from "../Logo"

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#0a0a0a]">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <Logo className="text-lg" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              One topic. Every day. No overwhelm.
            </p>
          </div>

          <div className="flex gap-8 text-sm text-gray-500 dark:text-gray-400">
            <a href="#why" className="hover:text-primary no-underline">
              Why
            </a>
            <a href="#who" className="hover:text-primary no-underline">
              Who
            </a>
            <a href="#how" className="hover:text-primary no-underline">
              How
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800 text-center text-xs text-gray-400 dark:text-gray-500">
          © {new Date().getFullYear()} LoopLearn. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default Footer
