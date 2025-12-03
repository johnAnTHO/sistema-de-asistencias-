<!-- src/views/practicante/DashboardView.vue -->
<template>
  <AppLayout>
    <div class="practicante-dashboard">
      <!-- Header -->
      <div class="dashboard-header">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">Mi Dashboard</h1>
          <p class="text-gray-600">Bienvenido de vuelta, {{ authStore.userName }}</p>
        </div>
        <div class="header-actions">
          <span class="practicante-badge">
            <i class="fas fa-user-graduate mr-1"></i>
            Practicante
          </span>
        </div>
      </div>

      <!-- Mi Resumen Mensual -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div class="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">Mi Resumen del Mes</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard 
              title="Días Registrados"
              :value="resumenPersonal.diasRegistrados"
              icon="calendar"
              color="blue"
              small
            />
            <StatCard 
              title="Días Puntuales"
              :value="resumenPersonal.diasPuntuales"
              icon="check-circle"
              color="green"
              small
            />
            <StatCard 
              title="Tardanzas"
              :value="resumenPersonal.tardanzas"
              icon="clock"
              color="yellow"
              small
            />
            <StatCard 
              title="Faltas"
              :value="resumenPersonal.faltas"
              icon="times-circle"
              color="red"
              small
            />
          </div>
          
          <!-- Estadísticas adicionales -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="text-sm text-gray-600">Minutos totales de tardanza</div>
              <div class="text-2xl font-bold text-gray-800">{{ resumenPersonal.minutosTardanza }} min</div>
            </div>
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="text-sm text-gray-600">Porcentaje de puntualidad</div>
              <div class="text-2xl font-bold text-green-600">{{ resumenPersonal.porcentajePuntualidad }}</div>
            </div>
          </div>
        </div>

        <!-- Acciones Rápidas -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">Acciones Rápidas</h2>
          <div class="space-y-4">
            <button 
              @click="registrarEntrada"
              :disabled="registrando"
              class="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center"
            >
              <i class="fas fa-sign-in-alt mr-2"></i>
              {{ registrando ? 'Registrando...' : 'Registrar Entrada' }}
            </button>
            
            <button 
              @click="registrarSalida"
              :disabled="registrando"
              class="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center"
            >
              <i class="fas fa-sign-out-alt mr-2"></i>
              {{ registrando ? 'Registrando...' : 'Registrar Salida' }}
            </button>
            
            <router-link 
              to="/practicante/asistencias"
              class="block w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg text-center transition duration-200 flex items-center justify-center"
            >
              <i class="fas fa-history mr-2"></i>
              Ver Mis Asistencias
            </router-link>
            
            <router-link 
              to="/perfil"
              class="block w-full bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-lg text-center transition duration-200 flex items-center justify-center"
            >
              <i class="fas fa-user mr-2"></i>
              Mi Perfil
            </router-link>
          </div>

          <!-- Estado actual -->
          <div class="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 class="font-semibold text-blue-800 mb-2">Estado Actual</h3>
            <p class="text-blue-700 text-sm">
              <i class="fas fa-info-circle mr-1"></i>
              {{ estadoActual }}
            </p>
            <p class="text-blue-600 text-xs mt-1">
              Hora actual: {{ horaActual }}
            </p>
          </div>
        </div>
      </div>

      <!-- Mis Asistencias Recientes -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold text-gray-800">Mis Asistencias Recientes</h2>
          <router-link to="/practicante/asistencias" class="text-blue-500 hover:text-blue-600 text-sm font-medium">
            Ver historial completo
          </router-link>
        </div>
        
        <div v-if="misAsistencias.length > 0" class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Entrada</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Salida</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Turno</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Método</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="asistencia in misAsistencias" :key="asistencia.id" class="hover:bg-gray-50">
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {{ formatDate(asistencia.fecha) }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {{ asistencia.hora_entrada || '--:--' }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {{ asistencia.hora_salida || '--:--' }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <span class="px-2 py-1 text-xs font-semibold rounded-full" 
                        :class="asistencia.turno === 'mañana' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'">
                    {{ asistencia.turno }}
                  </span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <span v-if="asistencia.tardanza" class="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                    Tardanza ({{ asistencia.minutos_tardanza }} min)
                  </span>
                  <span v-else-if="asistencia.hora_entrada" class="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    Puntual
                  </span>
                  <span v-else class="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                    No registrado
                  </span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  <span v-if="asistencia.metodo === 'huella'" class="flex items-center">
                    <i class="fas fa-fingerprint mr-1"></i> Huella
                  </span>
                  <span v-else-if="asistencia.metodo === 'dni'" class="flex items-center">
                    <i class="fas fa-id-card mr-1"></i> DNI
                  </span>
                  <span v-else class="flex items-center">
                    <i class="fas fa-minus mr-1"></i> --
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="text-center py-8 text-gray-500">
          <i class="fas fa-clock text-3xl mb-3"></i>
          <p>No hay asistencias registradas</p>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../../stores/auth'
import AppLayout from '../../components/ui/AppLayout.vue'
import StatCard from '../../components/ui/StatCard.vue'

const authStore = useAuthStore()

const resumenPersonal = ref({
  diasRegistrados: 22,
  diasPuntuales: 18,
  tardanzas: 4,
  faltas: 2,
  minutosTardanza: 45,
  porcentajePuntualidad: '82%'
})

const misAsistencias = ref([])
const registrando = ref(false)

const horaActual = computed(() => {
  return new Date().toLocaleTimeString('es-ES', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
})

const estadoActual = computed(() => {
  const hour = new Date().getHours()
  if (hour >= 8 && hour < 12) return 'Turno mañana en curso'
  if (hour >= 14 && hour < 17) return 'Turno tarde en curso'
  return 'Fuera de horario de turno'
})

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-ES')
}

const registrarEntrada = async () => {
  try {
    registrando.value = true
    console.log('📥 Registrando entrada...')
    // Aquí iría la lógica para registrar entrada
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simular API call
    alert('✅ Entrada registrada correctamente')
  } catch (error) {
    console.error('Error registrando entrada:', error)
    alert('❌ Error al registrar entrada')
  } finally {
    registrando.value = false
  }
}

const registrarSalida = async () => {
  try {
    registrando.value = true
    console.log('📤 Registrando salida...')
    // Aquí iría la lógica para registrar salida
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simular API call
    alert('✅ Salida registrada correctamente')
  } catch (error) {
    console.error('Error registrando salida:', error)
    alert('❌ Error al registrar salida')
  } finally {
    registrando.value = false
  }
}

const loadDashboardData = async () => {
  try {
    console.log('🏠 Cargando dashboard practicante para:', authStore.userName)
    
    // Simular carga de datos
    misAsistencias.value = [
      {
        id: 1,
        fecha: new Date().toISOString(),
        hora_entrada: '08:00',
        hora_salida: '12:00',
        turno: 'mañana',
        tardanza: false,
        minutos_tardanza: 0,
        metodo: 'huella'
      },
      {
        id: 2,
        fecha: new Date(Date.now() - 86400000).toISOString(),
        hora_entrada: '08:15',
        hora_salida: '12:00',
        turno: 'mañana',
        tardanza: true,
        minutos_tardanza: 15,
        metodo: 'dni'
      }
    ]
    
  } catch (error) {
    console.error('Error cargando dashboard practicante:', error)
  }
}

onMounted(() => {
  loadDashboardData()
})
</script>

<style scoped>
.practicante-dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.practicante-badge {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
}
</style>