import { defineStore } from 'pinia';
import { ref } from 'vue';
import { authService } from '../services/auth';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const token = ref(localStorage.getItem('token'));
  const loading = ref(false);

  // DEBUG: Verificar carga inicial
  console.log('🔄 AuthStore inicializado');
  console.log('💾 Token al cargar:', token.value);
  console.log('👤 User al cargar:', user.value);

  // Cargar usuario desde localStorage
  const userData = localStorage.getItem('user');
  if (userData) {
    try {
      user.value = JSON.parse(userData);
      console.log('✅ Usuario cargado desde localStorage');
    } catch (e) {
      console.error('❌ Error cargando usuario:', e);
      localStorage.removeItem('user');
    }
  }

  const login = async (credentials) => {
    try {
      loading.value = true;
      console.log('🔐 INICIANDO LOGIN...', credentials);
      
      // LIMPIAR TOKENS ANTERIORES (por si acaso)
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      const response = await authService.login(credentials);
      
      // VERIFICAR RESPUESTA
      console.log('📥 Respuesta del backend:', response);
      
      if (!response.token) {
        throw new Error('No se recibió token del servidor');
      }
      
      token.value = response.token;
      user.value = response.user;
      
      // VERIFICAR QUE SE GUARDÓ
      console.log('💾 Guardando en localStorage...');
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      // VERIFICAR QUE SE GUARDÓ CORRECTAMENTE
      const savedToken = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      console.log('✅ Token guardado:', !!savedToken);
      console.log('✅ User guardado:', !!savedUser);
      console.log('✅ Store actualizado - token:', token.value);
      console.log('✅ Store actualizado - user:', user.value);
      
      return response;
      
    } catch (error) {
      console.error('❌ ERROR EN LOGIN:', error);
      
      // LIMPIAR EN CASO DE ERROR
      token.value = null;
      user.value = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      if (error.response) {
        const message = error.response.data?.message || error.response.data?.error || 'Error de autenticación';
        throw new Error(message);
      } else if (error.request) {
        throw new Error('No se pudo conectar con el servidor');
      } else {
        throw new Error('Error de configuración');
      }
    } finally {
      loading.value = false;
    }
  };

  const logout = () => {
    console.log('🚪 CERRANDO SESIÓN...');
    token.value = null;
    user.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.log('✅ Sesión cerrada');
  };

  const isAuthenticated = () => {
    const hasToken = !!token.value;
    console.log('🔐 isAuthenticated():', hasToken, 'Token:', token.value);
    return hasToken;
  };

  return {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated
  };
});