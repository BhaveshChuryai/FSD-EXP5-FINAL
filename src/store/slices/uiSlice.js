import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  mobileMenuOpen: false,
  authModalOpen: false,
  authModalMode: 'login', // 'login' | 'register'
  scrolled: false,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setMobileMenuOpen(state, action) { state.mobileMenuOpen = action.payload },
    toggleMobileMenu(state) { state.mobileMenuOpen = !state.mobileMenuOpen },
    setAuthModalOpen(state, action) {
      state.authModalOpen = action.payload.open
      if (action.payload.mode) state.authModalMode = action.payload.mode
    },
    setAuthModalMode(state, action) { state.authModalMode = action.payload },
    setScrolled(state, action) { state.scrolled = action.payload },
  },
})

export const {
  setMobileMenuOpen, toggleMobileMenu,
  setAuthModalOpen, setAuthModalMode, setScrolled,
} = uiSlice.actions
export default uiSlice.reducer
