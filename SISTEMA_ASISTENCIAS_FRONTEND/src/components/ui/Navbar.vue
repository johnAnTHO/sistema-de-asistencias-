<!-- src/components/ui/Navbar.vue - GOOGLE STYLE -->
<template>
  <nav class="google-navbar">
    <div class="navbar-container">
      <!-- Logo y título (izquierda) -->
      <div class="navbar-left">
        <!-- Menú hamburguesa (solo móvil) -->
        <button class="menu-btn md:hidden" @click="toggleSidebar">
          <i class="fas fa-bars text-gray-600"></i>
        </button>
        
        <!-- Logo tipo Google -->
        <div class="logo-container">
          <div class="google-logo">
            <i class="fas fa-fingerprint text-blue-500"></i>
          </div>
          <h1 class="logo-text">
            Asistencias
            <span class="logo-subtext">SJB</span>
          </h1>
        </div>
        
        <!-- Breadcrumb estilo Google -->
        <div class="breadcrumb hidden md:flex">
          <span class="breadcrumb-item">Sistema</span>
          <i class="fas fa-chevron-right breadcrumb-divider"></i>
          <span class="breadcrumb-item current">{{ currentSection }}</span>
        </div>
      </div>

      <!-- Búsqueda y acciones (centro) -->
      <div class="navbar-center hidden lg:flex">
        <div class="google-search">
          <i class="fas fa-search search-icon"></i>
          <input 
            type="text" 
            placeholder="Buscar practicantes, asistencias..." 
            class="search-input"
            v-model="searchQuery"
          />
          <button v-if="searchQuery" @click="clearSearch" class="clear-search">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>

      <!-- Acciones de usuario (derecha) -->
      <div class="navbar-right">
        <!-- Botón ayuda -->
        <button class="nav-btn" title="Ayuda">
          <i class="fas fa-question-circle"></i>
        </button>
        
        <!-- Notificaciones estilo Gmail -->
        <div class="relative">
          <button class="nav-btn relative" @click="toggleNotifications">
            <i class="fas fa-bell"></i>
            <span v-if="unreadCount > 0" class="notification-badge">
              {{ unreadCount }}
            </span>
          </button>
          
          <!-- Dropdown notificaciones -->
          <div v-if="showNotifications" class="notifications-dropdown">
            <div class="notifications-header">
              <h3>Notificaciones</h3>
              <button @click="markAllAsRead" class="text-blue-500 text-sm">
                Marcar todas
              </button>
            </div>
            <div class="notifications-list">
              <!-- Lista de notificaciones -->
            </div>
          </div>
        </div>
        
        <!-- Perfil de usuario -->
        <div class="user-profile">
          <button class="profile-btn" @click="toggleUserMenu">
            <div class="avatar">
              <i class="fas fa-user"></i>
            </div>
            <span class="user-name hidden md:inline">{{ userName }}</span>
            <i class="fas fa-chevron-down text-xs ml-1"></i>
          </button>
          
          <!-- Menú usuario -->
          <div v-if="showUserMenu" class="user-menu-dropdown">
            <div class="user-info">
              <div class="avatar-large">
                <i class="fas fa-user text-blue-500"></i>
              </div>
              <div>
                <p class="user-fullname">{{ userName }}</p>
                <p class="user-email">{{ userEmail }}</p>
              </div>
            </div>
            <div class="menu-divider"></div>
            <a href="#" class="menu-item">
              <i class="fas fa-user-cog"></i>
              Mi cuenta
            </a>
            <a href="#" class="menu-item">
              <i class="fas fa-cog"></i>
              Configuración
            </a>
            <div class="menu-divider"></div>
            <button @click="logout" class="menu-item logout-item">
              <i class="fas fa-sign-out-alt"></i>
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { useRouter, useRoute } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const $route = useRoute()

// Estado
const searchQuery = ref('')
const showNotifications = ref(false)
const showUserMenu = ref(false)
const unreadCount = ref(3)

