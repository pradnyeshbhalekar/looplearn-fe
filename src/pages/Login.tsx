import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../app/hook"
import { googleLogin } from "../features/auth/authThunks"
import Logo from "../components/Logo"
import { useTheme } from "../context/ThemeContext"

declare global {
  interface Window {
    google: any
  }
}

const Login = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { isAuthenticated, loading, error } = useAppSelector((s) => s.auth)
  const { theme, toggleTheme } = useTheme()
  const [scriptReady, setScriptReady] = useState(false)

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/todays")
    }
  }, [isAuthenticated, navigate])

  // Wait for Google Identity Services script to load
  useEffect(() => {
    const initGoogle = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: (response: any) => {
            dispatch(googleLogin(response.credential))
          },
        })
        window.google.accounts.id.renderButton(
          document.getElementById("google-btn"),
          { theme: theme === "dark" ? "filled_black" : "outline", size: "large", width: 320 }
        )
        setScriptReady(true)
      }
    }

    // Try immediately in case script already loaded
    if (window.google?.accounts?.id) {
      initGoogle()
      return
    }

    // Otherwise poll until it's ready
    const interval = setInterval(() => {
      if (window.google?.accounts?.id) {
        initGoogle()
        clearInterval(interval)
      }
    }, 100)

    return () => clearInterval(interval)
  }, [dispatch, theme])

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#050505] px-6">
      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="fixed top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border-0 cursor-pointer z-50"
        aria-label="Toggle theme"
      >
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

      <div className="w-full max-w-sm text-center">
        <Logo className="text-3xl mb-2 inline-block" />
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
          Sign in to start your daily learning loop
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {loading && (
          <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
            Signing in...
          </div>
        )}

        <div className="flex justify-center">
          <div
            id="google-btn"
            className={!scriptReady ? "opacity-0" : "opacity-100"}
          />
        </div>

        {!scriptReady && (
          <div className="text-sm text-gray-400 dark:text-gray-500 mt-4">
            Loading...
          </div>
        )}

        <p className="mt-8 text-xs text-gray-400 dark:text-gray-500">
          By signing in, you agree to our Terms of Service.
        </p>
      </div>
    </div>
  )
}

export default Login
