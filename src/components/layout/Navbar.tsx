import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import Logo from "../Logo"
import { useTheme } from "../../context/ThemeContext"

const Navbar = () => {
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    setIsAuthenticated(!!token)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    setIsAuthenticated(false)
    navigate("/login")
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/80 dark:bg-[#050505]/80 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Logo className="text-xl" />

        {/* Center navigation */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600 dark:text-gray-300">
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

        {/* Right actions */}
        <div className="flex items-center gap-6">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="relative w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border-0 cursor-pointer"
            aria-label="Toggle theme"
          >
            {/* Sun */}
            <svg
              className={`w-5 h-5 absolute transition-all duration-500 ${
                theme === "dark"
                  ? "opacity-0 rotate-90 scale-0"
                  : "opacity-100 rotate-0 scale-100"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <circle cx="12" cy="12" r="5" />
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>

            {/* Moon */}
            <svg
              className={`w-5 h-5 absolute transition-all duration-500 ${
                theme === "dark"
                  ? "opacity-100 rotate-0 scale-100"
                  : "opacity-0 -rotate-90 scale-0"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          </button>

          {/* Auth action */}
          {!isAuthenticated ? (
            <Link
              to="/login"
              className="px-5 py-2 text-sm font-medium rounded-lg bg-primary text-white hover:bg-blue-700 no-underline"
            >
              Login
            </Link>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                to="/todays"
                className="text-sm font-medium text-secondary dark:text-white hover:text-primary no-underline"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar