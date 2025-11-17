<template>
  <div class="space-y-4">
    <div class="text-center">
      <h3 class="text-lg font-medium">Registrar Asistencia</h3>
      <p class="text-sm text-gray-600">{{ currentTime }}</p>
    </div>

    <div class="space-y-3">
      <button
        @click="marcarEntrada"
        :disabled="loading"
        class="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        <LoadingSpinner v-if="loading" class="w-4 h-4 mr-2" />
        {{ loading ? 'Registrando...' : 'Marcar Entrada' }}
      </button>

      <button
        @click="marcarSalida"
        :disabled="loading"
        class="w-full bg-red-600 text-white py-3 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        <LoadingSpinner v-if="loading" class="w-4 h-4 mr-2" />
        {{ loading ? 'Registrando...' : 'Marcar Salida' }}
      </button>
    </div>

    <div v-if="message" class="p-3 rounded-md text-sm" :class="messageType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
      {{ message }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useAsistenciasStore } from '../../stores/asistencias'
import LoadingSpinner from '../ui/LoadingSpinner.vue'

const asistenciasStore = useAsistenciasStore()

const loading = ref(false)
const message = ref('')
const messageType = ref('success')
const currentTime = ref('')

let timeInterval

const updateTime = () => {
  currentTime.value = new Date().toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

const showMessage = (text, type = 'success') => {
  message.value = text
  messageType.value = type
  setTimeout(() => {
    message.value = ''
  }, 5000)
}

const marcarEntrada = async () => {
  loading.value = true
  try {
    // Aquí integrarías con el lector biométrico
    const datosBiometricos = {
      userId: asistenciasStore.user?.id,
      timestamp: new Date().toISOString(),
      // otros datos biométricos...
    }
    
    await asistenciasStore.marcarEntrada(datosBiometricos)
    showMessage('Entrada registrada correctamente', 'success')
  } catch (error) {
    showMessage('Error al registrar entrada: ' + error.message, 'error')
  } finally {
    loading.value = false
  }
}

const marcarSalida = async () => {
  loading.value = true
  try {
    // Similar a marcarEntrada pero para salida
    showMessage('Salida registrada correctamente', 'success')
  } catch (error) {
    showMessage('Error al registrar salida: ' + error.message, 'error')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  updateTime()
  timeInterval = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})
</script>