// Computed
const userName = computed(() => authStore.userName || 'Usuario')
const userEmail = computed(() => authStore.user?.email || 'usuario@municipalidad.com')

const currentSection = computed(() => {
  const map = {
    'AdminDashboard': 'Dashboard',
    'AdminPracticantes': 'Practicantes',
    'AdminReportes': 'Reportes',
    'PracticanteDashboard': 'Inicio'
  }
  return map[$route.name] || 'Sistema'
})

// Métodos
const toggleSidebar = () => {
  // Implementar toggle para móvil
  console.log('Toggle sidebar')
}

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
  showUserMenu.value = false
}

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
  showNotifications.value = false
}

const clearSearch = () => {
  searchQuery.value = ''
}

const markAllAsRead = () => {
  unreadCount.value = 0
}

const logout = () => {
  authStore.logout()
  router.push('/login')
}

// Cerrar menús al hacer click fuera
document.addEventListener('click', (e) => {
  if (!e.target.closest('.relative')) {
    showNotifications.value = false
    showUserMenu.value = false
  }
})
</script>

<style scoped>
.google-navbar {
  @apply fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50;
  height: 64px;
  box-shadow: 0 1px 2px 0 rgba(60, 64, 67, 0.1);
}

.navbar-container {
  @apply h-full max-w-7xl mx-auto px-4 flex items-center justify-between;
}

.navbar-left {
  @apply flex items-center gap-4 flex-1;
}

.menu-btn {
  @apply w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center;
}

.logo-container {
  @apply flex items-center gap-3;
}

.google-logo {
  @apply w-10 h-10 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center;
  box-shadow: 0 1px 3px rgba(66, 133, 244, 0.3);
}

.logo-text {
  @apply text-xl font-medium text-gray-800 tracking-tight;
}

.logo-subtext {
  @apply text-blue-500 font-bold;
}

.breadcrumb {
  @apply ml-8 flex items-center;
}

.breadcrumb-item {
  @apply text-sm text-gray-600 px-2 py-1 rounded hover:bg-gray-100;
}

.breadcrumb-item.current {
  @apply text-gray-800 font-medium;
}

.breadcrumb-divider {
  @apply text-gray-400 text-xs mx-1;
}

/* Búsqueda estilo Google */
.navbar-center {
  @apply flex-1 max-w-2xl;
}

.google-search {
  @apply w-full relative;
}

.search-icon {
  @apply absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400;
}

.search-input {
  @apply w-full pl-12 pr-10 py-2.5 bg-gray-50 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent;
  font-size: 14px;
}

.clear-search {
  @apply absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600;
}

/* Lado derecho */
.navbar-right {
  @apply flex items-center gap-2;
}

.nav-btn {
  @apply w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-600 relative;
}

.notification-badge {
  @apply absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center;
  font-size: 11px;
  box-shadow: 0 0 0 2px white;
}

/* Perfil de usuario */
.user-profile {
  @apply relative;
}

.profile-btn {
  @apply flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-100 transition-colors;
}

.avatar {
  @apply w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center text-blue-600;
}

.user-name {
  @apply text-sm font-medium text-gray-700;
}

/* Dropdowns */
.notifications-dropdown,
.user-menu-dropdown {
  @apply absolute right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50;
  min-width: 320px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.notifications-header {
  @apply px-4 py-3 border-b flex justify-between items-center;
}

.user-menu-dropdown {
  min-width: 280px;
}

.user-info {
  @apply px-4 py-3 flex items-center gap-3;
}

.avatar-large {
  @apply w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center text-blue-600 text-xl;
}

.user-fullname {
  @apply font-medium text-gray-800;
}

.user-email {
  @apply text-sm text-gray-500;
}

.menu-divider {
  @apply border-t border-gray-200 my-1;
}

.menu-item {
  @apply flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors;
}

.menu-item i {
  @apply w-5 text-center text-gray-500;
}

.logout-item {
  @apply text-red-600 hover:bg-red-50;
}

.logout-item i {
  @apply text-red-500;
}
</style>