<template>
  <nav class="bg-indigo-600 text-white shadow-lg">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex justify-between items-center h-16">
        <!-- Logo y título -->
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <span class="text-indigo-600 font-bold text-sm">SJ</span>
          </div>
          <span class="font-bold text-xl">Sistema Asistencias</span>
        </div>

        <!-- Menú de navegación -->
        <div class="hidden md:flex items-center space-x-4">
          <router-link 
            to="/dashboard" 
            class="px-3 py-2 rounded-md hover:bg-indigo-700 transition"
            :class="{ 'bg-indigo-700': $route.path === '/dashboard' }"
          >
            Dashboard
          </router-link>
          <router-link 
            to="/asistencias" 
            class="px-3 py-2 rounded-md hover:bg-indigo-700 transition"
            :class="{ 'bg-indigo-700': $route.path === '/asistencias' }"
          >
            Asistencias
          </router-link>
          
          <!-- Opciones solo para administradores -->
          <router-link 
            v-if="authStore.isAdmin()"
            to="/practicantes" 
            class="px-3 py-2 rounded-md hover:bg-indigo-700 transition"
            :class="{ 'bg-indigo-700': $route.path === '/practicantes' }"
          >
            Practicantes
          </router-link>
          <router-link 
            v-if="authStore.isAdmin()"
            to="/registro-practicante" 
            class="px-3 py-2 rounded-md hover:bg-indigo-700 transition"
            :class="{ 'bg-indigo-700': $route.path === '/registro-practicante' }"
          >
            Registrar Practicante
          </router-link>
        </div>

        <!-- Usuario y logout -->
        <div class="flex items-center space-x-4">
          <router-link 
            to="/perfil" 
            class="px-3 py-2 rounded-md hover:bg-indigo-700 transition flex items-center space-x-2"
          >
            <span>{{ authStore.user?.nombres }}</span>
            <span class="bg-indigo-500 px-2 py-1 rounded-full text-xs">
              {{ authStore.user?.rol }}
            </span>
          </router-link>
          <button 
            @click="handleLogout"
            class="px-3 py-2 rounded-md hover:bg-indigo-700 transition"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>