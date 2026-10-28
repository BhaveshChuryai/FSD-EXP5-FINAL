import { createSlice } from '@reduxjs/toolkit'

const loadSavedFromStorage = () => {
  try {
    const raw = localStorage.getItem('ph_saved_props_data')
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

const loadComparedFromStorage = () => {
  try {
    const raw = localStorage.getItem('ph_compared_props')
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

const initialState = {
  properties: [],
  featured: [],
  current: null,
  savedProperties: loadSavedFromStorage(),
  comparedProperties: loadComparedFromStorage(),
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
    
    // Saved properties management
    toggleSaveProperty(state, action) {
      const prop = action.payload
      if (!prop || !prop.id) return
      const exists = state.savedProperties.some(p => p.id === prop.id)
      if (exists) {
        state.savedProperties = state.savedProperties.filter(p => p.id !== prop.id)
      } else {
        state.savedProperties.push({
          id: prop.id,
          title: prop.title,
          location: prop.location,
          type: prop.type || prop.propertyType,
          price: prop.price,
          area: prop.area,
          unit: prop.unit || prop.areaUnit,
          image: prop.image || (prop.images && prop.images[0]) || '/assets/property-agri.jpg',
          description: prop.description || '',
          infra: prop.infra || prop.infrastructure || [],
          docStatus: prop.docStatus || prop.satbaraStatus || '7/12 Verified',
        })
      }
      try {
        localStorage.setItem('ph_saved_props_data', JSON.stringify(state.savedProperties))
        localStorage.setItem('ph_saved_props', JSON.stringify(state.savedProperties.map(p => p.id)))
      } catch {
        // storage quota safety
      }
    },
    removeSavedProperty(state, action) {
      const id = action.payload
      state.savedProperties = state.savedProperties.filter(p => p.id !== id)
      try {
        localStorage.setItem('ph_saved_props_data', JSON.stringify(state.savedProperties))
        localStorage.setItem('ph_saved_props', JSON.stringify(state.savedProperties.map(p => p.id)))
      } catch {
        // storage quota safety
      }
    },

    // Comparison management (up to 3 parcels)
    toggleCompareProperty(state, action) {
      const prop = action.payload
      if (!prop || !prop.id) return
      const exists = state.comparedProperties.some(p => p.id === prop.id)
      if (exists) {
        state.comparedProperties = state.comparedProperties.filter(p => p.id !== prop.id)
      } else {
        if (state.comparedProperties.length >= 3) {
          state.comparedProperties.shift() // Keep max 3 parcels
        }
        state.comparedProperties.push({
          id: prop.id,
          title: prop.title,
          location: prop.location,
          type: prop.type || prop.propertyType,
          price: prop.price,
          priceAmount: prop.priceAmount || prop.minPriceLakh || 0,
          area: prop.area,
          unit: prop.unit || prop.areaUnit,
          image: prop.image || (prop.images && prop.images[0]) || '/assets/property-agri.jpg',
          infra: prop.infra || prop.infrastructure || [],
          docStatus: prop.docStatus || prop.satbaraStatus || '7/12 Extract Available',
          zone: prop.zone || 'Zone Specified',
        })
      }
      try {
        localStorage.setItem('ph_compared_props', JSON.stringify(state.comparedProperties))
      } catch {
        // storage quota safety
      }
    },
    removeFromComparison(state, action) {
      state.comparedProperties = state.comparedProperties.filter(p => p.id !== action.payload)
      try {
        localStorage.setItem('ph_compared_props', JSON.stringify(state.comparedProperties))
      } catch {
        // storage quota safety
      }
    },
    clearComparison(state) {
      state.comparedProperties = []
      try {
        localStorage.removeItem('ph_compared_props')
      } catch {
        // storage quota safety
      }
    },
  },
})

export const {
  setProperties, setFeatured, setCurrentProperty,
  setFilters, resetFilters, setPagination, setLoading, setError,
  toggleSaveProperty, removeSavedProperty,
  toggleCompareProperty, removeFromComparison, clearComparison,
} = propertySlice.actions
export default propertySlice.reducer
