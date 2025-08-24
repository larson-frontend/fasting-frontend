<template>
  <div 
    v-if="show" 
    class="fixed inset-0 z-50"
  >
    <!-- Skeleton Background Layout -->
    <div class="min-h-screen bg-gray-50 text-gray-900">
      <div class="max-w-2xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
        
        <!-- Header Skeleton -->
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <!-- User Manager Skeleton -->
            <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-200 animate-pulse"></div>
            <!-- Language Switcher Skeleton -->
            <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-200 animate-pulse"></div>
            <!-- Info Button Skeleton -->
            <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-200 animate-pulse"></div>
          </div>
          <div class="flex items-center gap-3">
            <div class="w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
        
        <!-- Status Card Skeleton -->
        <div class="rounded-lg border bg-white p-4 sm:p-6 shadow-sm">
          <div class="text-center space-y-3 sm:space-y-4">
            <div class="h-6 bg-gray-200 rounded animate-pulse mx-auto w-24"></div>
            <div class="space-y-2">
              <div class="h-12 bg-gray-200 rounded animate-pulse mx-auto w-32"></div>
              <div class="h-4 bg-gray-200 rounded animate-pulse mx-auto w-20"></div>
            </div>
            <div class="h-10 bg-gray-200 rounded animate-pulse mx-auto w-28"></div>
          </div>
        </div>
        
        <!-- History Card Skeleton -->
        <div class="rounded-lg border bg-white p-4 shadow-sm">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
            <div class="h-6 bg-gray-200 rounded animate-pulse w-20"></div>
            <div class="h-8 bg-gray-200 rounded animate-pulse w-20"></div>
          </div>
          <div class="space-y-3">
            <!-- History Item Skeletons -->
            <div v-for="i in 3" :key="i" class="flex gap-3 p-3 rounded-lg bg-gray-50">
              <div class="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
              <div class="flex-1 space-y-2">
                <div class="flex items-center justify-between gap-3">
                  <div class="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                  <div class="h-3 bg-gray-200 rounded animate-pulse w-12"></div>
                </div>
                <div class="space-y-1">
                  <div class="h-3 bg-gray-200 rounded animate-pulse w-full"></div>
                  <div class="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Debug Info Skeleton -->
        <div class="h-4 bg-gray-200 rounded animate-pulse mx-auto w-40"></div>
      </div>
    </div>
    
    <!-- Floating Leaf Animation (centered) -->
    <div class="absolute inset-0 flex items-center justify-center">
      <div class="animate-leaf-float mb-6">
        <span class="text-6xl sm:text-7xl">🍃</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  show?: boolean
}

defineProps<Props>()
</script>

<style scoped>
/* Leaf floating animation */
@keyframes leaf-float {
  0%, 100% { 
    transform: translateY(0) rotate(-2deg); 
  }
  33% { 
    transform: translateY(-5px) rotate(1deg); 
  }
  66% { 
    transform: translateY(-3px) rotate(-1deg); 
  }
}

.animate-leaf-float {
  animation: leaf-float 3s ease-in-out infinite;
}

/* Pulse animation for skeleton elements */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
