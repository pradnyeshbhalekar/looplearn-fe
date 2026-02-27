// src/features/auth/authThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit"
import { api } from "../../api/axios"
import type { User } from "./auth.types"

interface GoogleLoginResponse {
  access_token: string
  user: User
}

export const googleLogin = createAsyncThunk<
  GoogleLoginResponse,
  string,
  { rejectValue: string }
>("auth/googleLogin", async (idToken, { rejectWithValue }) => {
  try {
    const res = await api.post(
      "/api/auth/google",
      { id_token: idToken }
    )
    return res.data
  } catch (err: unknown) {
    const error = err as { response?: { data?: { message?: string } } }
    return rejectWithValue(
      error.response?.data?.message || "Google login failed"
    )
  }
})