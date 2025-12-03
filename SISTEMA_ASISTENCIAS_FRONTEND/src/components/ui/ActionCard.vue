<!-- src/components/ui/ActionCard.vue - VERSIÓN CORREGIDA -->
<template>
  <div 
    class="google-action-card" 
    :class="{ 'clickable': clickable }"
    @click="handleClick"
  >
    <!-- Icono circular estilo Google -->
    <div class="action-icon" :class="iconColorClass">
      <i :class="icon"></i>
    </div>
    
    <!-- Contenido -->
    <div class="action-content">
      <h3 class="action-title">{{ title }}</h3>
      <p class="action-description">{{ description }}</p>
      
      <!-- Etiquetas -->
      <div class="action-tags" v-if="tags && tags.length > 0">
        <span v-for="tag in tags" :key="tag" class="action-tag">
          {{ tag }}
        </span>
      </div>
      
      <!-- Metadatos -->
      <div class="action-meta" v-if="meta">
        <span class="meta-item">{{ meta }}</span>
      </div>
    </div>
    
    <!-- Acciones -->
    <div class="action-actions">
      <button class="action-btn" :class="buttonVariant" @click.stop="handleAction">
        <i :class="buttonIcon"></i>
        <span>{{ buttonText }}</span>
      </button>
      
      <!-- Menú de opciones -->
      <button v-if="showOptions" class="options-btn" @click.stop="toggleOptions">
        <i class="fas fa-ellipsis-v"></i>
      </button>
    </div>
    
    <!-- Indicador de estado -->
    <div v-if="status" class="action-status" :class="statusClass">
      {{ status }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  title: String,
  description: String,
  icon: {
    type: String,
    default: 'fas fa-cog'
  },
  iconColor: {
    type: String,
    default: 'blue'
  },
  tags: Array,
  meta: String,
  buttonText: {
    type: String,
    default: 'Acceder'
  },
  buttonIcon: {
    type: String,
    default: 'fas fa-arrow-right'
  },
  buttonVariant: {
    type: String,
    default: 'primary'
  },
  route: String,
  clickable: {
    type: Boolean,
    default: true
  },
  showOptions: {
    type: Boolean,
    default: true
  },
  status: String,
  statusType: {
    type: String,
    default: 'info'
  }
})

const emit = defineEmits(['click', 'action'])

const showOptionsMenu = ref(false)

const iconColorClass = computed(() => {
  const colors = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    red: 'bg-red-100 text-red-600',
    purple: 'bg-purple-100 text-purple-600'
  }
  return colors[props.iconColor] || colors.blue
})

const statusClass = computed(() => {
  const classes = {
    info: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800'
  }
  return classes[props.statusType] || classes.info
})

const handleClick = () => {
  if (props.route) {
    router.push(props.route)
  }
  emit('click')
}

const handleAction = (e) => {
  e.stopPropagation()
  emit('action')
}

const toggleOptions = (e) => {
  e.stopPropagation()
  showOptionsMenu.value = !showOptionsMenu.value
}
</script>

<style scoped>
.google-action-card {
  @apply bg-white rounded-xl border border-gray-200 p-6 transition-all duration-200 flex items-start gap-4 relative;
  box-shadow: 0 1px 2px 0 rgba(60, 64, 67, 0.1);
}

.google-action-card:hover {
  box-shadow: 0 1px 3px 0 rgba(60, 64, 67, 0.2);
  @apply border-gray-300;
}

.google-action-card.clickable {
  @apply cursor-pointer hover:border-blue-300;
}

.action-icon {
  @apply w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.action-content {
  @apply flex-1 min-w-0;
}

.action-title {
  @apply text-lg font-medium text-gray-800 mb-1;
}

.action-description {
  @apply text-sm text-gray-600 mb-3;
}

.action-tags {
  @apply flex flex-wrap gap-2 mb-3;
}

.action-tag {
  @apply px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded;
}

.action-meta {
  @apply text-xs text-gray-500;
}

.action-actions {
  @apply flex items-center gap-2 flex-shrink-0;
}

.action-btn {
  @apply px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2;
}

.action-btn.primary {
  @apply bg-blue-500 text-white hover:bg-blue-600;
}

.action-btn.secondary {
  @apply bg-gray-100 text-gray-700 hover:bg-gray-200;
}

.action-btn.outline {
  @apply border border-gray-300 text-gray-700 hover:bg-gray-50;
}

.options-btn {
  @apply w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500;
}

.action-status {
  @apply absolute -top-2 -right-2 px-2 py-1 rounded-full text-xs font-medium;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}
</style>