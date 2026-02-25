// src/pages/AuthCallback.tsx
import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useAppSelector } from "../app/hook"

const AuthCallback = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { isAuthenticated } = useAppSelector((s) => s.auth)

  useEffect(() => {
    // If we have a token in URL params (from server-side OAuth redirect)
    const token = searchParams.get("token")
    if (token) {
      localStorage.setItem("token", token)
      navigate("/todays")
      return
    }

    // If already authenticated, go to dashboard
    if (isAuthenticated) {
      navigate("/todays")
      return
    }

    // Otherwise redirect back to login
    navigate("/login")
  }, [isAuthenticated, navigate, searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500 dark:text-gray-400">Redirecting...</p>
    </div>
  )
}

export default AuthCallback
