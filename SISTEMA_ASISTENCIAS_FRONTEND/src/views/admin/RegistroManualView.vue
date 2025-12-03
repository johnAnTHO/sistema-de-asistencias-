<!-- src/views/admin/RegistroManualView.vue -->
<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Registro Manual de Asistencias</h1>
    
    <div class="bg-white rounded-lg shadow p-6">
      <form @submit.prevent="registrarManual">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Seleccionar practicante -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Seleccionar Practicante *
            </label>
            <select v-model="form.practicante_id" class="w-full border rounded-lg p-3" required>
              <option value="">Seleccione un practicante</option>
              <option v-for="p in practicantes" :key="p.id" :value="p.id">
                {{ p.nombres }} {{ p.apellidos }} - {{ p.dni }}
              </option>
            </select>
          </div>
          
          <!-- Tipo de registro -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Registro *
            </label>
            <select v-model="form.tipo" class="w-full border rounded-lg p-3" required>
              <option value="entrada">Entrada</option>
              <option value="salida">Salida</option>
            </select>
          </div>
          
          <!-- Fecha y hora -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Fecha *
            </label>
            <input type="date" v-model="form.fecha" class="w-full border rounded-lg p-3" required>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Hora *
            </label>
            <input type="time" v-model="form.hora" class="w-full border rounded-lg p-3" required>
          </div>
          
          <!-- Motivo (opcional) -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Motivo del registro manual
            </label>
            <textarea v-model="form.motivo" rows="3" class="w-full border rounded-lg p-3" placeholder="Ej: Lector de huella descompuesto"></textarea>
          </div>
        </div>
        
        <!-- Botones -->
        <div class="flex justify-end gap-4 mt-8">
          <button type="button" @click="cancelar" class="px-6 py-2 border rounded-lg">
            Cancelar
          </button>
          <button type="submit" :disabled="loading" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            {{ loading ? 'Registrando...' : 'Registrar Asistencia' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = ref({
  practicante_id: '',
  tipo: 'entrada',
  fecha: new Date().toISOString().split('T')[0],
  hora: new Date().toTimeString().slice(0,5),
  motivo: ''
})

const practicantes = ref([])
const loading = ref(false)

// Cargar practicantes
onMounted(async () => {
  // Aquí cargarías los practicantes desde tu backend
  practicantes.value = [
    { id: 1, nombres: 'Juan', apellidos: 'Pérez', dni: '87654321' },
    { id: 2, nombres: 'María', apellidos: 'López', dni: '76543210' }
  ]
})

const registrarManual = async () => {
  try {
    loading.value = true
    console.log('📝 Registrando manualmente:', form.value)
    
    // Aquí llamarías a tu backend
    // await practicanteService.registrarAsistenciaManual(form.value)
    
    setTimeout(() => {
      alert('✅ Asistencia registrada manualmente')
      router.push('/admin/practicantes')
      loading.value = false
    }, 1000)
    
  } catch (error) {
    console.error('Error:', error)
    alert('❌ Error al registrar asistencia')
    loading.value = false
  }
}

const cancelar = () => {
  router.push('/admin/practicantes')
}
</script>