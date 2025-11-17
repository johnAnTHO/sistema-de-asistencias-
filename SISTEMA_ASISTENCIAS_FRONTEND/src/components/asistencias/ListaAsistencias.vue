<template>
  <div>
    <div v-if="asistenciasStore.loading" class="flex justify-center py-8">
      <LoadingSpinner size="lg" />
    </div>

    <div v-else-if="asistenciasStore.asistenciasHoy.length === 0" class="text-center py-8 text-gray-500">
      No hay asistencias registradas hoy
    </div>

    <div v-else class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Empleado
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Entrada
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Salida
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="asistencia in asistenciasStore.asistenciasHoy" :key="asistencia.id">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">{{ asistencia.empleado?.nombre }}</div>
              <div class="text-sm text-gray-500">{{ asistencia.empleado?.cargo }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ formatTime(asistencia.horaEntrada) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ formatTime(asistencia.horaSalida) || '--:--' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="asistencia.horaSalida ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'">
                {{ asistencia.horaSalida ? 'Completo' : 'Activo' }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAsistenciasStore } from '../../stores/asistencias'
import LoadingSpinner from '../ui/LoadingSpinner.vue'

const asistenciasStore = useAsistenciasStore()

onMounted(() => {
  asistenciasStore.cargarAsistenciasHoy()
})

const formatTime = (timeString) => {
  if (!timeString) return ''
  const date = new Date(timeString)
  return date.toLocaleTimeString('es-ES', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}
</script>