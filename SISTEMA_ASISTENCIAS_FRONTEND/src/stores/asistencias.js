import { defineStore } from 'pinia';
import { asistenciaService } from '@/services/asistenciaService';

export const useAsistenciasStore = defineStore('asistencias', {
  state: () => ({
    misAsistencias: [],
    resumen: null,
    asistenciasHoy: [], // <- Para el dashboard de admin
    loading: false
  }),

  actions: {
    // ✅ AGREGAR ESTA ACCIÓN QUE FALTA
    async cargarAsistenciasHoy() {
      this.loading = true;
      try {
        const response = await asistenciaService.getAsistenciasHoy();
        this.asistenciasHoy = response.data.asistencias || [];
        return response.data;
      } catch (error) {
        console.error('Error cargando asistencias de hoy:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // ... el resto de tus acciones existentes ...
    async cargarMisAsistencias(params = {}) {
      this.loading = true;
      try {
        const response = await asistenciaService.getMisAsistencias(params);
        this.misAsistencias = response.data.asistencias || [];
        return response.data;
      } catch (error) {
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async cargarMiResumen(mes, anio) {
      try {
        const response = await asistenciaService.getMiResumen(mes, anio);
        this.resumen = response.data;
        return response.data;
      } catch (error) {
        throw error;
      }
    }
  }
});