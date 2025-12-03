<template>
  <form @submit.prevent="handleLogin" class="space-y-6">
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Sistema de Asistencias</h1>
      <p class="text-gray-600 mt-2">Municipalidad Distrital SJB</p>
    </div>

    <div>
      <label for="dni" class="block text-sm font-medium text-gray-700 mb-2">
        DNI
      </label>
      <input
        id="dni"
        v-model="form.dni"
        type="text"
        required
        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        placeholder="Ingrese su DNI"
        :disabled="loading"
      />
    </div>

    <div>
      <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
        Contraseña
      </label>
      <input
        id="password"
        v-model="form.password"
        type="password"
        required
        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        placeholder="Ingrese su contraseña"
        :disabled="loading"
      />
    </div>

    <button
      type="submit"
      :disabled="loading"
      class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
    >
      <span v-if="loading" class="flex items-center justify-center">
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Iniciando sesión...
      </span>
      <span v-else>Iniciar Sesión</span>
    </button>

    <!-- Mensaje de error -->
    <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
      {{ error }}
    </div>

    <!-- Credenciales de prueba -->
    <div class="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <h3 class="text-sm font-medium text-gray-700 mb-2">Credenciales de prueba:</h3>
      <div class="text-xs text-gray-600 space-y-1">
        <p><strong>Admin:</strong> DNI: 99999999, Password: admin123</p>
        <p><strong>Practicante:</strong> DNI: 87654321, Password: 123456</p>
      </div>
    </div>
  </form>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const form = ref({
  dni: '99999999', // Pre-llenado para pruebas
  password: 'admin123'
});
const loading = ref(false);
const error = ref('');

const handleLogin = async () => {
  loading.value = true;
  error.value = '';

  try {
    console.log('🔐 Intentando login con:', form.value);
    
    await authStore.login(form.value);
    
    console.log('✅ Login exitoso, usuario:', authStore.user);
    
    // Redirigir según el rol
    if (authStore.isAdmin) {
      console.log('🚀 Redirigiendo a admin dashboard');
      await router.push('/admin/dashboard');
    } else {
      console.log('🚀 Redirigiendo a practicante dashboard');
      await router.push('/app/dashboard');
    }
    
  } catch (err) {
    console.error('❌ Error en login:', err);
    error.value = err.response?.data?.error || 'Error al conectar con el servidor';
  } finally {
    loading.value = false;
  }
};
</script>