<!-- src/views/practicante/PerfilView.vue -->
<template>
  <div class="practicante-perfil">
    <h1 class="text-2xl font-bold mb-6">Mi Perfil</h1>
    
    <div class="bg-white rounded-xl shadow p-6">
      <!-- Foto de perfil -->
      <div class="flex items-center mb-6">
        <div class="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
          <i class="fas fa-user text-3xl text-gray-500"></i>
        </div>
        <div class="ml-6">
          <h2 class="text-xl font-bold">{{ authStore.userName }}</h2>
          <p class="text-gray-600">{{ authStore.user?.dni }}</p>
          <button class="mt-2 text-blue-500 text-sm">Cambiar foto</button>
        </div>
      </div>
      
      <!-- Información -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Nombres</label>
          <input type="text" :value="authStore.user?.nombres" class="w-full border rounded-lg p-2" readonly>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Apellidos</label>
          <input type="text" :value="authStore.user?.apellidos" class="w-full border rounded-lg p-2" readonly>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" :value="authStore.user?.email" class="w-full border rounded-lg p-2">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Teléfono</label>
          <input type="tel" class="w-full border rounded-lg p-2">
        </div>
      </div>
      
      <button class="mt-6 bg-blue-500 text-white px-4 py-2 rounded-lg">
        Guardar cambios
      </button>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()
</script>