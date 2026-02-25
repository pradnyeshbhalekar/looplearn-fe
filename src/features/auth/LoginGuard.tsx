import React from "react"
import { Navigate } from "react-router-dom"
import { useAppSelector } from "../../app/hook"

const LoginGuard = ({ children }: { children: React.ReactNode }) => {
  const isAuth = useAppSelector((state) => state.auth.isAuthenticated)
  return isAuth ? <Navigate to="/todays" /> : children
}

export default LoginGuard
