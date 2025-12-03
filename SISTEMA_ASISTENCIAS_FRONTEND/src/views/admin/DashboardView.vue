<!-- src/views/admin/DashboardView.vue - VERSIÓN MEJORADA -->
<template>
  <div class="admin-dashboard">
    <!-- Header mejorado -->
    <div class="dashboard-header">
      <div>
        <h1 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <i class="fas fa-tachometer-alt text-blue-500"></i>
          Panel de Control
        </h1>
        <p class="text-gray-600 mt-1">Resumen general del sistema de asistencias</p>
      </div>
      
      <div class="flex items-center gap-4">
        <!-- Fecha actual -->
        <div class="hidden md:block bg-white px-4 py-2 rounded-lg shadow-sm border">
          <div class="text-sm text-gray-500">Hoy es</div>
          <div class="font-medium">{{ fechaActual }}</div>
        </div>
        
        <!-- Botón acciones rápidas -->
        <div class="relative group">
          <button class="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2.5 rounded-lg font-medium flex items-center gap-2 shadow hover:shadow-md transition">
            <i class="fas fa-bolt"></i>
            Acciones Rápidas
            <i class="fas fa-chevron-down text-xs"></i>
          </button>
          
          <!-- Dropdown -->
          <div class="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
            <a href="#" class="block px-4 py-3 hover:bg-blue-50 text-gray-700 flex items-center gap-3">
              <i class="fas fa-user-plus text-blue-500 w-5"></i>
              <div>
                <div class="font-medium">Nuevo Practicante</div>
                <div class="text-xs text-gray-500">Registrar nuevo</div>
              </div>
            </a>
            <a href="#" class="block px-4 py-3 hover:bg-blue-50 text-gray-700 flex items-center gap-3">
              <i class="fas fa-file-export text-green-500 w-5"></i>
              <div>
                <div class="font-medium">Exportar Reporte</div>
                <div class="text-xs text-gray-500">PDF / Excel</div>
              </div>
            </a>
            <a href="#" class="block px-4 py-3 hover:bg-blue-50 text-gray-700 flex items-center gap-3">
              <i class="fas fa-cog text-purple-500 w-5"></i>
              <div>
                <div class="font-medium">Configuración</div>
                <div class="text-xs text-gray-500">Ajustes del sistema</div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Estadísticas en cards mejoradas -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- Card 1 -->
      <div class="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg border border-blue-100 p-6 transform hover:-translate-y-1 transition-transform duration-200">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm font-medium text-blue-600 mb-1">Total Practicantes</p>
            <p class="text-3xl font-bold text-gray-800">{{ stats.totalPracticantes }}</p>
            <div class="flex items-center gap-1 mt-2">
              <i class="fas fa-arrow-up text-green-500 text-xs"></i>
              <span class="text-xs text-green-600">+12% este mes</span>
            </div>
          </div>
          <div class="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
            <i class="fas fa-users text-blue-600 text-xl"></i>
          </div>
        </div>
      </div>

      <!-- Card 2 -->
      <div class="bg-gradient-to-br from-white to-green-50 rounded-2xl shadow-lg border border-green-100 p-6 transform hover:-translate-y-1 transition-transform duration-200">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm font-medium text-green-600 mb-1">Presentes Hoy</p>
            <p class="text-3xl font-bold text-gray-800">{{ stats.asistenciasHoy }}</p>
            <div class="flex items-center gap-1 mt-2">
              <i class="fas fa-arrow-up text-green-500 text-xs"></i>
              <span class="text-xs text-green-600">+5% vs ayer</span>
            </div>
          </div>
          <div class="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
            <i class="fas fa-user-check text-green-600 text-xl"></i>
          </div>
        </div>
      </div>

      <!-- Card 3 -->
      <div class="bg-gradient-to-br from-white to-yellow-50 rounded-2xl shadow-lg border border-yellow-100 p-6 transform hover:-translate-y-1 transition-transform duration-200">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm font-medium text-yellow-600 mb-1">Tardanzas Hoy</p>
            <p class="text-3xl font-bold text-gray-800">{{ stats.tardanzasHoy }}</p>
            <div class="flex items-center gap-1 mt-2">
              <i class="fas fa-arrow-down text-red-500 text-xs"></i>
              <span class="text-xs text-red-600">-3% vs ayer</span>
            </div>
          </div>
          <div class="w-12 h-12 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-xl flex items-center justify-center">
            <i class="fas fa-clock text-yellow-600 text-xl"></i>
          </div>
        </div>
      </div>

      <!-- Card 4 -->
      <div class="bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-lg border border-purple-100 p-6 transform hover:-translate-y-1 transition-transform duration-200">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm font-medium text-purple-600 mb-1">Puntualidad</p>
            <p class="text-3xl font-bold text-gray-800">{{ stats.puntualidad }}</p>
            <div class="flex items-center gap-1 mt-2">
              <i class="fas fa-arrow-up text-green-500 text-xs"></i>
              <span class="text-xs text-green-600">+2% vs ayer</span>
            </div>
          </div>
          <div class="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
            <i class="fas fa-chart-line text-purple-600 text-xl"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Sección de Acciones Principales -->
    <div class="mb-8">
      <h2 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <i class="fas fa-rocket text-blue-500"></i>
        Acciones Principales
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Acción 1 -->
        <router-link to="/admin/practicantes" class="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md hover:border-blue-300 transition-all duration-200 group">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <i class="fas fa-users text-blue-600 text-lg"></i>
            </div>
            <div>
              <h3 class="font-semibold text-gray-800">Gestionar Practicantes</h3>
              <p class="text-sm text-gray-500 mt-1">Ver y administrar todos</p>
            </div>
          </div>
        </router-link>

        <!-- Acción 2 -->
        <router-link to="/admin/registro-practicante" class="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md hover:border-green-300 transition-all duration-200 group">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <i class="fas fa-user-plus text-green-600 text-lg"></i>
            </div>
            <div>
              <h3 class="font-semibold text-gray-800">Nuevo Practicante</h3>
              <p class="text-sm text-gray-500 mt-1">Agregar al sistema</p>
            </div>
          </div>
        </router-link>

        <!-- Acción 3 -->
        <router-link to="/admin/reportes" class="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md hover:border-purple-300 transition-all duration-200 group">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <i class="fas fa-chart-bar text-purple-600 text-lg"></i>
            </div>
            <div>
              <h3 class="font-semibold text-gray-800">Generar Reportes</h3>
              <p class="text-sm text-gray-500 mt-1">Estadísticas y análisis</p>
            </div>
          </div>
        </router-link>

        <!-- Acción 4 -->
        <router-link to="/admin/registro-manual" class="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md hover:border-orange-300 transition-all duration-200 group">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <i class="fas fa-edit text-orange-600 text-lg"></i>
            </div>
            <div>
              <h3 class="font-semibold text-gray-800">Registro Manual</h3>
              <p class="text-sm text-gray-500 mt-1">Para casos especiales</p>
            </div>
          </div>
        </router-link>
      </div>
    </div>

    <!-- Sección inferior: Asistencias Recientes y Gráfico -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Asistencias Recientes -->
      <div class="lg:col-span-2 bg-white rounded-xl shadow-lg border">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <i class="fas fa-history text-blue-500"></i>
              Asistencias Recientes
            </h2>
            <router-link to="/admin/asistencias" class="text-blue-500 hover:text-blue-600 text-sm font-medium flex items-center gap-1">
              Ver todas
              <i class="fas fa-arrow-right text-xs"></i>
            </router-link>
          </div>
          
          <!-- Tabla mejorada -->
          <div class="overflow-x-auto">
            <table class="min-w-full">
              <thead>
                <tr class="bg-gray-50">
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-l-lg">Practicante</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hora</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Turno</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-r-lg">Estado</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="asistencia in recentAsistencias" :key="asistencia.id" class="hover:bg-gray-50 transition-colors">
                  <td class="px-4 py-3">
                    <div class="flex items-center">
                      <div class="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mr-3">
                        <i class="fas fa-user text-blue-600 text-sm"></i>
                      </div>
                      <div>
                        <div class="font-medium text-gray-900">{{ asistencia.nombres }} {{ asistencia.apellidos }}</div>
                        <div class="text-xs text-gray-500">{{ asistencia.dni }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-900">
                    {{ formatDateTime(asistencia.fecha_entrada) }}
                  </td>
                  <td class="px-4 py-3">
                    <span class="px-3 py-1 text-xs font-medium rounded-full" 
                          :class="asistencia.turno === 'mañana' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'">
                      {{ asistencia.turno }}
                    </span>
                  </td>
                  <td class="px-4 py-3">
                    <div class="flex items-center">
                      <span v-if="asistencia.tardanza" 
                            class="px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 flex items-center gap-1">
                        <i class="fas fa-clock"></i>
                        Tardanza
                      </span>
                      <span v-else 
                            class="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 flex items-center gap-1">
                        <i class="fas fa-check-circle"></i>
                        Puntual
                      </span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- Si no hay datos -->
          <div v-if="recentAsistencias.length === 0" class="text-center py-12">
            <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i class="fas fa-clock text-gray-400 text-xl"></i>
            </div>
            <h3 class="text-gray-700 font-medium mb-1">No hay asistencias hoy</h3>
            <p class="text-gray-500 text-sm">Los registros aparecerán aquí</p>
          </div>
        </div>
      </div>

      <!-- Gráfico de Estadísticas -->
      <div class="bg-white rounded-xl shadow-lg border p-6">
        <h2 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <i class="fas fa-chart-pie text-purple-500"></i>
          Estadísticas del Día
        </h2>
        
        <!-- Gráfico circular simple -->
        <div class="relative w-40 h-40 mx-auto mb-6">
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="text-center">
              <div class="text-2xl font-bold text-gray-800">{{ stats.puntualidad }}</div>
              <div class="text-sm text-gray-500">Puntualidad</div>
            </div>
          </div>
          <svg class="w-full h-full" viewBox="0 0 100 100">
            <!-- Fondo -->
            <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" stroke-width="10"/>
            <!-- Progreso -->
            <circle cx="50" cy="50" r="45" fill="none" stroke="#3b82f6" stroke-width="10" 
                    stroke-linecap="round" :stroke-dasharray="`${puntualidadNumero * 2.83} 283`" transform="rotate(-90 50 50)"/>
          </svg>
        </div>
        
        <!-- Leyenda -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-green-500"></div>
              <span class="text-sm text-gray-700">Puntuales</span>
            </div>
            <span class="font-medium">{{ stats.asistenciasHoy - stats.tardanzasHoy }}</span>
          </div>
          
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span class="text-sm text-gray-700">Tardanzas</span>
            </div>
            <span class="font-medium">{{ stats.tardanzasHoy }}</span>
          </div>
          
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-red-500"></div>
              <span class="text-sm text-gray-700">Faltas</span>
            </div>
            <span class="font-medium">{{ stats.totalPracticantes - stats.asistenciasHoy }}</span>
          </div>
        </div>
        
        <!-- Botón ver detalles -->
        <button class="w-full mt-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white py-2.5 rounded-lg font-medium hover:shadow-md transition flex items-center justify-center gap-2">
          <i class="fas fa-chart-line"></i>
          Ver Estadísticas Completas
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()

// Datos
const stats = ref({
  totalPracticantes: 45,
  asistenciasHoy: 38,
  tardanzasHoy: 7,
  puntualidad: '82%'
})

const recentAsistencias = ref([])
const loadingStats = ref(true)

// Computed
const fechaActual = computed(() => {
  return new Date().toLocaleDateString('es-PE', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
})

const puntualidadNumero = computed(() => {
  return parseInt(stats.value.puntualidad)
})

// Métodos
const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleTimeString('es-PE', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const loadDashboardData = async () => {
  try {
    loadingStats.value = true
    
    // Simular carga
    setTimeout(() => {
      recentAsistencias.value = [
        {
          id: 1,
          nombres: 'Juan',
          apellidos: 'Pérez',
          dni: '76543210',
          fecha_entrada: new Date().toISOString(),
          turno: 'mañana',
          tardanza: true
        },
        {
          id: 2,
          nombres: 'María',
          apellidos: 'Gómez',
          dni: '87654321',
          fecha_entrada: new Date().toISOString(),
          turno: 'tarde',
          tardanza: false
        },
        {
          id: 3,
          nombres: 'Carlos',
          apellidos: 'Rodríguez',
          dni: '98765432',
          fecha_entrada: new Date().toISOString(),
          turno: 'mañana',
          tardanza: false
        }
      ]
      
      loadingStats.value = false
    }, 800)
    
  } catch (error) {
    console.error('Error cargando dashboard:', error)
    loadingStats.value = false
  }
}

onMounted(() => {
  loadDashboardData()
})
</script>

<style scoped>
.admin-dashboard {
  @apply p-6 max-w-7xl mx-auto;
}

.dashboard-header {
  @apply flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4;
}

/* Animaciones */
.group:hover .group-hover\:scale-110 {
  transform: scale(1.1);
}

.group:hover .group-hover\:opacity-100 {
  opacity: 1;
}

.group:hover .group-hover\:visible {
  visibility: visible;
}

/* Scroll personalizado */
.overflow-x-auto::-webkit-scrollbar {
  height: 6px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  @apply bg-gray-100 rounded;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  @apply bg-gray-300 rounded;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-400;
}
</style>