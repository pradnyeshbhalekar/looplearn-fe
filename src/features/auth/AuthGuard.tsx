// src/features/auth/AuthGuard.tsx
import React from "react"
import { Navigate } from "react-router-dom"
import { useAppSelector } from "../../app/hook"

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const isAuth = useAppSelector((state) => state.auth.isAuthenticated)
  return isAuth ? children : <Navigate to="/login" />
}

export default AuthGuard