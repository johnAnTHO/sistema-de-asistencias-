import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue')
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/DashboardView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/asistencias',
    name: 'Asistencias',
    component: () => import('../views/AsistenciasView.vue'),
    meta: { requiresAuth: true }
  },
  // === AGREGA ESTA RUTA NUEVA ===
  {
    path: '/debug-auth',
    name: 'DebugAuth', 
    component: () => import('../views/DebugAuth.vue')
  },
  // === FIN DE RUTA NUEVA ===
  {
    path: '/',
    redirect: '/login'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// DEBUG DETALLADO DEL ROUTER
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = authStore.isAuthenticated();
  
  console.log('🛡️ === NAVIGATION GUARD DEBUG ===');
  console.log('📍 De:', from.path);
  console.log('📍 A:', to.path);
  console.log('🔐 Requiere auth:', to.meta.requiresAuth);
  console.log('✅ Está autenticado:', isAuthenticated);
  console.log('🗝️ Token en store:', authStore.token);
  console.log('💾 Token en localStorage:', localStorage.getItem('token'));
  console.log('👤 Usuario:', authStore.user);

  // Si la ruta requiere autenticación y NO está autenticado
  if (to.meta.requiresAuth && !isAuthenticated) {
    console.log('❌ REDIRIGIENDO A LOGIN - No autenticado');
    next('/login');
    return;
  }
  
  // Si está en login y YA está autenticado
  if (to.name === 'Login' && isAuthenticated) {
    console.log('✅ REDIRIGIENDO A DASHBOARD - Ya autenticado');
    next('/dashboard');
    return;
  }

  console.log('➡️ NAVEGACIÓN PERMITIDA');
  next();
});

export default router;
