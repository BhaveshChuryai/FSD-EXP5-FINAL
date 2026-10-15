import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
  token: localStorage.getItem('ph_token') || null,
  isAuthenticated: !!localStorage.getItem('ph_token'),
  loading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading(state, action) { state.loading = action.payload },
    setUser(state, action) {
      state.user = action.payload
      state.isAuthenticated = !!action.payload
    },
    setToken(state, action) {
      state.token = action.payload
      if (action.payload) {
        localStorage.setItem('ph_token', action.payload)
      } else {
        localStorage.removeItem('ph_token')
      }
    },
    setError(state, action) { state.error = action.payload },
    logout(state) {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.error = null
      localStorage.removeItem('ph_token')
    },
  },
})

export const { setLoading, setUser, setToken, setError, logout } = authSlice.actions
export default authSlice.reducer
