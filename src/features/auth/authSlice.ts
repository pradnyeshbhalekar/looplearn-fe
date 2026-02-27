import { createSlice } from "@reduxjs/toolkit"
import type { AuthState } from "./auth.types"
import { googleLogin } from "./authThunks"

const token = localStorage.getItem("token")

const initialState: AuthState = {
  user: null,
  token: token,
  loading: false,
  error: null,
  isAuthenticated: !!token
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      localStorage.removeItem("token")
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(googleLogin.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.loading = false
        state.token = action.payload.access_token
        state.user = action.payload.user
        state.isAuthenticated = true
        localStorage.setItem("token", action.payload.access_token)
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Google login failed"
      })
  }
})

export const { logout } = authSlice.actions
export default authSlice.reducer