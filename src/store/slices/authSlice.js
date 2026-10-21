import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authAPI } from '../../services/api'

const getStoredToken = () => {
  try {
    return localStorage.getItem('ph_token') || null
  } catch {
    return null
  }
}

const getStoredUser = () => {
  try {
    const raw = localStorage.getItem('ph_user')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const res = await authAPI.getMe()
      return res.data.user
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Session expired')
    }
  }
)

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { dispatch }) => {
    try {
      await authAPI.logout()
    } catch {
      // Best effort backend cookie clearing
    } finally {
      dispatch(authSlice.actions.logout())
    }
  }
)

const initialToken = getStoredToken()
const initialUser = getStoredUser()

const initialState = {
  user: initialUser,
  token: initialToken,
  isAuthenticated: !!initialToken,
  loading: false,
  sessionRestoring: !!initialToken,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload
    },
    setUser(state, action) {
      state.user = action.payload
      state.isAuthenticated = !!action.payload
      try {
        if (action.payload) {
          localStorage.setItem('ph_user', JSON.stringify(action.payload))
        } else {
          localStorage.removeItem('ph_user')
        }
      } catch {
        // Storage unavailable
      }
    },
    setToken(state, action) {
      state.token = action.payload
      state.isAuthenticated = !!action.payload
      try {
        if (action.payload) {
          localStorage.setItem('ph_token', action.payload)
        } else {
          localStorage.removeItem('ph_token')
        }
      } catch {
        // Storage unavailable
      }
    },
    setError(state, action) {
      state.error = action.payload
    },
    logout(state) {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.error = null
      state.sessionRestoring = false
      try {
        localStorage.removeItem('ph_token')
        localStorage.removeItem('ph_user')
      } catch {
        // Storage unavailable
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.sessionRestoring = true
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload
        state.isAuthenticated = true
        state.sessionRestoring = false
        try {
          localStorage.setItem('ph_user', JSON.stringify(action.payload))
        } catch {
          // Storage unavailable
        }
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        // Token was invalid or expired: clear session
        state.user = null
        state.token = null
        state.isAuthenticated = false
        state.sessionRestoring = false
        try {
          localStorage.removeItem('ph_token')
          localStorage.removeItem('ph_user')
        } catch {
          // Storage unavailable
        }
      })
  },
})

export const { setLoading, setUser, setToken, setError, logout } = authSlice.actions
export default authSlice.reducer
