// src/pages/AuthCallback.tsx
import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useAppSelector } from "../app/hook"
import { Loader2 } from "lucide-react"

const AuthCallback = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { isAuthenticated } = useAppSelector((s) => s.auth)

  useEffect(() => {
    // If we have a token in URL params (from server-side OAuth redirect)
    const token = searchParams.get("token")
    if (token) {
      localStorage.setItem("token", token)
      navigate("/dashboard")
      return
    }

    // If already authenticated, go to dashboard
    if (isAuthenticated) {
      navigate("/dashboard")
      return
    }

    // Otherwise redirect back to login
    navigate("/login")
  }, [isAuthenticated, navigate, searchParams])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      <p className="text-gray-500 dark:text-gray-400 font-medium">Authenticating...</p>
    </div>
  )
}

export default AuthCallback
