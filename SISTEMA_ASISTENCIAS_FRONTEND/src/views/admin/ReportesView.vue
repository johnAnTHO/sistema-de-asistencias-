<!-- src/views/admin/ReportesView.vue -->
<template>
  <div class="admin-reportes">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-800">Reportes y Estadísticas</h1>
      <p class="text-gray-600">Genera reportes detallados de asistencias</p>
    </div>

    <!-- Filtros -->
    <div class="bg-white rounded-xl shadow p-6 mb-8">
      <h2 class="text-lg font-semibold mb-4">Filtros del Reporte</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Fecha inicio -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio</label>
          <input type="date" v-model="filtros.fechaInicio" class="w-full border rounded-lg p-2">
        </div>
        
        <!-- Fecha fin -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Fecha Fin</label>
          <input type="date" v-model="filtros.fechaFin" class="w-full border rounded-lg p-2">
        </div>
        
        <!-- Área -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Área</label>
          <select v-model="filtros.areaId" class="w-full border rounded-lg p-2">
            <option value="">Todas las áreas</option>
            <option v-for="area in areas" :key="area.id" :value="area.id">
              {{ area.nombre }}
            </option>
          </select>
        </div>
        
        <!-- Tipo de reporte -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de Reporte</label>
          <select v-model="filtros.tipo" class="w-full border rounded-lg p-2">
            <option value="diario">Diario</option>
            <option value="semanal">Semanal</option>
            <option value="mensual">Mensual</option>
            <option value="anual">Anual</option>
          </select>
        </div>
      </div>
      
      <!-- Botones de acción -->
      <div class="flex gap-4 mt-6">
        <button 
          @click="aplicarFiltros" 
          class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Aplicar Filtros
        </button>
        
        <button 
          @click="limpiarFiltros" 
          class="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg"
        >
          Limpiar
        </button>
      </div>
    </div>

    <!-- Métodos de exportación -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <!-- Exportar PDF -->
      <div class="bg-red-50 border-2 border-red-200 rounded-xl p-6">
        <div class="flex items-center mb-4">
          <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
            <i class="fas fa-file-pdf text-red-600 text-xl"></i>
          </div>
          <div>
            <h3 class="font-bold text-lg text-red-800">Exportar a PDF</h3>
            <p class="text-red-600 text-sm">Reporte detallado en PDF</p>
          </div>
        </div>
        
        <button 
          @click="exportarPDF"
          :disabled="exportando"
          class="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-medium transition disabled:opacity-50"
        >
          <i class="fas fa-download mr-2"></i>
          {{ exportando ? 'Generando...' : 'Descargar PDF' }}
        </button>
      </div>

      <!-- Exportar Excel -->
      <div class="bg-green-50 border-2 border-green-200 rounded-xl p-6">
        <div class="flex items-center mb-4">
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
            <i class="fas fa-file-excel text-green-600 text-xl"></i>
          </div>
          <div>
            <h3 class="font-bold text-lg text-green-800">Exportar a Excel</h3>
            <p class="text-green-600 text-sm">Datos en formato Excel</p>
          </div>
        </div>
        
        <button 
          @click="exportarExcel"
          :disabled="exportando"
          class="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium transition disabled:opacity-50"
        >
          <i class="fas fa-download mr-2"></i>
          {{ exportando ? 'Generando...' : 'Descargar Excel' }}
        </button>
      </div>

      <!-- Estadísticas -->
      <div class="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
        <div class="flex items-center mb-4">
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
            <i class="fas fa-chart-bar text-blue-600 text-xl"></i>
          </div>
          <div>
            <h3 class="font-bold text-lg text-blue-800">Ver Estadísticas</h3>
            <p class="text-blue-600 text-sm">Gráficos y análisis</p>
          </div>
        </div>
        
        <button 
          @click="verEstadisticas"
          class="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition"
        >
          <i class="fas fa-chart-line mr-2"></i>
          Ver Gráficos
        </button>
      </div>
    </div>

    <!-- Vista previa de datos -->
    <div class="bg-white rounded-xl shadow p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold text-gray-800">Vista Previa</h2>
        <span class="text-sm text-gray-500">
          {{ datos.length }} registros encontrados
        </span>
      </div>
      
      <div v-if="datos.length > 0" class="overflow-x-auto">
        <table class="min-w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-sm font-medium text-gray-500">Practicante</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-gray-500">Fecha</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-gray-500">Entrada</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-gray-500">Salida</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-gray-500">Estado</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-gray-500">Área</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="item in datos" :key="item.id">
              <td class="px-4 py-3">
                <div class="flex items-center">
                  <div class="w-8 h-8 bg-gray-200 rounded-full mr-3"></div>
                  <div>
                    <p class="font-medium">{{ item.practicante }}</p>
                    <p class="text-sm text-gray-500">{{ item.dni }}</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3">{{ item.fecha }}</td>
              <td class="px-4 py-3">{{ item.entrada }}</td>
              <td class="px-4 py-3">{{ item.salida }}</td>
              <td class="px-4 py-3">
                <span :class="item.estado === 'Puntual' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'" 
                      class="px-2 py-1 rounded text-xs">
                  {{ item.estado }}
                </span>
              </td>
              <td class="px-4 py-3">
                <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                  {{ item.area }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div v-else class="text-center py-8 text-gray-500">
        <i class="fas fa-clipboard-list text-3xl mb-2"></i>
        <p>No hay datos para mostrar. Aplica filtros para generar reporte.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Filtros
const filtros = ref({
  fechaInicio: new Date().toISOString().split('T')[0],
  fechaFin: new Date().toISOString().split('T')[0],
  areaId: '',
  tipo: 'diario'
})

const areas = ref([
  { id: 1, nombre: 'Recursos Humanos' },
  { id: 2, nombre: 'Contabilidad' },
  { id: 3, nombre: 'Administración' },
  { id: 4, nombre: 'Tecnología' }
])

const datos = ref([])
const exportando = ref(false)

// Datos de ejemplo
const datosEjemplo = [
  { id: 1, practicante: 'Juan Pérez', dni: '87654321', fecha: '2024-01-15', entrada: '08:00', salida: '12:00', estado: 'Puntual', area: 'Recursos Humanos' },
  { id: 2, practicante: 'María López', dni: '76543210', fecha: '2024-01-15', entrada: '08:15', salida: '12:00', estado: 'Tardanza', area: 'Contabilidad' },
  { id: 3, practicante: 'Carlos Gómez', dni: '65432109', fecha: '2024-01-15', entrada: '08:05', salida: '12:00', estado: 'Puntual', area: 'Administración' }
]

const aplicarFiltros = () => {
  console.log('Aplicando filtros:', filtros.value)
  // Aquí llamarías a tu API
  datos.value = datosEjemplo
}

const limpiarFiltros = () => {
  filtros.value = {
    fechaInicio: new Date().toISOString().split('T')[0],
    fechaFin: new Date().toISOString().split('T')[0],
    areaId: '',
    tipo: 'diario'
  }
  datos.value = []
}

const exportarPDF = async () => {
  try {
    exportando.value = true
    console.log('Exportando PDF con filtros:', filtros.value)
    
    // Simular generación de PDF
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    alert('✅ Reporte PDF generado correctamente (simulación)')
    console.log('📄 PDF generado (en producción se descargaría)')
    
  } catch (error) {
    console.error('Error generando PDF:', error)
    alert('❌ Error al generar PDF')
  } finally {
    exportando.value = false
  }
}

const exportarExcel = async () => {
  try {
    exportando.value = true
    console.log('Exportando Excel con filtros:', filtros.value)
    
    // Simular generación de Excel
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    alert('✅ Reporte Excel generado correctamente (simulación)')
    console.log('📊 Excel generado (en producción se descargaría)')
    
  } catch (error) {
    console.error('Error generando Excel:', error)
    alert('❌ Error al generar Excel')
  } finally {
    exportando.value = false
  }
}

const verEstadisticas = () => {
  console.log('Mostrando estadísticas...')
  alert('Funcionalidad de gráficos en desarrollo')
}

// Cargar datos iniciales
onMounted(() => {
  aplicarFiltros()
})
</script>

<style scoped>
.admin-reportes {
  @apply p-6 max-w-7xl mx-auto;
}
</style>