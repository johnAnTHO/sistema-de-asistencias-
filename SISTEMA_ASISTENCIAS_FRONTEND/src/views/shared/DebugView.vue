<template>
  <div class="min-h-screen bg-gray-100 p-8">
    <div class="max-w-4xl mx-auto">
      <div class="bg-white rounded-lg shadow-md p-6">
        <h1 class="text-2xl font-bold text-green-600 mb-4">✅ Sistema de Asistencias - DEBUG</h1>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div class="bg-blue-50 p-4 rounded-lg">
            <h2 class="font-semibold text-blue-800">Estado del Sistema:</h2>
            <ul class="mt-2 text-sm">
              <li>✅ Vue Router: Funcionando</li>
              <li>✅ Pinia Store: Funcionando</li>
              <li>✅ Componentes: Cargados</li>
              <li>📍 Ruta actual: {{ $route.path }}</li>
            </ul>
          </div>
          
          <div class="bg-green-50 p-4 rounded-lg">
            <h2 class="font-semibold text-green-800">Estado de Autenticación:</h2>
            <ul class="mt-2 text-sm">
              <li>Token: {{ authStore.token || 'No existe' }}</li>
              <li>Usuario: {{ authStore.user ? 'Conectado' : 'No conectado' }}</li>
              <li>Autenticado: {{ authStore.isAuthenticated() ? 'Sí' : 'No' }}</li>
            </ul>
          </div>
        </div>

        <div class="bg-yellow-50 p-4 rounded-lg mb-6">
          <h2 class="font-semibold text-yellow-800">Credenciales de Prueba:</h2>
          <p class="text-sm mt-2">DNI: <strong>12345678</strong></p>
          <p class="text-sm">Password: <strong>password</strong></p>
        </div>

        <div class="flex flex-wrap gap-4">
          <router-link 
            to="/login" 
            class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            🔐 Ir a Login
          </router-link>
          
          <router-link 
            to="/dashboard" 
            class="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            📊 Ir a Dashboard
          </router-link>
          
          <router-link 
            to="/asistencias" 
            class="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            📋 Ir a Asistencias
          </router-link>
          
          <button 
            @click="authStore.logout()"
            class="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            🚪 Cerrar Sesión
          </button>
        </div>

        <div class="mt-6 p-4 bg-gray-100 rounded-lg">
          <h3 class="font-semibold">Console Output:</h3>
          <p class="text-sm text-gray-600">Revisa la consola del navegador (F12) para más detalles</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const $route = useRoute()
const authStore = useAuthStore()

console.log('🎯 DebugView montado correctamente')
console.log('📍 Ruta actual:', $route.path)
console.log('🔐 Estado auth:', {
  token: authStore.token,
  user: authStore.user,
  isAuthenticated: authStore.isAuthenticated()
})
</script>