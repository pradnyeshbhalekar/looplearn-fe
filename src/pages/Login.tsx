import { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../app/hook"
import { googleLogin } from "../features/auth/authThunks"
import Logo from "../components/Logo"
import { useTheme } from "../context/ThemeContext"
import { motion, AnimatePresence } from "framer-motion"
import { Zap, ShieldCheck } from "lucide-react"

declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: { client_id: string; callback: (response: { credential: string }) => void }) => void
          renderButton: (element: HTMLElement | null, options: { theme: string; size: string; width: number }) => void
        }
      }
    }
  }
}

const Login = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { isAuthenticated, error } = useAppSelector((s) => s.auth)
  const { theme, toggleTheme } = useTheme()
  const [scriptReady, setScriptReady] = useState(false)
  const isInitialized = useRef(false)

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard")
    }
  }, [isAuthenticated, navigate])

  // Initialize Google SDK only once
  useEffect(() => {
    const tryInit = () => {
      if (window.google?.accounts?.id && !isInitialized.current) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: (response: { credential: string }) => {
            dispatch(googleLogin(response.credential))
          },
        })
        isInitialized.current = true
        setScriptReady(true)
      }
    }

    if (window.google?.accounts?.id) {
      tryInit()
    } else {
      const interval = setInterval(() => {
        if (window.google?.accounts?.id) {
          tryInit()
          clearInterval(interval)
        }
      }, 100)
      return () => clearInterval(interval)
    }
  }, [dispatch])

  // Re-render button when theme changes or script becomes ready
  useEffect(() => {
    if (scriptReady && window.google?.accounts?.id) {
      window.google.accounts.id.renderButton(
        document.getElementById("google-btn"),
        { 
          theme: theme === "dark" ? "filled_black" : "outline", 
          size: "large", 
          width: 320
        }
      )
    }
  }, [scriptReady, theme])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0a0a0a] px-6">
      <div className="absolute top-8 right-8">
        <button
          onClick={toggleTheme}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-[#181818] transition-all"
        >
          {theme === "dark" ? <Zap size={18} className="text-yellow-400" /> : <ShieldCheck size={18} className="text-blue-600" />}
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-10">
          <Logo className="text-4xl mb-6 inline-block" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Welcome back</h1>
          <p className="text-gray-500 dark:text-gray-400">Continue your learning journey</p>
        </div>

        <div className="bg-white dark:bg-[#111] p-8 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 text-xs text-red-600 dark:text-red-400 text-center"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-col items-center gap-6">
            <div
              id="google-btn"
              className={`transition-opacity duration-500 ${!scriptReady ? "opacity-0" : "opacity-100"}`}
            />
            
            {!scriptReady && (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs text-gray-400 font-medium">Preparing secure login...</span>
              </div>
            )}
          </div>

          <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800">
            <p className="text-[10px] text-center text-gray-400 dark:text-gray-500 leading-relaxed uppercase tracking-widest font-bold">
              Secure, Encrypted Login
            </p>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-gray-400 dark:text-gray-500">
          By continuing, you agree to our <br />
          <a href="#" className="font-bold text-gray-600 dark:text-gray-300 hover:underline">Terms of Service</a> and <a href="#" className="font-bold text-gray-600 dark:text-gray-300 hover:underline">Privacy Policy</a>.
        </p>
      </motion.div>
    </div>
  )
}

export default Login
