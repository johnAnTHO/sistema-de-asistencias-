import { defineStore } from 'pinia';
import { asistenciaService } from '../services/asistenciaService';

export const useAsistenciasStore = defineStore('asistencias', {
  state: () => ({
    asistenciasHoy: [],
    misAsistencias: [],
    loading: false
  }),

  actions: {
    async cargarAsistenciasHoy() {
      this.loading = true;
      try {
        this.asistenciasHoy = await asistenciaService.getAsistenciasHoy();
      } catch (error) {
        console.error('Error cargando asistencias:', error);
      } finally {
        this.loading = false;
      }
    },

    async marcarEntrada(datos) {
      try {
        const resultado = await asistenciaService.marcarEntradaBiometrica(datos);
        await this.cargarAsistenciasHoy(); // Recargar lista
        return resultado;
      } catch (error) {
        throw error;
      }
    }
  }
});