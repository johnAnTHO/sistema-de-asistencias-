<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Dashboard - Resumen del Día</h1>
    
    <!-- Tarjetas de Resumen -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
        <div class="flex justify-between items-center">
          <div>
            <h3 class="text-lg font-semibold mb-2 text-gray-600">Total Empleados</h3>
            <p class="text-3xl font-bold text-blue-600">{{ totalEmpleados }}</p>
          </div>
          <div class="bg-blue-100 p-3 rounded-full">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </div>
        </div>
      </div>
      
      <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
        <div class="flex justify-between items-center">
          <div>
            <h3 class="text-lg font-semibold mb-2 text-gray-600">Asistencias Hoy</h3>
            <p class="text-3xl font-bold text-green-600">{{ asistenciasHoy }}</p>
          </div>
          <div class="bg-green-100 p-3 rounded-full">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        </div>
      </div>
      
      <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
        <div class="flex justify-between items-center">
          <div>
            <h3 class="text-lg font-semibold mb-2 text-gray-600">Tardanzas Hoy</h3>
            <p class="text-3xl font-bold text-yellow-600">{{ tardanzasHoy }}</p>
          </div>
          <div class="bg-yellow-100 p-3 rounded-full">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
        <div class="flex justify-between items-center">
          <div>
            <h3 class="text-lg font-semibold mb-2 text-gray-600">Ausentes Hoy</h3>
            <p class="text-3xl font-bold text-red-600">{{ ausentesHoy }}</p>
          </div>
          <div class="bg-red-100 p-3 rounded-full">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Gráfico de resumen -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-xl font-semibold mb-4">Resumen de Asistencias</h2>
        <div class="space-y-3">
          <div v-for="item in resumenAsistencias" :key="item.estado" class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="w-3 h-3 rounded-full mr-3" :class="item.color"></div>
              <span class="text-sm font-medium">{{ item.estado }}</span>
            </div>
            <div class="flex items-center space-x-2">
              <span class="text-sm font-bold">{{ item.cantidad }}</span>
              <span class="text-xs text-gray-500">({{ item.porcentaje }}%)</span>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-xl font-semibold mb-4">Actividad Reciente</h2>
        <div class="space-y-3">
          <div v-if="actividadReciente.length === 0" class="text-center py-4 text-gray-500">
            No hay actividad reciente
          </div>
          <div v-else v-for="actividad in actividadReciente" :key="actividad.id" class="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
            <div class="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
              <span class="text-indigo-600 text-xs font-medium">
                {{ getIniciales(actividad.nombres, actividad.apellidos) }}
              </span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate">
                {{ actividad.nombres }} {{ actividad.apellidos }}
              </p>
              <p class="text-sm text-gray-500">
                {{ actividad.tipo }} a las {{ actividad.hora }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Lista de Asistencias Recientes -->
    <div class="bg-white rounded-lg shadow-md">
      <div class="p-4 border-b flex justify-between items-center">
        <h2 class="text-xl font-semibold">Asistencias de Hoy</h2>
        <span class="text-sm text-gray-500">{{ asistencias.length }} registros</span>
      </div>
      <div class="p-4">
        <div v-if="loading" class="text-center py-4">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p class="mt-2 text-gray-600">Cargando asistencias...</p>
        </div>
        <div v-else-if="asistencias.length === 0" class="text-center py-8 text-gray-500">
          <svg class="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          No hay asistencias registradas hoy.
        </div>
        <div v-else class="space-y-3">
          <div 
            v-for="asistencia in asistencias.slice(0, 10)" 
            :key="asistencia.id"
            class="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                <span class="text-indigo-600 font-medium text-sm">
                  {{ getIniciales(asistencia.usuario?.nombres, asistencia.usuario?.apellidos) }}
                </span>
              </div>
              <div>
                <p class="font-medium text-gray-900">{{ asistencia.usuario?.nombres }} {{ asistencia.usuario?.apellidos }}</p>
                <p class="text-sm text-gray-500">DNI: {{ asistencia.usuario?.dni }} • {{ asistencia.usuario?.area?.nombre }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="font-medium" :class="asistencia.hora_entra ? 'text-green-600' : 'text-red-600'">
                {{ asistencia.hora_entra || 'No registrado' }}
              </p>
              <p class="text-sm text-gray-500">{{ formatFecha(asistencia.fecha) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAsistenciasStore } from '../stores/asistencias'

const asistenciasStore = useAsistenciasStore()

const totalEmpleados = ref(45) // Esto debería venir de tu API
const asistencias = ref([])
const loading = ref(false)

const asistenciasHoy = computed(() => asistencias.value.filter(a => a.hora_entra).length)
const tardanzasHoy = computed(() => asistencias.value.filter(a => a.minutos_tardanza > 0).length)
const ausentesHoy = computed(() => Math.max(0, totalEmpleados.value - asistenciasHoy.value))

const resumenAsistencias = computed(() => {
  const total = asistencias.value.length
  const puntual = asistencias.value.filter(a => a.hora_entra && a.minutos_tardanza === 0).length
  const tardanza = asistencias.value.filter(a => a.minutos_tardanza > 0).length
  const ausente = ausentesHoy.value

  return [
    { estado: 'Puntual', cantidad: puntual, porcentaje: total > 0 ? Math.round((puntual / total) * 100) : 0, color: 'bg-green-500' },
    { estado: 'Tardanza', cantidad: tardanza, porcentaje: total > 0 ? Math.round((tardanza / total) * 100) : 0, color: 'bg-yellow-500' },
    { estado: 'Ausente', cantidad: ausente, porcentaje: total > 0 ? Math.round((ausente / total) * 100) : 0, color: 'bg-red-500' }
  ]
})

const actividadReciente = computed(() => {
  return asistencias.value
    .filter(a => a.hora_entra)
    .slice(0, 5)
    .map(a => ({
      id: a.id,
      nombres: a.usuario?.nombres,
      apellidos: a.usuario?.apellidos,
      tipo: 'Entrada',
      hora: a.hora_entra
    }))
})

onMounted(async () => {
  await cargarDatosDashboard()
})

const cargarDatosDashboard = async () => {
  try {
    loading.value = true
    await asistenciasStore.cargarAsistenciasHoy()
    
    // Usar datos reales o de ejemplo
    if (asistenciasStore.asistenciasHoy && asistenciasStore.asistenciasHoy.length > 0) {
      asistencias.value = asistenciasStore.asistenciasHoy
    } else {
      // Datos de ejemplo
      asistencias.value = [
        {
          id: 1,
          fecha: new Date().toISOString().split('T')[0],
          hora_entra: '08:00',
          hora_salida: '17:00',
          minutos_tardanza: 0,
          usuario: {
            id: 1,
            dni: '12345678',
            nombres: 'Juan Carlos',
            apellidos: 'Pérez García',
            area: { id: 1, nombre: 'Administración' }
          }
        },
        {
          id: 2,
          fecha: new Date().toISOString().split('T')[0],
          hora_entra: '08:15',
          hora_salida: null,
          minutos_tardanza: 15,
          usuario: {
            id: 2,
            dni: '87654321',
            nombres: 'María Elena',
            apellidos: 'Gómez López',
            area: { id: 2, nombre: 'Recursos Humanos' }
          }
        }
      ]
    }
    
  } catch (error) {
    console.error('Error cargando dashboard:', error)
  } finally {
    loading.value = false
  }
}

const formatFecha = (fecha) => {
  return new Date(fecha).toLocaleDateString('es-ES')
}

const getIniciales = (nombres, apellidos) => {
  if (!nombres || !apellidos) return '??'
  return (nombres.charAt(0) + apellidos.charAt(0)).toUpperCase()
}
</script>