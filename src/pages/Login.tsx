import { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../app/hook"
import { googleLogin } from "../features/auth/authThunks"
import { useTheme } from "../context/ThemeContext"
import { motion, AnimatePresence } from "framer-motion"
import { Moon, Sun, ShieldCheck } from "lucide-react"
import Logo from "../components/Logo"

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
    if (isAuthenticated) navigate("/dashboard")
  }, [isAuthenticated, navigate])

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
        if (window.google?.accounts?.id) { tryInit(); clearInterval(interval) }
      }, 100)
      return () => clearInterval(interval)
    }
  }, [dispatch])

  useEffect(() => {
    if (scriptReady && window.google?.accounts?.id) {
      window.google.accounts.id.renderButton(
        document.getElementById("google-btn"),
        { theme: theme === "dark" ? "filled_black" : "outline", size: "large", width: 320 }
      )
    }
  }, [scriptReady, theme])

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden transition-colors duration-500">
      
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle at 1px 1px, black 1px, transparent 0)", backgroundSize: "40px 40px" }}
      />

      {/* Header / Nav Area */}
      <div className="absolute top-8 left-8 right-8 flex items-center justify-between z-10">
        <Logo className="scale-110" />
        <button
          onClick={toggleTheme}
          className="w-10 h-10 flex items-center justify-center rounded-2xl bg-gray-50 dark:bg-zinc-900/50 border border-gray-100 dark:border-white/5 hover:bg-gray-100 dark:hover:bg-zinc-900 transition-all shadow-sm"
          aria-label="Toggle theme"
        >
          {theme === "dark"
            ? <Sun size={18} className="text-yellow-400" />
            : <Moon size={18} className="text-blue-500" />
          }
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm relative z-10"
      >
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-black tracking-tight text-black dark:text-white mb-3">Welcome back.</h1>
          <p className="text-gray-400 dark:text-gray-500 text-sm font-medium">Continue your engineering journey with signal over noise.</p>
        </div>

        <div className="bg-white dark:bg-zinc-900/40 border border-gray-100 dark:border-white/5 rounded-[2.5rem] p-9 sm:p-12 shadow-2xl shadow-black/5 dark:shadow-none backdrop-blur-md">
          
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="mb-8 p-4 rounded-2xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 text-xs text-red-600 dark:text-red-400 text-center font-bold"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-col items-center gap-6">
            <div
              id="google-btn"
              className={`transition-all duration-700 w-full flex justify-center scale-105 ${!scriptReady ? "opacity-0 h-0" : "opacity-100"}`}
            />
            {!scriptReady && (
              <div className="flex items-center gap-3 py-4">
                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-gray-400 font-bold uppercase tracking-widest text-[10px]">Establishing Secure Loop…</span>
              </div>
            )}
          </div>

          <div className="mt-10 pt-8 border-t border-gray-50 dark:border-white/5">
            <div className="flex items-center justify-center gap-3 text-gray-300 dark:text-gray-600">
              <ShieldCheck size={14} />
              <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Encrypted Connection</span>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-4">
          <Link
            to="/"
            className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-400 hover:text-black dark:hover:text-white transition-all no-underline"
          >
            ← Back to Home
          </Link>
          <p className="max-w-[280px] text-center text-[10px] text-gray-400 dark:text-gray-600 leading-relaxed uppercase tracking-wider">
            By signing in, you agree to our <a href="#" className="underline dark:text-gray-500">Terms</a> & <a href="#" className="underline dark:text-gray-500">Privacy</a>.
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default Login
