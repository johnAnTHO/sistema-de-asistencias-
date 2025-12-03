<!-- src/components/ui/Sidebar.vue - GOOGLE STYLE -->
<template>
  <aside class="google-sidebar">
    <!-- Header del sidebar -->
    <div class="sidebar-header">
      <div class="workspace-info">
        <div class="workspace-avatar">
          <i class="fas fa-building text-blue-500"></i>
        </div>
        <div>
          <h3 class="workspace-name">Municipalidad SJB</h3>
          <p class="workspace-status">Sistema activo</p>
        </div>
      </div>
    </div>

    <!-- Navegación principal -->
    <nav class="sidebar-nav">
      <!-- Sección para Admin -->
      <div v-if="authStore.isAdmin">
        <div class="nav-section">
          <span class="section-label">Administración</span>
        </div>
        
        <router-link 
          to="/admin/dashboard" 
          class="nav-item"
          :class="{ 'nav-item-active': $route.path === '/admin/dashboard' }"
        >
          <div class="nav-icon">
            <i class="fas fa-tachometer-alt"></i>
          </div>
          <span class="nav-text">Dashboard</span>
          <div class="nav-badge" v-if="false">3</div>
        </router-link>
        
        <router-link 
          to="/admin/practicantes" 
          class="nav-item"
          :class="{ 'nav-item-active': $route.path.includes('/admin/practicantes') }"
        >
          <div class="nav-icon">
            <i class="fas fa-users"></i>
          </div>
          <span class="nav-text">Practicantes</span>
          <div class="nav-badge" v-if="newPracticantes > 0">{{ newPracticantes }}</div>
        </router-link>
        
        <router-link 
          to="/admin/reportes" 
          class="nav-item"
          :class="{ 'nav-item-active': $route.path.includes('/admin/reportes') }"
        >
          <div class="nav-icon">
            <i class="fas fa-chart-bar"></i>
          </div>
          <span class="nav-text">Reportes</span>
        </router-link>
        
        <router-link 
          to="/admin/registro-manual" 
          class="nav-item"
          :class="{ 'nav-item-active': $route.path.includes('/admin/registro-manual') }"
        >
          <div class="nav-icon">
            <i class="fas fa-edit"></i>
          </div>
          <span class="nav-text">Registro Manual</span>
        </router-link>
      </div>

      <!-- Sección para Practicante -->
      <div v-else>
        <div class="nav-section">
          <span class="section-label">Mi Panel</span>
        </div>
        
        <router-link 
          to="/practicante/dashboard" 
          class="nav-item"
          :class="{ 'nav-item-active': $route.path === '/practicante/dashboard' }"
        >
          <div class="nav-icon">
            <i class="fas fa-home"></i>
          </div>
          <span class="nav-text">Inicio</span>
        </router-link>
        
        <router-link 
          to="/practicante/registro" 
          class="nav-item"
          :class="{ 'nav-item-active': $route.path.includes('/practicante/registro') }"
        >
          <div class="nav-icon">
            <i class="fas fa-fingerprint"></i>
          </div>
          <span class="nav-text">Registrar Asistencia</span>
          <div class="nav-badge urgent" v-if="pendingRegistration">!</div>
        </router-link>
        
        <router-link 
          to="/practicante/asistencias" 
          class="nav-item"
          :class="{ 'nav-item-active': $route.path.includes('/practicante/asistencias') }"
        >
          <div class="nav-icon">
            <i class="fas fa-history"></i>
          </div>
          <span class="nav-text">Mis Asistencias</span>
        </router-link>
        
        <router-link 
          to="/practicante/perfil" 
          class="nav-item"
          :class="{ 'nav-item-active': $route.path.includes('/practicante/perfil') }"
        >
          <div class="nav-icon">
            <i class="fas fa-user-edit"></i>
          </div>
          <span class="nav-text">Mi Perfil</span>
          <div class="nav-badge" v-if="profileIncomplete">!</div>
        </router-link>
      </div>

      <!-- Sección común -->
      <div class="nav-section mt-8">
        <span class="section-label">Herramientas</span>
      </div>
      
      <a href="#" class="nav-item">
        <div class="nav-icon">
          <i class="fas fa-calendar-alt"></i>
        </div>
        <span class="nav-text">Calendario</span>
      </a>
      
      <a href="#" class="nav-item">
        <div class="nav-icon">
          <i class="fas fa-file-download"></i>
        </div>
        <span class="nav-text">Descargas</span>
      </a>
      
      <a href="#" class="nav-item">
        <div class="nav-icon">
          <i class="fas fa-cog"></i>
        </div>
        <span class="nav-text">Configuración</span>
      </a>
    </nav>

    <!-- Footer del sidebar -->
    <div class="sidebar-footer">
      <div class="storage-info">
        <div class="storage-label">
          <span>Almacenamiento</span>
          <span class="storage-percent">25%</span>
        </div>
        <div class="storage-bar">
          <div class="storage-progress" style="width: 25%"></div>
        </div>
        <p class="storage-text">3.2 GB de 15 GB usado</p>
      </div>
      
      <button class="upgrade-btn">
        <i class="fas fa-rocket"></i>
        Actualizar plan
      </button>
    </div>
  </aside>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { useRoute } from 'vue-router'

