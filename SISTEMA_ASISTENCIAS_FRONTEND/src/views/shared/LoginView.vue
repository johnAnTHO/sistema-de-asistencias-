<template>
  <div class="login-container">
    <div class="login-form-wrapper">
      <div class="login-card">
        <!-- Header -->
        <div class="login-header">
          <div class="logo">
            <i class="fas fa-fingerprint text-3xl text-blue-500"></i>
          </div>
          <h1 class="text-2xl font-bold text-gray-800">Sistema de Asistencias</h1>
          <p class="text-gray-600">Municipalidad de San Juan Bautista</p>
        </div>

        <!-- Formulario -->
        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label for="dni" class="form-label">DNI</label>
            <input
              id="dni"
              v-model="loginData.dni"
              type="text"
              class="form-input"
              placeholder="Ingrese su DNI"
              required
              maxlength="8"
              :disabled="loading"
            />
          </div>

          <div class="form-group">
            <label for="password" class="form-label">Contraseña</label>
            <input
              id="password"
              v-model="loginData.password"
              type="password"
              class="form-input"
              placeholder="Ingrese su contraseña"
              required
              :disabled="loading"
            />
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="login-btn"
          >
            <span v-if="loading" class="flex items-center justify-center">
              <i class="fas fa-spinner fa-spin mr-2"></i>
              Verificando...
            </span>
            <span v-else class="flex items-center justify-center">
              <i class="fas fa-sign-in-alt mr-2"></i>
              Iniciar Sesión
            </span>
          </button>

          <!-- Debug Info -->
          <div v-if="debugMode" class="debug-info">
            <p class="text-xs text-gray-500 mt-4">
              🔍 Modo debug activado - Prueba con:<br>
              Admin: 99999999 / password<br>
              Practicante: 88888888 / password
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const loginData = ref({
  dni: '',
  password: ''
})

const loading = ref(false)
const debugMode = ref(true)

const handleLogin = async () => {
  try {
    loading.value = true
    console.clear()
    console.log('🚀 INICIANDO LOGIN...')
    
    // 1. Hacer login
    const result = await authStore.login(loginData.value)
    console.log('✅ Login exitoso en store')
    
    // 2. Pausa para que Vue actualice
    await new Promise(resolve => setTimeout(resolve, 200))
    
    // 3. Verificar estado
    console.log('🔍 ESTADO ACTUAL:')
    console.log('- Token:', authStore.token ? '✅' : '❌')
    console.log('- User:', authStore.user)
    console.log('- isAuthenticated:', authStore.isAuthenticated)
    console.log('- isAdmin:', authStore.isAdmin)
    
    // 4. Redirigir
    if (authStore.isAuthenticated) {
      console.log('🎯 USUARIO AUTENTICADO')
      
      setTimeout(() => {
        if (authStore.isAdmin) {
          console.log('📍 Redirigiendo a ADMIN')
          router.push('/admin/dashboard')
        } else {
          console.log('📍 Redirigiendo a PRACTICANTE')
          router.push('/practicante/dashboard')
        }
      }, 100)
    } else {
      console.error('❌ NO AUTENTICADO')
      alert('Error de autenticación')
    }
    
  } catch (error) {
    console.error('🔥 ERROR:', error)
    alert('Error: ' + error.message)
  } finally {
    loading.value = false
  }
}

// Auto-completar para testing
onMounted(() => {
  if (debugMode.value) {
    // Descomenta para pruebas rápidas
    // loginData.value = { dni: '99999999', password: 'password' } // Admin
    // loginData.value = { dni: '88888888', password: 'password' } // Practicante
  }
})
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-form-wrapper {
  width: 100%;
  max-width: 400px;
}

.login-card {
  background: white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.logo {
  margin-bottom: 1rem;
}

.login-header h1 {
  margin-bottom: 0.5rem;
  color: #1f2937;
}

.login-header p {
  color: #6b7280;
  font-size: 0.9rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  color: #374151;
  font-weight: 500;
  font-size: 0.9rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s;
  background: #f9fafb;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  background: white;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.login-btn {
  width: 100%;
  padding: 0.75rem 1rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.login-btn:hover:not(:disabled) {
  background: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.login-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
  transform: none;
}

.debug-info {
  border-top: 1px solid #e5e7eb;
  padding-top: 1rem;
}
</style>