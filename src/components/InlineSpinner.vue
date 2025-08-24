<template>
  <div 
    v-if="show" 
    class="inline-flex items-center justify-center"
    :class="containerClass"
  >
    <!-- Logo mini spinner -->
    <img 
      src="../assets/logo.png" 
      alt="Loading..." 
      class="animate-spin opacity-70"
      :class="sizeClass"
    />
    <!-- Text (optional) -->
    <span 
      v-if="text" 
      class="ml-2 text-sm"
      :class="textClass"
    >
      {{ text }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  show?: boolean
  text?: string
  size?: 'xs' | 'sm' | 'md'
  variant?: 'light' | 'dark' | 'primary'
}

const props = withDefaults(defineProps<Props>(), {
  show: false,
  text: '',
  size: 'sm',
  variant: 'dark'
})

const sizeClass = computed(() => {
  switch (props.size) {
    case 'xs':
      return 'w-3 h-3'
    case 'md':
      return 'w-6 h-6'
    case 'sm':
    default:
      return 'w-4 h-4'
  }
})

const containerClass = computed(() => {
  return props.text ? 'gap-1' : ''
})

const textClass = computed(() => {
  switch (props.variant) {
    case 'light':
      return 'text-white'
    case 'primary':
      return 'text-blue-600'
    case 'dark':
    default:
      return 'text-gray-600'
  }
})
</script>

<style scoped>
/* Smooth spinning animation */
.animate-spin {
  animation: spin 1.5s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
