<template>
  <div class="animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" 
       :class="sizeClasses">
  </div>
</template>

<script setup>
const props = defineProps({
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  }
})

const sizeClasses = {
  'sm': 'w-4 h-4',
  'md': 'w-6 h-6',
  'lg': 'w-8 h-8'
}[props.size]
</script>