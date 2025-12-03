// src/services/api.js - VERSIÓN CORREGIDA
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor para agregar token automáticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') // ← Cambié 'authToken' a 'token'
    console.log('🔑 Token encontrado para request:', !!token)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      console.log('✅ Token añadido a headers')
    }
    return config
  },
  (error) => {
    console.error('❌ Error en request interceptor:', error)
    return Promise.reject(error)
  }
)

// Interceptor para manejar errores globalmente
api.interceptors.response.use(
  (response) => {
    console.log('📥 Response recibido:', response.config.url)
    return response
  },
  (error) => {
    console.error('❌ Error en response:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message
    })
    
    if (error.response?.status === 401) {
      console.log('🔐 Token expirado, limpiando localStorage')
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      // No redirigir automáticamente, dejar que el store maneje
    }
    return Promise.reject(error)
  }
)

export default api