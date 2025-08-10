<template>
  <div class="min-h-screen bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center px-4">
    <div class="text-center w-full max-w-sm">
      <div @click="$emit('enter')" class="cursor-pointer transform transition-all duration-300 hover:scale-105 active:scale-95 touch-manipulation">
        <div class="animate-bounce-gentle">
          <div class="animate-leaf-float mb-6">
            <span class="text-6xl sm:text-7xl">🍃</span>
          </div>
          <h2 class="text-3xl sm:text-4xl font-bold text-emerald-700">Fasting Tracker</h2>
          <p class="text-emerald-600 text-sm sm:text-base mt-2">Tippe zum Starten</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits<{
  enter: []
}>()
</script>

<style scoped>
@keyframes bounce-gentle {
  0%, 100% { 
    transform: translateY(0) scale(1); 
  }
  50% { 
    transform: translateY(-8px) scale(1.05); 
  }
}

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

.animate-bounce-gentle {
  animation: bounce-gentle 1s ease-in-out infinite;
}

.animate-bounce-gentle:hover {
  animation: bounce-gentle 0.7s ease-in-out infinite;
}

.animate-leaf-float {
  animation: leaf-float 3s ease-in-out infinite;
}

.animate-leaf-float:hover {
  animation: leaf-float 2s ease-in-out infinite;
}
</style>
