<!-- src/views/practicante/AsistenciasView.vue -->
<template>
  <div class="practicante-asistencias">
    <h1 class="text-2xl font-bold mb-6">Mis Asistencias</h1>
    
    <div class="bg-white rounded-xl shadow p-6">
      <!-- Filtros -->
      <div class="flex gap-4 mb-6">
        <input type="month" v-model="filtroMes" class="border rounded-lg p-2">
        <button @click="cargarAsistencias" class="bg-blue-500 text-white px-4 py-2 rounded-lg">
          Filtrar
        </button>
      </div>
      
      <!-- Tabla -->
      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead>
            <tr class="bg-gray-100">
              <th class="px-4 py-3 text-left">Fecha</th>
              <th class="px-4 py-3 text-left">Entrada</th>
              <th class="px-4 py-3 text-left">Salida</th>
              <th class="px-4 py-3 text-left">Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="asistencia in asistencias" :key="asistencia.id" class="border-b">
              <td class="px-4 py-3">{{ asistencia.fecha }}</td>
              <td class="px-4 py-3">{{ asistencia.entrada }}</td>
              <td class="px-4 py-3">{{ asistencia.salida }}</td>
              <td class="px-4 py-3">
                <span :class="asistencia.estado === 'Puntual' ? 'text-green-600' : 'text-yellow-600'">
                  {{ asistencia.estado }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const filtroMes = ref('2024-01')
const asistencias = ref([
  { id: 1, fecha: '2024-01-15', entrada: '08:00', salida: '12:00', estado: 'Puntual' },
  { id: 2, fecha: '2024-01-14', entrada: '08:15', salida: '12:00', estado: 'Tardanza' }
])

const cargarAsistencias = () => {
  console.log('Cargando asistencias para:', filtroMes.value)
}
</script>