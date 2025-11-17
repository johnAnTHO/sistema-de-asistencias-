<template>
  <div class="p-6 max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold text-blue-600 mb-6">🔧 DEBUG - Estado de Autenticación</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div class="bg-white p-4 rounded-lg shadow-md border">
        <h2 class="font-semibold mb-3">Estado del Store</h2>
        <pre class="text-sm bg-gray-100 p-2 rounded overflow-auto max-h-60">{{ storeState }}</pre>
      </div>
      
      <div class="bg-white p-4 rounded-lg shadow-md border">
        <h2 class="font-semibold mb-3">LocalStorage</h2>
        <pre class="text-sm bg-gray-100 p-2 rounded overflow-auto max-h-60">{{ localStorageState }}</pre>
      </div>
    </div>

    <div class="bg-white p-4 rounded-lg shadow-md border mb-6">
      <h2 class="font-semibold mb-3">Acciones de Debug</h2>
      <div class="flex flex-wrap gap-2">
        <button @click="checkAuth" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors">
          🔍 Verificar Auth
        </button>
        <button @click="forceDashboard" class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors">
          🚀 Forzar Dashboard
        </button>
        <button @click="clearAll" class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors">
          🗑️ Limpiar Todo
        </button>
        <button @click="simulateLogin" class="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded transition-colors">
          🎭 Simular Login
        </button>
      </div>
    </div>

    <div class="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
      <h3 class="font-semibold text-yellow-800">📋 Instrucciones</h3>
      <ol class="text-sm text-yellow-700 mt-2 list-decimal list-inside space-y-1">
        <li>Presiona F12 y ve a la pestaña "Console"</li>
        <li>Haz clic en "Verificar Auth" para ver el estado actual</li>
        <li>Intenta hacer login normal</li>
        <li>Vuelve aquí y verifica si el token se guardó</li>
        <li>Comparte todos los logs de la consola</li>
      </ol>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const storeState = computed(() => ({
  user: authStore.user,
  token: authStore.token,
  loading: authStore.loading,
  isAuthenticated: authStore.isAuthenticated()
}))

const localStorageState = computed(() => ({
  token: localStorage.getItem('token'),
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null
}))

const checkAuth = () => {
  console.log('=== 🔍 MANUAL AUTH CHECK ===')
  console.log('📍 Ruta actual:', window.location.pathname)
  console.log('🏪 Store - isAuthenticated:', authStore.isAuthenticated())
  console.log('🏪 Store - token:', authStore.token)
  console.log('🏪 Store - user:', authStore.user)
  console.log('💾 LocalStorage - token:', localStorage.getItem('token'))
  console.log('💾 LocalStorage - user:', localStorage.getItem('user'))
  console.log('=== FIN CHECK ===')
}

const forceDashboard = () => {
  console.log('🚀 Forzando navegación a dashboard...')
  router.push('/dashboard')
}

const clearAll = () => {
  console.log('🗑️ Limpiando toda la autenticación...')
  authStore.logout()
  setTimeout(() => {
    location.reload()
  }, 1000)
}

const simulateLogin = () => {
  console.log('🎭 Simulando login...')
  
  // Crear un token y usuario de prueba
  const mockUser = {
    id: 999,
    dni: '99999999',
    nombres: 'Usuario',
    apellidos: 'Debug',
    email: 'debug@test.com',
    rol: 'debug'
  }
  
  const mockToken = 'debug-token-' + Date.now()
  
  // Guardar en store y localStorage
  authStore.user = mockUser
  authStore.token = mockToken
  localStorage.setItem('token', mockToken)
  localStorage.setItem('user', JSON.stringify(mockUser))
  
  console.log('✅ Login simulado completado')
  console.log('🔐 Token simulado:', mockToken)
  console.log('👤 Usuario simulado:', mockUser)
  
  // Verificar que se guardó
  checkAuth()
}
</script>