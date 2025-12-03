// src/router/index.js - VERSIÓN CORREGIDA
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

// Layout
import AppLayout from '../components/ui/AppLayout.vue'

// Vistas compartidas
import LoginView from '../views/shared/LoginView.vue'
import DebugView from '../views/shared/DebugView.vue'

// Vistas de Admin
import AdminDashboard from '../views/admin/DashboardView.vue'
import AdminPracticantes from '../views/admin/PracticantesView.vue'
import AdminReportes from '../views/admin/ReportesView.vue'
import RegistroPracticanteView from '../views/admin/RegistroPracticanteView.vue'

// Vistas de Practicante
import PracticanteDashboard from '../views/practicante/DashboardView.vue'
import PracticanteAsistencias from '../views/practicante/AsistenciasView.vue'
import PracticantePerfil from '../views/practicante/PerfilView.vue'
import PracticanteRegistro from '../views/practicante/RegistroView.vue'

const routes = [
  // Rutas públicas
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { public: true }
  },
  {
    path: '/debug',
    name: 'Debug',
    component: DebugView,
    meta: { public: true }
  },
  
  // ========== RUTAS DE ADMIN ==========
  {
    path: '/admin',
    component: AppLayout,
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: '',
        redirect: 'dashboard'
      },
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: AdminDashboard
      },
      {
        path: 'practicantes',
        name: 'AdminPracticantes',
        component: AdminPracticantes
      },
      {
        path: 'reportes',
        name: 'AdminReportes',
        component: AdminReportes
      },
      {
        path: 'registro-practicante',
        name: 'RegistroPracticante',
        component: RegistroPracticanteView
      },
      {
        path: 'registro-manual',
        name: 'RegistroManual',
        component: () => import('../views/admin/RegistroManualView.vue') // Lazy load
      }
    ]
  },
  
  // ========== RUTAS DE PRACTICANTE ==========
  {
    path: '/practicante',
    component: AppLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: 'dashboard'
      },
      {
        path: 'dashboard',
        name: 'PracticanteDashboard',
        component: PracticanteDashboard
      },
      {
        path: 'registro',
        name: 'PracticanteRegistro',
        component: PracticanteRegistro
      },
      {
        path: 'asistencias',
        name: 'PracticanteAsistencias',
        component: PracticanteAsistencias
      },
      {
        path: 'perfil',
        name: 'PracticantePerfil',
        component: PracticantePerfil
      }
    ]
  },
  
  // Ruta 404
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guard global
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  console.log('🛣️ Navegando a:', to.path)
  
  // Rutas públicas
  if (to.meta.public) {
    return next()
  }
  
  // Verificar autenticación
  if (!authStore.isAuthenticated) {
    console.log('🔐 No autenticado, redirigiendo a login')
    return next('/login')
  }
  
  // Verificar permisos de admin
  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    console.log('⛔ No es admin, redirigiendo a practicante')
    return next('/practicante/dashboard')
  }
  
  // Verificar que el practicante no acceda a rutas de admin
  if (to.path.startsWith('/admin') && !authStore.isAdmin) {
    console.log('⛔ Practicante intentando acceder a admin')
    return next('/practicante/dashboard')
  }
  
  console.log('✅ Acceso permitido')
  next()
})

export default router