<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <div class="mx-auto h-12 w-12 bg-indigo-600 rounded-full flex items-center justify-center">
          <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
          </svg>
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sistema de Asistencias
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Municipalidad San Juan Bautista
        </p>
      </div>

      <!-- Selector de Tipo de Usuario -->
      <div class="bg-blue-50 p-4 rounded-lg">
        <label class="block text-sm font-medium text-blue-800 mb-2">Tipo de Acceso:</label>
        <div class="grid grid-cols-2 gap-2">
          <button 
            @click="setUserType('admin')"
            :class="userType === 'admin' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border border-blue-600'"
            class="py-2 px-3 rounded-md text-sm font-medium transition-colors"
          >
            👨‍💼 Administrador
          </button>
          <button 
            @click="setUserType('practicante')"
            :class="userType === 'practicante' ? 'bg-green-600 text-white' : 'bg-white text-green-600 border border-green-600'"
            class="py-2 px-3 rounded-md text-sm font-medium transition-colors"
          >
            👨‍🎓 Practicante
          </button>
        </div>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="dni" class="sr-only">DNI</label>
            <input
              id="dni"
              v-model="form.dni"
              name="dni"
              type="text"
              autocomplete="dni"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              :placeholder="userType === 'admin' ? 'DNI Administrador' : 'DNI Practicante'"
            >
          </div>
          <div>
            <label for="password" class="sr-only">Contraseña</label>
            <input
              id="password"
              v-model="form.password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Contraseña"
            >
          </div>
        </div>

        <!-- Credenciales de Prueba -->
        <div v-if="userType" class="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
          <p class="text-xs text-yellow-800 font-medium">Credenciales de Prueba para {{ userType === 'admin' ? 'Administrador' : 'Practicante' }}:</p>
          <p class="text-xs text-yellow-700 mt-1">
            <span v-if="userType === 'admin'">DNI: <strong>12345678</strong> | Password: <strong>admin123</strong></span>
            <span v-if="userType === 'practicante'">DNI: <strong>87654321</strong> | Password: <strong>practi123</strong></span>
          </p>
        </div>

        <div v-if="error" class="text-red-600 text-sm text-center bg-red-50 p-2 rounded-md">
          {{ error }}
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </span>
            <span v-if="loading">Iniciando sesión...</span>
            <span v-else>Ingresar como {{ userType === 'admin' ? 'Administrador' : 'Practicante' }}</span>
          </button>
        </div>
      </form>

      <!-- Debug Info -->
      <div class="mt-4 p-3 bg-gray-100 rounded-lg">
        <details>
          <summary class="text-sm font-medium text-gray-700 cursor-pointer">🔧 Información de Debug</summary>
          <div class="mt-2 text-xs text-gray-600">
            <p>User Type: {{ userType }}</p>
            <p>Backend: http://localhost:3000/api/auth/login</p>
            <button @click="testBackend" class="mt-1 text-blue-600 underline">Probar Conexión Backend</button>
          </div>
        </details>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const userType = ref('admin') // 'admin' o 'practicante'
const form = ref({
  dni: '',
  password: ''
})
const loading = ref(false)
const error = ref('')

// Auto-completar credenciales según el tipo de usuario
watch(userType, (newType) => {
  if (newType === 'admin') {
    form.value.dni = '12345678'
    form.value.password = 'admin123'
  } else {
    form.value.dni = '87654321' 
    form.value.password = 'practi123'
  }
}, { immediate: true })

const setUserType = (type) => {
  userType.value = type
}

const handleLogin = async () => {
  try {
    loading.value = true
    error.value = ''
    console.log('🔐 Intentando login como:', userType.value)
    
    await authStore.login(form.value)
    console.log('✅ Login exitoso, redirigiendo...')
    
    // Redirigir según el tipo de usuario
    router.push('/dashboard')
    
  } catch (err) {
    console.error('❌ Error en login:', err)
    error.value = err.message || 'Error al iniciar sesión'
  } finally {
    loading.value = false
  }
}

const testBackend = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/health')
    const data = await response.json()
    alert(`✅ Backend conectado: ${data.message}`)
  } catch (err) {
    alert('❌ No se pudo conectar al backend')
  }
}
</script>