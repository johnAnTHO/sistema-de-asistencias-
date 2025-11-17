<template>
  <AppLayout>
    <div class="container mx-auto px-4 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Administración de Practicantes</h1>
        <p class="text-gray-600">Gestiona los practicantes del sistema</p>
      </div>

      <!-- Estadísticas -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 bg-blue-100 rounded-lg">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Practicantes</p>
              <p class="text-2xl font-semibold text-gray-900">{{ practicantes.length }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 bg-green-100 rounded-lg">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Activos Hoy</p>
              <p class="text-2xl font-semibold text-gray-900">{{ practicantesActivos }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Barra de acciones -->
      <div class="flex justify-between items-center mb-6">
        <div class="flex space-x-4">
          <button 
            @click="mostrarFormulario = true"
            class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Agregar Practicante
          </button>
        </div>
      </div>

      <!-- Formulario para agregar/editar practicante -->
      <div v-if="mostrarFormulario" class="mb-6 bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-xl font-semibold mb-4">{{ practicanteEditando ? 'Editar' : 'Nuevo' }} Practicante</h2>
        <form @submit.prevent="guardarPracticante" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
              <input 
                v-model="formulario.nombre" 
                type="text" 
                required 
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Juan Pérez"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                v-model="formulario.email" 
                type="email" 
                required 
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: juan@email.com"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Carrera</label>
              <input 
                v-model="formulario.carrera" 
                type="text" 
                required 
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Ingeniería de Sistemas"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Universidad</label>
              <input 
                v-model="formulario.universidad" 
                type="text" 
                required 
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Universidad Nacional"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <input 
                v-model="formulario.password" 
                type="password" 
                :required="!practicanteEditando"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <select 
                v-model="formulario.activo" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option :value="true">Activo</option>
                <option :value="false">Inactivo</option>
              </select>
            </div>
          </div>
          <div class="flex justify-end space-x-2 pt-4">
            <button 
              type="button" 
              @click="cancelarEdicion" 
              class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
              :disabled="practicantesStore.loading"
            >
              <LoadingSpinner v-if="practicantesStore.loading" class="w-4 h-4 mr-2" />
              {{ practicanteEditando ? 'Actualizar' : 'Guardar' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Lista de practicantes -->
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div v-if="practicantesStore.loading" class="flex justify-center py-8">
          <LoadingSpinner size="lg" />
        </div>

        <div v-else-if="practicantes.length === 0" class="text-center py-8 text-gray-500">
          No hay practicantes registrados
        </div>

        <table v-else class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Practicante
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Información Académica
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
            <tr v-for="practicante in practicantes" :key="practicante.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span class="text-blue-600 font-medium">
                      {{ practicante.nombre?.charAt(0) || 'P' }}
                    </span>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ practicante.nombre }}</div>
                    <div class="text-sm text-gray-500">{{ practicante.email }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900">{{ practicante.carrera }}</div>
                <div class="text-sm text-gray-500">{{ practicante.universidad }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                      :class="practicante.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                  {{ practicante.activo ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button 
                  @click="editarPracticante(practicante)"
                  class="text-blue-600 hover:text-blue-900 mr-3"
                >
                  Editar
                </button>
                <button 
                  @click="eliminarPracticante(practicante.id)"
                  class="text-red-600 hover:text-red-900"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { usePracticantesStore } from '../stores/practicantes'
import AppLayout from '../components/ui/AppLayout.vue'
import LoadingSpinner from '../components/ui/LoadingSpinner.vue'

const practicantesStore = usePracticantesStore()

const mostrarFormulario = ref(false)
const practicanteEditando = ref(null)

const formulario = reactive({
  nombre: '',
  email: '',
  carrera: '',
  universidad: '',
  password: '',
  activo: true,
  role: 'practicante'
})

// Computed para estadísticas
const practicantes = computed(() => practicantesStore.practicantes)
const practicantesActivos = computed(() => 
  practicantes.value.filter(p => p.activo).length
)

const cargarPracticantes = () => {
  practicantesStore.cargarPracticantes()
}

const guardarPracticante = async () => {
  try {
    if (practicanteEditando.value) {
      await practicantesStore.actualizarPracticante(practicanteEditando.value.id, formulario)
    } else {
      await practicantesStore.agregarPracticante(formulario)
    }
    cancelarEdicion()
    cargarPracticantes()
  } catch (error) {
    // El error se maneja en el store
  }
}

const editarPracticante = (practicante) => {
  practicanteEditando.value = practicante
  formulario.nombre = practicante.nombre
  formulario.email = practicante.email
  formulario.carrera = practicante.carrera
  formulario.universidad = practicante.universidad
  formulario.activo = practicante.activo
  // No cargamos la contraseña por seguridad
  mostrarFormulario.value = true
}

const eliminarPracticante = async (id) => {
  if (confirm('¿Estás seguro de eliminar este practicante?')) {
    try {
      await practicantesStore.eliminarPracticante(id)
      cargarPracticantes()
    } catch (error) {
      // El error se maneja en el store
    }
  }
}

const cancelarEdicion = () => {
  practicanteEditando.value = null
  mostrarFormulario.value = false
  Object.assign(formulario, {
    nombre: '',
    email: '',
    carrera: '',
    universidad: '',
    password: '',
    activo: true,
    role: 'practicante'
  })
}

onMounted(() => {
  cargarPracticantes()
})
</script>