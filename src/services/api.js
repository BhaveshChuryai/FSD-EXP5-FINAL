import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request Interceptor: Attach JWT Bearer Token if present in localStorage
apiClient.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('ph_token')
      if (token && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`
      }
    } catch {
      // LocalStorage unavailable in SSR/restricted environments
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response Interceptor: Standardize error formatting
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // If backend returns a standardized error payload
    if (error.response?.data?.message) {
      error.userMessage = error.response.data.message
    } else if (error.code === 'ECONNABORTED') {
      error.userMessage = 'Request timed out. Please check your network connection.'
    } else if (!error.response) {
      error.userMessage = 'Unable to connect to the backend server. Please verify the API is running.'
    } else {
      error.userMessage = 'An unexpected error occurred. Please try again.'
    }
    return Promise.reject(error)
  }
)

/* ==========================================================================
   Modular API Services for FSD Experiments 4 & 5
   ========================================================================== */

export const propertiesAPI = {
  /**
   * Fetch published land inventory with optional query filters and pagination
   * @param {Object} params - { page, limit, location, type, minPrice, maxPrice, search, sort }
   */
  getAll: (params = {}) => apiClient.get('/properties', { params }),

  /**
   * Fetch single property by ObjectId or Slug
   */
  getById: (id) => apiClient.get(`/properties/${id}`),

  /**
   * Submit land listing (Public or authenticated)
   */
  create: (data) => apiClient.post('/properties', data),

  /**
   * Update property (Admin only)
   */
  update: (id, data) => apiClient.patch(`/properties/${id}`, data),

  /**
   * Delete property (Admin only)
   */
  delete: (id) => apiClient.delete(`/properties/${id}`),

  /**
   * Retrieve all listings including pending review (Admin only)
   */
  getAdminListings: () => apiClient.get('/properties/admin/all'),
}

export const leadsAPI = {
  /**
   * Submit buyer requirement enquiry
   */
  submit: (leadData) => apiClient.post('/leads', leadData),

  /**
   * Submit site visit enquiry for a specific property parcel
   */
  submitEnquiry: (enquiryData) => apiClient.post('/enquiries', enquiryData),

  /**
   * Retrieve all buyer leads (Admin only)
   */
  getAll: (params = {}) => apiClient.get('/leads', { params }),

  /**
   * Update lead status (Admin only)
   */
  updateStatus: (id, status) => apiClient.patch(`/leads/${id}`, { status }),
}

export const authAPI = {
  /**
   * Register new account
   */
  register: (credentials) => apiClient.post('/auth/register', credentials),

  /**
   * Authenticate with email and password
   */
  login: (credentials) => apiClient.post('/auth/login', credentials),

  /**
   * Get authenticated user profile
   */
  getMe: () => apiClient.get('/auth/me'),

  /**
   * Log out and clear session
   */
  logout: () => apiClient.post('/auth/logout'),
}

export const adminAPI = {
  /**
   * Retrieve operational metrics and admin dashboard overview
   */
  getDashboard: () => apiClient.get('/admin/dashboard'),
}

export const partnersAPI = {
  /**
   * Submit partner application
   */
  submit: (data) => apiClient.post('/partner-applications', data),

  /**
   * Retrieve all partner applications
   */
  getAll: () => apiClient.get('/partner-applications'),

  /**
   * Update partner application status
   */
  updateStatus: (id, status) => apiClient.patch(`/partner-applications/${id}`, { status }),
}

export const healthAPI = {
  /**
   * Check backend server and MongoDB status
   */
  check: () => apiClient.get('/health'),
}

export default apiClient
