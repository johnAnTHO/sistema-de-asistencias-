<!-- src/components/ui/AppLayout.vue - GOOGLE STYLE -->
<template>
  <div class="google-layout">
    <!-- Navbar estilo Google -->
    <Navbar />
    
    <!-- Contenedor principal -->
    <div class="layout-main">
      <!-- Sidebar estilo Gmail/Google Apps -->
      <Sidebar v-if="authStore.isAuthenticated" />
      
      <!-- Área de contenido -->
      <main class="content-area" :class="{ 'with-sidebar': authStore.isAuthenticated }">
        <!-- Container tipo Google (centrado, ancho máximo) -->
        <div class="google-container">
          <router-view v-slot="{ Component }">
            <transition name="google-fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </main>
    </div>
    
    <!-- Footer sutil tipo Google -->
    <footer class="google-footer" v-if="authStore.isAuthenticated">
      <div class="footer-content">
        <div class="footer-left">
          <span class="text-sm text-gray-500">Sistema de Asistencias</span>
          <span class="text-xs text-gray-400 ml-4">© 2024 Municipalidad SJB</span>
        </div>
        <div class="footer-right">
          <a href="#" class="text-xs text-gray-500 hover:text-gray-700 hover:underline">Ayuda</a>
          <a href="#" class="text-xs text-gray-500 hover:text-gray-700 hover:underline ml-4">Privacidad</a>
          <a href="#" class="text-xs text-gray-500 hover:text-gray-700 hover:underline ml-4">Términos</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { useAuthStore } from '../../stores/auth';
import Navbar from './Navbar.vue';
import Sidebar from './Sidebar.vue';

const authStore = useAuthStore();
</script>

<style scoped>
.google-layout {
  @apply min-h-screen bg-gray-50;
  font-family: 'Roboto', 'Segoe UI', system-ui, -apple-system, sans-serif;
}

.layout-main {
  @apply flex min-h-screen;
  padding-top: 64px; /* Altura del navbar */
}

.content-area {
  @apply flex-1 transition-all duration-300;
}

.content-area.with-sidebar {
  margin-left: 280px; /* Ancho del sidebar */
}

.google-container {
  @apply max-w-7xl mx-auto p-6;
}

/* Footer estilo Google */
.google-footer {
  @apply border-t border-gray-200 bg-white py-4;
}

.footer-content {
  @apply max-w-7xl mx-auto px-6 flex justify-between items-center;
}

/* Transiciones suaves estilo Google */
.google-fade-enter-active,
.google-fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.google-fade-enter-from,
.google-fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>