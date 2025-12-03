<!-- src/components/ui/StatCard.vue - VERSIÓN CORREGIDA -->
<template>
  <div class="google-stat-card" :class="cardClasses">
    <div class="card-content">
      <!-- Header -->
      <div class="card-header">
        <div class="card-icon" :class="iconColor">
          <i :class="icon"></i>
        </div>
        <div class="card-actions" v-if="showMenu">
          <button class="action-btn">
            <i class="fas fa-ellipsis-v"></i>
          </button>
        </div>
      </div>
      
      <!-- Valor principal -->
      <div class="card-value">
        <div v-if="loading" class="skeleton skeleton-value"></div>
        <template v-else>
          <span class="value-number">{{ value }}</span>
          <span v-if="unit" class="value-unit">{{ unit }}</span>
        </template>
      </div>
      
      <!-- Título -->
      <div class="card-title">
        <div v-if="loading" class="skeleton skeleton-title"></div>
        <span v-else>{{ title }}</span>
      </div>
      
      <!-- Subtítulo y progreso -->
      <div class="card-subtitle" v-if="subtitle || progress !== undefined">
        <div v-if="loading" class="skeleton skeleton-subtitle"></div>
        <template v-else>
          <span v-if="subtitle" class="subtitle-text">{{ subtitle }}</span>
          <div v-if="progress !== undefined" class="progress-container">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: `${progress}%` }"></div>
            </div>
            <span class="progress-text">{{ progress }}%</span>
          </div>
        </template>
      </div>
      
      <!-- Trend -->
      <div class="card-trend" v-if="trend !== undefined && !loading">
        <!-- LÍNEA CORREGIDA: -->
        <i :class="[trendIcon, trend > 0 ? 'trend-up' : 'trend-down']"></i>
        <span :class="trend > 0 ? 'text-green-600' : 'text-red-600'">
          {{ Math.abs(trend) }}%
        </span>
        <span class="trend-label">{{ trend > 0 ? 'más' : 'menos' }} que ayer</span>
      </div>
    </div>
    
    <!-- Footer (opcional) -->
    <div class="card-footer" v-if="$slots.footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: String,
  value: [String, Number],
  unit: String,
  icon: {
    type: String,
    default: 'fas fa-chart-line'
  },
  iconColor: {
    type: String,
    default: 'blue'
  },
  subtitle: String,
  progress: Number,
  trend: Number,
  loading: Boolean,
  clickable: Boolean,
  showMenu: {
    type: Boolean,
    default: true
  }
})

const cardClasses = computed(() => {
  const classes = []
  if (props.clickable) classes.push('clickable')
  return classes.join(' ')
})

const trendIcon = computed(() => {
  return props.trend > 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'
})

const iconColor = computed(() => {
  const colors = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    red: 'bg-red-100 text-red-600',
    purple: 'bg-purple-100 text-purple-600',
    gray: 'bg-gray-100 text-gray-600'
  }
  return colors[props.iconColor] || colors.blue
})
</script>

<style scoped>
.google-stat-card {
  @apply bg-white rounded-xl border border-gray-200 p-5 transition-all duration-200;
  box-shadow: 0 1px 2px 0 rgba(60, 64, 67, 0.1);
}

.google-stat-card:hover {
  box-shadow: 0 1px 3px 0 rgba(60, 64, 67, 0.2);
}

.google-stat-card.clickable {
  @apply cursor-pointer hover:border-blue-300;
}

.card-content {
  @apply space-y-3;
}

.card-header {
  @apply flex justify-between items-start;
}

.card-icon {
  @apply w-12 h-12 rounded-xl flex items-center justify-center text-lg;
}

.card-actions {
  @apply opacity-0 group-hover:opacity-100 transition-opacity;
}

.action-btn {
  @apply w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500;
}

.card-value {
  @apply flex items-baseline gap-1;
}

.value-number {
  @apply text-3xl font-bold text-gray-800;
}

.value-unit {
  @apply text-sm text-gray-500 ml-1;
}

.card-title {
  @apply text-sm font-medium text-gray-700;
}

.card-subtitle {
  @apply text-xs text-gray-500;
}

.progress-container {
  @apply flex items-center gap-3 mt-2;
}

.progress-bar {
  @apply flex-1 h-2 bg-gray-200 rounded-full overflow-hidden;
}

.progress-fill {
  @apply h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full;
}

.progress-text {
  @apply text-xs font-medium text-gray-700;
}

.card-trend {
  @apply flex items-center gap-1.5 text-sm;
}

.trend-up {
  @apply text-green-500;
}

.trend-down {
  @apply text-red-500;
}

.trend-label {
  @apply text-gray-500 ml-1;
}

.card-footer {
  @apply mt-4 pt-3 border-t border-gray-100;
}

/* Skeleton loading */
.skeleton {
  @apply bg-gray-200 rounded animate-pulse;
}

.skeleton-value {
  @apply h-8 w-24;
}

.skeleton-title {
  @apply h-4 w-32;
}

.skeleton-subtitle {
  @apply h-3 w-20;
}
</style>