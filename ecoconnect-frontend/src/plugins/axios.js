
// src/plugins/axios.js
import axios from 'axios'

// Base URL
axios.defaults.baseURL = 'http://localhost:5000/api'

// Request interceptor
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// Response interceptor
axios.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config

    // If error is 401 and we haven't tried to refresh token yet
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refreshToken')
        const response = await axios.post('/auth/refresh', {}, {
          headers: { Authorization: `Bearer ${refreshToken}` }
        })

        localStorage.setItem('token', response.data.access_token)
        originalRequest.headers.Authorization = `Bearer ${response.data.access_token}`
        
        return axios(originalRequest)
      } catch (err) {
        // If refresh token fails, logout user
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
        window.location.href = '/login'
        return Promise.reject(error)
      }
    }

    return Promise.reject(error)
  }
)

export default axios