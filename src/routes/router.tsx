// src/routes/router.tsx
import { createBrowserRouter } from "react-router-dom"
import Home from "../pages/Home"
import Login from "../pages/Login"
import AuthCallback from "../pages/AuthCallback"
import Dashboard from "../pages/Dashboard"
import AuthGuard from "../features/auth/AuthGuard"
import LoginGuard from "../features/auth/LoginGuard"
import { Todays } from "../pages/Todays"
import { Admin } from '../pages/Admin'
import AdminRoute from '../features/auth/AdminRoute'
import Pricing from "../pages/Pricing"
import SubscriptionSuccess from "../pages/SubscriptionSuccess"

export const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/pricing", element: <Pricing /> },
  { path: "/subscription/success", element: <SubscriptionSuccess /> },
  {
    path: "/login",
    element: (
      <LoginGuard>
        <Login />
      </LoginGuard>
    ),
  },
  { path: "/auth/callback", element: <AuthCallback /> },
  {
    path: "/dashboard",
    element: (
      <AuthGuard>
        <Dashboard />
      </AuthGuard>
    ),
  },
  {
    path: "/todays",
    element: (
      <AuthGuard>
        <Todays />
      </AuthGuard>
    )
  },
  {
    path: "/admin", element: (
      <AuthGuard>
        <AdminRoute>
          <Admin />
        </AdminRoute>
      </AuthGuard>
    )
  }
])
