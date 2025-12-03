<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Gestión de Practicantes</h1>
      <div class="flex space-x-2">
        <button 
          @click="generarReporte"
          class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          Generar Reporte PDF
        </button>
        <router-link 
          to="/registro-practicante"
          class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          Nuevo Practicante
        </router-link>
      </div>
    </div>

    <!-- Filtros -->
    <div class="bg-white p-4 rounded-lg shadow-md mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Área</label>
          <select 
            v-model="filtroArea"
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
            v-model="filtroEstado"
            class="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Todos</option>
            <option value="activo">Activo</option>
            <option value="inactivo">Culminado</option>
          </select>
        </div>
        <div class="flex items-end">
          <button 
            @click="aplicarFiltros"
            class="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Aplicar Filtros
          </button>
        </div>
      </div>
    </div>

    <!-- Lista de practicantes -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Practicante
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                DNI
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Área
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha Inicio
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha Fin
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="loading">
              <td colspan="7" class="px-6 py-4 text-center">
                <div class="flex justify-center items-center">
                  <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                  <span class="ml-2">Cargando practicantes...</span>
                </div>
              </td>
            </tr>
            <tr v-else-if="practicantesFiltrados.length === 0">
              <td colspan="7" class="px-6 py-4 text-center text-gray-500">
                No se encontraron practicantes
              </td>
            </tr>
            <tr 
              v-else 
              v-for="practicante in practicantesFiltrados" 
              :key="practicante.id"
              class="hover:bg-gray-50 transition-colors duration-200"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span class="text-indigo-600 font-medium text-sm">
                      {{ getIniciales(practicante.nombres, practicante.apellidos) }}
                    </span>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">
                      {{ practicante.nombres }} {{ practicante.apellidos }}
                    </div>
                    <div class="text-sm text-gray-500">
                      {{ practicante.email }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ practicante.dni }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ practicante.area?.nombre || 'Sin área' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatFecha(practicante.fecha_inicio_practicas) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatFecha(practicante.fecha_fin_practicas) || '--' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  :class="practicante.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                >
                  {{ practicante.activo ? 'Activo' : 'Culminado' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button 
                  @click="editarPracticante(practicante)"
                  class="text-indigo-600 hover:text-indigo-900 mr-3"
                >
                  Editar
                </button>
                <button 
                  v-if="practicante.activo"
                  @click="eliminarPracticante(practicante)"
                  class="text-red-600 hover:text-red-900"
                >
                  Culminar
                </button>
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

const practicantes = ref([])
const areas = ref([])
const loading = ref(false)
const filtroArea = ref('')
const filtroEstado = ref('')

const practicantesFiltrados = computed(() => {
  let filtered = practicantes.value

  if (filtroArea.value) {
    filtered = filtered.filter(p => p.area_id == filtroArea.value)
  }

  if (filtroEstado.value) {
    if (filtroEstado.value === 'activo') {
      filtered = filtered.filter(p => p.activo)
    } else {
      filtered = filtered.filter(p => !p.activo)
    }
  }

  return filtered
})

onMounted(async () => {
  await cargarPracticantes()
  await cargarAreas()
})

const cargarPracticantes = async () => {
  try {
    loading.value = true
    // Aquí iría la llamada a tu API
    // practicantes.value = await practicanteService.getPracticantes()
    
    // Datos de ejemplo
    practicantes.value = [
      {
        id: 1,
        dni: '12345678',
        nombres: 'Juan Carlos',
        apellidos: 'Pérez García',
        email: 'juan@example.com',
        area_id: 1,
        fecha_inicio_practicas: '2024-01-15',
        fecha_fin_practicas: '2024-06-15',
        activo: true
      },
      {
        id: 2,
        dni: '87654321',
        nombres: 'María Elena',
        apellidos: 'Gómez López',
        email: 'maria@example.com',
        area_id: 2,
        fecha_inicio_practicas: '2024-02-01',
        fecha_fin_practicas: null,
        activo: true
      }
    ]
  } catch (error) {
    console.error('Error cargando practicantes:', error)
  } finally {
    loading.value = false
  }
}

const cargarAreas = async () => {
  areas.value = [
    { id: 1, nombre: 'Administración' },
    { id: 2, nombre: 'Recursos Humanos' },
    { id: 3, nombre: 'Contabilidad' },
    { id: 4, nombre: 'Sistemas' }
  ]
}

const aplicarFiltros = () => {
  cargarPracticantes()
}

const generarReporte = () => {
  console.log('Generando reporte PDF...')
  // Implementar generación de PDF
}

const editarPracticante = (practicante) => {
  console.log('Editando practicante:', practicante)
  // Navegar a edición o abrir modal
}

const eliminarPracticante = async (practicante) => {
  if (confirm(`¿Está seguro de culminar las prácticas de ${practicante.nombres} ${practicante.apellidos}?`)) {
    try {
      // await practicanteService.eliminarPracticante(practicante.id)
      await cargarPracticantes()
      console.log('Practicante culminado exitosamente')
    } catch (error) {
      console.error('Error culminando practicante:', error)
    }
  }
}

const formatFecha = (fecha) => {
  if (!fecha) return '--'
  return new Date(fecha).toLocaleDateString('es-ES')
}

const getIniciales = (nombres, apellidos) => {
  if (!nombres || !apellidos) return '??'
  return (nombres.charAt(0) + apellidos.charAt(0)).toUpperCase()
}
</script>