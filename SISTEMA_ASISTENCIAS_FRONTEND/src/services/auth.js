import api from './api';

export const authService = {
  async login(credentials) {
    console.log('📤 Enviando login al backend...', credentials);
    
    const response = await api.post('/auth/login', credentials);
    console.log('📥 Respuesta recibida:', response.data);
    
    if (response.data.token) {
      console.log('💾 Guardando token y usuario...');
      localStorage.setItem('token', response.data.token);
      
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      console.log('✅ AuthService - Login exitoso');
    } else {
      console.warn('⚠️ AuthService - No se recibió token');
    }
    
    return response.data;
  },

  logout() {
    console.log('🧹 AuthService - Limpiando localStorage');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser() {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  },

  isAuthenticated() {
    const hasToken = !!localStorage.getItem('token');
    console.log('🔐 AuthService - isAuthenticated:', hasToken);
    return hasToken;
  }
};