<!-- src/views/practicante/RegistroView.vue -->
<template>
  <div class="practicante-registro">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-800">Registro de Asistencia</h1>
      <p class="text-gray-600">Registra tu entrada y salida</p>
    </div>

    <!-- Métodos de registro -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- Método DNI -->
      <div class="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
        <div class="flex items-center mb-4">
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
            <i class="fas fa-id-card text-blue-600 text-xl"></i>
          </div>
          <div>
            <h3 class="font-bold text-lg text-blue-800">DNI Electrónico</h3>
            <p class="text-blue-600 text-sm">Usa tu lector de DNI</p>
          </div>
        </div>
        
        <button 
          @click="registrarConDNI"
          :disabled="registrando"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition disabled:opacity-50"
        >
          <i class="fas fa-fingerprint mr-2"></i>
          Registrar con DNI
        </button>
      </div>

      <!-- Método Huella -->
      <div class="bg-green-50 border-2 border-green-200 rounded-xl p-6">
        <div class="flex items-center mb-4">
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
            <i class="fas fa-fingerprint text-green-600 text-xl"></i>
          </div>
          <div>
            <h3 class="font-bold text-lg text-green-800">Huella Digital</h3>
            <p class="text-green-600 text-sm">Usa el lector biométrico</p>
          </div>
        </div>
        
        <button 
          @click="registrarConHuella"
          :disabled="registrando"
          class="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition disabled:opacity-50"
        >
          <i class="fas fa-hand-pointer mr-2"></i>
          Registrar con Huella
        </button>
      </div>
    </div>

    <!-- Registros de hoy -->
    <div class="bg-white rounded-xl shadow p-6">
      <h3 class="text-lg font-bold mb-4">Mis Registros de Hoy</h3>
      
      <div v-if="registrosHoy.length > 0" class="space-y-3">
        <div v-for="registro in registrosHoy" :key="registro.id" 
             class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
          <div class="flex items-center">
            <div class="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                 :class="registro.tipo === 'entrada' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'">
              <i :class="registro.tipo === 'entrada' ? 'fas fa-sign-in-alt' : 'fas fa-sign-out-alt'"></i>
            </div>
            <div>
              <p class="font-medium">{{ registro.hora }}</p>
              <p class="text-sm text-gray-500">
                {{ registro.metodo === 'dni' ? 'DNI Electrónico' : 'Huella Digital' }}
              </p>
            </div>
          </div>
          <span class="px-3 py-1 rounded-full text-xs font-medium"
                :class="registro.estado === 'puntual' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'">
            {{ registro.estado === 'puntual' ? 'Puntual' : 'Tardanza' }}
          </span>
        </div>
      </div>
      
      <div v-else class="text-center py-8 text-gray-500">
        <i class="fas fa-clock text-3xl mb-2"></i>
        <p>No hay registros para hoy</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()
const registrando = ref(false)

// Datos de ejemplo
const registrosHoy = ref([
  {
    id: 1,
    hora: '08:00:00',
    tipo: 'entrada',
    metodo: 'huella',
    estado: 'puntual'
  }
])

const registrarConDNI = async () => {
  try {
    registrando.value = true
    console.log('📇 Registrando con DNI...')
    
    // Simular llamada a API
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Agregar registro
    registrosHoy.value.unshift({
      id: Date.now(),
      hora: new Date().toLocaleTimeString('es-PE'),
      tipo: 'entrada',
      metodo: 'dni',
      estado: Math.random() > 0.2 ? 'puntual' : 'tardanza'
    })
    
    alert('✅ Registro con DNI exitoso')
    
  } catch (error) {
    console.error('Error:', error)
    alert('❌ Error al registrar con DNI')
  } finally {
    registrando.value = false
  }
}

const registrarConHuella = async () => {
  try {
    registrando.value = true
    console.log('🖐️ Registrando con huella...')
    
    // Simular llamada a API
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Agregar registro
    registrosHoy.value.unshift({
      id: Date.now(),
      hora: new Date().toLocaleTimeString('es-PE'),
      tipo: 'entrada',
      metodo: 'huella',
      estado: Math.random() > 0.2 ? 'puntual' : 'tardanza'
    })
    
    alert('✅ Registro con huella exitoso')
    
  } catch (error) {
    console.error('Error:', error)
    alert('❌ Error al registrar con huella')
  } finally {
    registrando.value = false
  }
}
</script>

<style scoped>
.practicante-registro {
  @apply p-6 max-w-4xl mx-auto;
}
</style>