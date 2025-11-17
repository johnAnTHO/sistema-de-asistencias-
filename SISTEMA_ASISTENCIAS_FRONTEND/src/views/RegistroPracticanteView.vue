<template>
  <div class="p-6">
    <div class="max-w-4xl mx-auto">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Registro de Nuevo Practicante</h1>
        <router-link 
          to="/practicantes"
          class="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
        >
          Volver a Lista
        </router-link>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6">
        <form @submit.prevent="registrarPracticante" class="space-y-6">
          <!-- Información Personal -->
          <div>
            <h3 class="text-lg font-medium mb-4">Información Personal</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">DNI *</label>
                <input
                  v-model="form.dni"
                  type="text"
                  required
                  class="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Ingrese DNI"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nombres *</label>
                <input
                  v-model="form.nombres"
                  type="text"
                  required
                  class="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Ingrese nombres"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Apellidos *</label>
                <input
                  v-model="form.apellidos"
                  type="text"
                  required
                  class="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Ingrese apellidos"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  v.model="form.email"
                  type="email"
                  required
                  class="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Ingrese email"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <input
                  v.model="form.telefono"
                  type="tel"
                  class="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Ingrese teléfono"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Contraseña Temporal *</label>
                <input
                  v.model="form.password"
                  type="password"
                  required
                  class="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Ingrese contraseña temporal"
                >
              </div>
            </div>
          </div>

          <!-- Información de Prácticas -->
          <div>
            <h3 class="text-lg font-medium mb-4">Información de Prácticas</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Área *</label>
                <select
                  v.model="form.area_id"
                  required
                  class="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Seleccionar área</option>
                  <option v-for="area in areas" :key="area.id" :value="area.id">
                    {{ area.nombre }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio *</label>
                <input
                  v.model="form.fecha_inicio_practicas"
                  type="date"
                  required
                  class="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Fecha Fin</label>
                <input
                  v.model="form.fecha_fin_practicas"
                  type="date"
                  class="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                >
              </div>
            </div>
          </div>

          <!-- Botones -->
          <div class="flex justify-end space-x-4 pt-6 border-t">
            <router-link 
              to="/practicantes"
              class="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700"
            >
              Cancelar
            </router-link>
            <button
              type="submit"
              :disabled="loading"
              class="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ loading ? 'Registrando...' : 'Registrar Practicante' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = ref({
  dni: '',
  nombres: '',
  apellidos: '',
  email: '',
  telefono: '',
  password: '',
  area_id: '',
  fecha_inicio_practicas: '',
  fecha_fin_practicas: '',
  rol: 'practicante'
})

const areas = ref([])
const loading = ref(false)

onMounted(async () => {
  await cargarAreas()
})

const cargarAreas = async () => {
  areas.value = [
    { id: 1, nombre: 'Administración' },
    { id: 2, nombre: 'Recursos Humanos' },
    { id: 3, nombre: 'Contabilidad' },
    { id: 4, nombre: 'Sistemas' }
  ]
}

const registrarPracticante = async () => {
  try {
    loading.value = true
    console.log('Registrando practicante:', form.value)
    
    // Aquí iría la llamada a tu API
    // await practicanteService.registrarPracticante(form.value)
    
    // Simular registro exitoso
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    console.log('Practicante registrado exitosamente')
    router.push('/practicantes')
    
  } catch (error) {
    console.error('Error registrando practicante:', error)
    alert('Error al registrar el practicante: ' + error.message)
  } finally {
    loading.value = false
  }
}
</script>