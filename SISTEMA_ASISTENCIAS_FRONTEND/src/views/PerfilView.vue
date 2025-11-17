<template>
  <div class="p-6">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-2xl font-bold mb-6">Mi Perfil</h1>

      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-6">
          <!-- Foto de perfil -->
          <div class="flex-shrink-0">
            <div class="w-32 h-32 bg-indigo-100 rounded-full flex items-center justify-center border-4 border-white shadow-md">
              <span class="text-indigo-600 text-2xl font-bold">
                {{ getIniciales(authStore.user?.nombres, authStore.user?.apellidos) }}
              </span>
            </div>
            <div class="mt-4 text-center">
              <span class="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                {{ authStore.user?.rol }}
              </span>
            </div>
          </div>

          <!-- Información del usuario -->
          <div class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">DNI</label>
              <p class="text-gray-900">{{ authStore.user?.dni || 'N/A' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nombres</label>
              <p class="text-gray-900">{{ authStore.user?.nombres || 'N/A' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Apellidos</label>
              <p class="text-gray-900">{{ authStore.user?.apellidos || 'N/A' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <p class="text-gray-900">{{ authStore.user?.email || 'N/A' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
              <p class="text-gray-900">{{ authStore.user?.telefono || 'N/A' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Área</label>
              <p class="text-gray-900">{{ authStore.user?.area?.nombre || 'N/A' }}</p>
            </div>
            <div v-if="authStore.isPracticante()">
              <label class="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio Prácticas</label>
              <p class="text-gray-900">{{ formatFecha(authStore.user?.fecha_inicio_practicas) }}</p>
            </div>
            <div v-if="authStore.isPracticante()">
              <label class="block text-sm font-medium text-gray-700 mb-1">Fecha Fin Prácticas</label>
              <p class="text-gray-900">{{ formatFecha(authStore.user?.fecha_fin_practicas) || '--' }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Estadísticas para practicantes -->
      <div v-if="authStore.isPracticante()" class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-lg shadow-md text-center">
          <div class="text-2xl font-bold text-indigo-600">{{ totalAsistencias }}</div>
          <div class="text-sm text-gray-600">Asistencias Totales</div>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md text-center">
          <div class="text-2xl font-bold text-green-600">{{ asistenciasPuntual }}</div>
          <div class="text-sm text-gray-600">Asistencias Puntuales</div>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md text-center">
          <div class="text-2xl font-bold text-yellow-600">{{ asistenciasTardanza }}</div>
          <div class="text-sm text-gray-600">Tardanzas</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()

const totalAsistencias = ref(0)
const asistenciasPuntual = ref(0)
const asistenciasTardanza = ref(0)

onMounted(async () => {
  if (authStore.isPracticante()) {
    await cargarEstadisticasPracticante()
  }
})

const cargarEstadisticasPracticante = async () => {
  // Simular carga de estadísticas
  totalAsistencias.value = 45
  asistenciasPuntual.value = 38
  asistenciasTardanza.value = 7
}

const getIniciales = (nombres, apellidos) => {
  if (!nombres || !apellidos) return '??'
  return (nombres.charAt(0) + apellidos.charAt(0)).toUpperCase()
}

const formatFecha = (fecha) => {
  if (!fecha) return 'N/A'
  return new Date(fecha).toLocaleDateString('es-ES')
}
</script>