import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  properties: [],
  featured: [],
  current: null,
  filters: {
    search: '',
    location: '',
    type: '',
    minPrice: '',
    maxPrice: '',
    minArea: '',
    maxArea: '',
    sort: 'newest',
  },
  pagination: { page: 1, total: 0, pages: 0 },
  loading: false,
  error: null,
}

const propertySlice = createSlice({
  name: 'properties',
  initialState,
  reducers: {
    setProperties(state, action) { state.properties = action.payload },
    setFeatured(state, action) { state.featured = action.payload },
    setCurrentProperty(state, action) { state.current = action.payload },
    setFilters(state, action) { state.filters = { ...state.filters, ...action.payload } },
    resetFilters(state) { state.filters = initialState.filters },
    setPagination(state, action) { state.pagination = action.payload },
    setLoading(state, action) { state.loading = action.payload },
    setError(state, action) { state.error = action.payload },
  },
})

export const {
  setProperties, setFeatured, setCurrentProperty,
  setFilters, resetFilters, setPagination, setLoading, setError,
} = propertySlice.actions
export default propertySlice.reducer
