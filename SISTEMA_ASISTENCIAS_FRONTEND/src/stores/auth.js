// src/stores/auth.js - Asegúrate que isAdmin use user.es_admin
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '../services/authService'
import axios from 'axios'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('user')) || null)
  const token = ref(localStorage.getItem('token') || null)
  
  // 🎯 Computed CORREGIDOS
  const isAuthenticated = computed(() => {
    const auth = !!token.value
    console.log('🔐 isAuthenticated computed:', auth)
    return auth
  })
  
  const isAdmin = computed(() => {
    // Usa user.value?.es_admin que ahora será boolean
    const admin = user.value?.es_admin === true
    console.log('👑 isAdmin computed:', admin, '- Valor es_admin:', user.value?.es_admin)
    return admin
  })
  
  const userName = computed(() => {
    return user.value ? `${user.value.nombres} ${user.value.apellidos}` : ''
  })

  const login = async (credentials) => {
    try {
      console.log('🔐 STORE: Iniciando login...')
      const data = await authService.login(credentials)
      
      console.log('📦 STORE: Datos recibidos del backend:', {
        success: data.success,
        hasToken: !!data.token,
        hasUser: !!data.user,
        userEsAdmin: data.user?.es_admin,
        userEsAdminType: typeof data.user?.es_admin
      })
      
      if (data.success && data.token && data.user) {
        // CRÍTICO: Verificar que es_admin sea boolean
        if (typeof data.user.es_admin !== 'boolean') {
          console.warn('⚠️ es_admin no es boolean, forzando conversión')
          data.user.es_admin = data.user.es_admin === true || data.user.es_admin === 'true'
        }
        
        // Actualizar estado
        token.value = data.token
        user.value = data.user
        
        // Guardar en localStorage
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        
        // Configurar axios
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
        
        console.log('✅ STORE: Login completado - Estado actual:')
        console.log('- token:', !!token.value)
        console.log('- user:', user.value)
        console.log('- isAuthenticated:', isAuthenticated.value)
        console.log('- isAdmin:', isAdmin.value)
        
        return data
      } else {
        throw new Error('Respuesta inválida del servidor')
      }
      
    } catch (error) {
      console.error('❌ STORE: Error en login:', error)
      logout()
      throw error
    }
  }

  // ... resto del código (verifyAuth, logout, initialize) igual
  const logout = () => {
    console.log('🔓 Logout ejecutado')
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    delete axios.defaults.headers.common['Authorization']
  }

  const verifyAuth = async () => {
    try {
      const data = await authService.verifyToken()
      if (data.valid) {
        user.value = data.user
        return data
      }
    } catch (error) {
      logout()
      throw error
    }
  }

  const initialize = () => {
    if (token.value) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
    }
  }

  initialize()

  return {
    user,
    token,
    isAuthenticated,
    isAdmin,
    userName,
    login,
    verifyAuth,
    logout
  }
})