// components/auth/GoogleLoginButton.tsx
const GoogleLoginButton = () => {
  const handleLogin = () => {
    window.location.href =
      import.meta.env.VITE_API_BASE_URL + "/api/auth/google/login"
  }

  return <button onClick={handleLogin}>Continue with Google</button>
}

export default GoogleLoginButton