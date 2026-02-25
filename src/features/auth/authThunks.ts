// src/features/auth/authThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
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
    const res = await axios.post(
      import.meta.env.VITE_API_BASE_URL + "/api/auth/google",
      { id_token: idToken }
    )
    return res.data
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Google login failed"
    )
  }
})