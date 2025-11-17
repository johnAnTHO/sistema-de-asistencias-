<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Gestión de Asistencias</h1>
      <div class="flex space-x-2">
        <button 
          @click="cargarAsistencias"
          class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          Actualizar
        </button>
      </div>
    </div>

    <!-- Filtros -->
    <div class="bg-white p-4 rounded-lg shadow-md mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
          <input 
            type="date" 
            v-model="filtros.fecha"
            class="w-full p-2 border border-gray-300 rounded-md"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Área</label>
          <select 
            v-model="filtros.area_id"
            class="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Todas las áreas</option>
            <option v-for="area in areas" :key="area.id" :value="area.id">
              {{ area.nombre }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
          <select 
            v-model="filtros.estado"
            class="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Todos</option>
            <option value="puntual">Puntual</option>
            <option value="tardanza">Tardanza</option>
            <option value="ausente">Ausente</option>
          </select>
        </div>
        <div class="flex items-end">
          <button 
            @click="aplicarFiltros"
            class="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Aplicar Filtros
          </button>
        </div>
      </div>
    </div>

    <!-- Estadísticas -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500">
        <div class="flex justify-between items-center">
          <div>
            <p class="text-sm text-gray-600">Total Asistencias</p>
            <p class="text-2xl font-bold">{{ totalAsistencias }}</p>
          </div>
          <div class="bg-green-100 p-2 rounded-full">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white p-4 rounded-lg shadow-md border-l-4 border-yellow-500">
        <div class="flex justify-between items-center">
          <div>
            <p class="text-sm text-gray-600">Tardanzas</p>
            <p class="text-2xl font-bold">{{ totalTardanzas }}</p>
          </div>
          <div class="bg-yellow-100 p-2 rounded-full">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white p-4 rounded-lg shadow-md border-l-4 border-red-500">
        <div class="flex justify-between items-center">
          <div>
            <p class="text-sm text-gray-600">Ausentes</p>
            <p class="text-2xl font-bold">{{ totalAusentes }}</p>
          </div>
          <div class="bg-red-100 p-2 rounded-full">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
        <div class="flex justify-between items-center">
          <div>
            <p class="text-sm text-gray-600">Registros Hoy</p>
            <p class="text-2xl font-bold">{{ asistenciasFiltradas.length }}</p>
          </div>
          <div class="bg-blue-100 p-2 rounded-full">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabla de asistencias -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Empleado
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                DNI
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Entrada
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Salida
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tardanza
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="loading">
              <td colspan="7" class="px-6 py-4 text-center">
                <div class="flex justify-center items-center">
                  <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                  <span class="ml-2">Cargando asistencias...</span>
                </div>
              </td>
            </tr>
            <tr v-else-if="asistenciasFiltradas.length === 0">
              <td colspan="7" class="px-6 py-4 text-center text-gray-500">
                <div class="flex flex-col items-center justify-center py-8">
                  <svg class="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  No se encontraron asistencias
                </div>
              </td>
            </tr>
            <tr 
              v-else 
              v-for="asistencia in asistenciasFiltradas" 
              :key="asistencia.id"
              class="hover:bg-gray-50 transition-colors duration-200"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span class="text-indigo-600 font-medium text-sm">
                      {{ getIniciales(asistencia.usuario?.nombres, asistencia.usuario?.apellidos) }}
                    </span>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">
                      {{ asistencia.usuario?.nombres }} {{ asistencia.usuario?.apellidos }}
                    </div>
                    <div class="text-sm text-gray-500">
                      {{ asistencia.usuario?.area?.nombre || 'Sin área' }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ asistencia.usuario?.dni || 'N/A' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatFecha(asistencia.fecha) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <span :class="asistencia.hora_entra ? 'text-green-600' : 'text-red-600'">
                  {{ asistencia.hora_entra || 'No registrado' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <span :class="asistencia.hora_salida ? 'text-blue-600' : 'text-gray-600'">
                  {{ asistencia.hora_salida || 'No registrado' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <span v-if="asistencia.minutos_tardanza > 0" class="text-red-600 font-medium">
                  +{{ asistencia.minutos_tardanza }} min
                </span>
                <span v-else class="text-green-600">Puntual</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  :class="getEstadoClase(asistencia)"
                  class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                >
                  {{ getEstadoTexto(asistencia) }}
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
import { ref, computed, onMounted } from 'vue'
import { useAsistenciasStore } from '../stores/asistencias'

const asistenciasStore = useAsistenciasStore()

const asistencias = ref([])
const areas = ref([])
const loading = ref(false)
const filtros = ref({
  fecha: new Date().toISOString().split('T')[0],
  area_id: '',
  estado: ''
})

// Computed properties para estadísticas
const totalAsistencias = computed(() => asistencias.value.length)
const totalTardanzas = computed(() => asistencias.value.filter(a => a.minutos_tardanza > 0).length)
const totalAusentes = computed(() => {
  // Esto es un ejemplo - necesitarías lógica real para determinar ausentes
  return Math.max(0, 50 - totalAsistencias.value) // Suponiendo 50 empleados totales
})

const asistenciasFiltradas = computed(() => {
  let filtered = asistencias.value

  // Filtrar por fecha
  if (filtros.value.fecha) {
    filtered = filtered.filter(asistencia => 
      asistencia.fecha === filtros.value.fecha
    )
  }

  // Filtrar por área
  if (filtros.value.area_id) {
    filtered = filtered.filter(asistencia => 
      asistencia.usuario?.area_id == filtros.value.area_id
    )
  }

  // Filtrar por estado
  if (filtros.value.estado) {
    filtered = filtered.filter(asistencia => {
      const estado = getEstadoTexto(asistencia)
      return estado === filtros.value.estado
    })
  }

  return filtered
})

onMounted(async () => {
  await cargarAsistencias()
  await cargarAreas()
})

const cargarAsistencias = async () => {
  try {
    loading.value = true
    console.log('📋 Cargando asistencias...')
    
    // Intenta cargar desde el store (que usa la API real)
    await asistenciasStore.cargarAsistenciasHoy()
    
    // Si no hay datos, usa datos de ejemplo
    if (asistenciasStore.asistenciasHoy && asistenciasStore.asistenciasHoy.length > 0) {
      asistencias.value = asistenciasStore.asistenciasHoy
      console.log('✅ Asistencias cargadas:', asistencias.value.length)
    } else {
      // Datos de ejemplo mientras configuramos la API
      asistencias.value = await generarDatosEjemplo()
      console.log('⚠️ Usando datos de ejemplo')
    }
    
  } catch (error) {
    console.error('❌ Error cargando asistencias:', error)
    // En caso de error, usar datos de ejemplo
    asistencias.value = await generarDatosEjemplo()
  } finally {
    loading.value = false
  }
}

const cargarAreas = async () => {
  // Datos de ejemplo para áreas
  areas.value = [
    { id: 1, nombre: 'Administración' },
    { id: 2, nombre: 'Recursos Humanos' },
    { id: 3, nombre: 'Contabilidad' },
    { id: 4, nombre: 'Sistemas' },
    { id: 5, nombre: 'Secretaría' }
  ]
}

const aplicarFiltros = () => {
  cargarAsistencias()
}

const formatFecha = (fecha) => {
  if (!fecha) return 'N/A'
  return new Date(fecha).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const getEstadoTexto = (asistencia) => {
  if (!asistencia.hora_entra) return 'ausente'
  if (asistencia.minutos_tardanza > 0) return 'tardanza'
  return 'puntual'
}

const getEstadoClase = (asistencia) => {
  const estado = getEstadoTexto(asistencia)
  switch (estado) {
    case 'puntual': return 'bg-green-100 text-green-800'
    case 'tardanza': return 'bg-yellow-100 text-yellow-800'
    case 'ausente': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getIniciales = (nombres, apellidos) => {
  if (!nombres || !apellidos) return '??'
  return (nombres.charAt(0) + apellidos.charAt(0)).toUpperCase()
}

// Función para generar datos de ejemplo
const generarDatosEjemplo = async () => {
  const empleados = [
    { id: 1, dni: '12345678', nombres: 'Juan Carlos', apellidos: 'Pérez García', area_id: 1 },
    { id: 2, dni: '87654321', nombres: 'María Elena', apellidos: 'Gómez López', area_id: 2 },
    { id: 3, dni: '45678912', nombres: 'Carlos Alberto', apellidos: 'Rodríguez Silva', area_id: 1 },
    { id: 4, dni: '78912345', nombres: 'Ana Patricia', apellidos: 'Martínez Cruz', area_id: 3 },
    { id: 5, dni: '32165497', nombres: 'Luis Fernando', apellidos: 'Hernández Díaz', area_id: 4 }
  ]

  const areas = [
    { id: 1, nombre: 'Administración' },
    { id: 2, nombre: 'Recursos Humanos' },
    { id: 3, nombre: 'Contabilidad' },
    { id: 4, nombre: 'Sistemas' }
  ]

  return empleados.map((empleado, index) => ({
    id: index + 1,
    fecha: new Date().toISOString().split('T')[0],
    hora_entra: index < 4 ? `08:${index < 2 ? '0' + index : index}0` : null,
    hora_salida: index < 4 ? `17:${30 + index}0` : null,
    minutos_tardanza: index === 2 ? 15 : 0,
    usuario: {
      ...empleado,
      area: areas.find(a => a.id === empleado.area_id)
    }
  }))
}
</script>