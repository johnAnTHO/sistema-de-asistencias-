// src/services/authService.js - ACTUALIZADO
import api from './api'

export const authService = {
  async login(credentials) {
    try {
      console.log('🚀 Enviando login...')
      
      const response = await api.post('/auth/login', credentials)
      
      console.log('📥 Respuesta del backend:', {
        success: response.data.success,
        hasToken: !!response.data.token,
        hasUser: !!response.data.user,
        userKeys: response.data.user ? Object.keys(response.data.user) : 'No user'
      })
      
      // 🎯 Verificar la estructura de la respuesta
      if (!response.data.success) {
        throw new Error(response.data.error || 'Login falló')
      }
      
      if (!response.data.token) {
        throw new Error('No se recibió token del servidor')
      }
      
      if (!response.data.user) {
        throw new Error('No se recibieron datos de usuario')
      }
      
      return response.data
      
    } catch (error) {
      console.error('❌ Error en authService.login:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      })
      
      let errorMessage = 'Error de conexión'
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      }
      
      throw new Error(errorMessage)
    }
  },

  async verifyToken() {
    try {
      const response = await api.get('/auth/verify')
      return response.data
    } catch (error) {
      throw new Error('Token inválido')
    }
  },

  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }
}