const authStore = useAuthStore()
const $route = useRoute()

const newPracticantes = ref(2)
const pendingRegistration = ref(true)
const profileIncomplete = ref(false)
</script>

<style scoped>
.google-sidebar {
  @apply fixed left-0 top-16 bottom-0 w-72 bg-white border-r border-gray-200 flex flex-col z-40;
  box-shadow: 1px 0 2px rgba(0, 0, 0, 0.05);
}

.sidebar-header {
  @apply px-6 py-4 border-b border-gray-200;
}

.workspace-info {
  @apply flex items-center gap-3;
}

.workspace-avatar {
  @apply w-10 h-10 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center;
}

.workspace-name {
  @apply font-medium text-gray-800;
}

.workspace-status {
  @apply text-xs text-green-600 flex items-center gap-1;
}

.workspace-status::before {
  content: '';
  @apply w-2 h-2 bg-green-500 rounded-full;
}

.sidebar-nav {
  @apply flex-1 px-3 py-4 overflow-y-auto;
}

.nav-section {
  @apply px-3 py-2;
}

.section-label {
  @apply text-xs font-medium text-gray-500 uppercase tracking-wider;
}

.nav-item {
  @apply flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-gray-700 hover:bg-gray-100 relative;
}

.nav-item-active {
  @apply bg-blue-50 text-blue-600 font-medium;
  box-shadow: inset 3px 0 0 #4285f4;
}

.nav-item-active .nav-icon {
  @apply bg-blue-100 text-blue-600;
}

.nav-icon {
  @apply w-9 h-9 rounded-lg flex items-center justify-center text-gray-500;
}

.nav-text {
  @apply flex-1 text-sm;
}

.nav-badge {
  @apply bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded-full min-w-6 h-6 flex items-center justify-center;
}

.nav-badge.urgent {
  @apply bg-red-500;
}

/* Footer del sidebar */
.sidebar-footer {
  @apply px-6 py-4 border-t border-gray-200;
}

.storage-info {
  @apply mb-4;
}

.storage-label {
  @apply flex justify-between text-sm text-gray-700 mb-1;
}

.storage-percent {
  @apply font-medium;
}

.storage-bar {
  @apply w-full h-2 bg-gray-200 rounded-full overflow-hidden;
}

.storage-progress {
  @apply h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full;
}

.storage-text {
  @apply text-xs text-gray-500 mt-1;
}

.upgrade-btn {
  @apply w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2.5 rounded-lg text-sm font-medium hover:shadow-md transition-shadow flex items-center justify-center gap-2;
}

/* Scrollbar personalizada */
.sidebar-nav::-webkit-scrollbar {
  width: 6px;
}

.sidebar-nav::-webkit-scrollbar-track {
  @apply bg-transparent;
}

.sidebar-nav::-webkit-scrollbar-thumb {
  @apply bg-gray-300 rounded;
}

.sidebar-nav::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-400;
}
</style>