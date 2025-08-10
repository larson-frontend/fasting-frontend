<template>
  <div class="min-h-screen bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center px-4">
    <div class="text-center w-full max-w-sm">
      <div @click="$emit('enter')" class="cursor-pointer transform transition-all duration-300 hover:scale-105 active:scale-95 touch-manipulation">
        <img src="../assets/logo.png" alt="Logo" class="h-32 w-32 sm:h-40 sm:w-40 mx-auto rounded-full shadow-lg animate-bounce-spin" />
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
@keyframes bounce-spin {
  0%, 100% { 
    transform: translateY(0) rotate(0deg); 
  }
  25% { 
    transform: translateY(-10px) rotate(90deg); 
  }
  50% { 
    transform: translateY(-20px) rotate(180deg); 
  }
  75% { 
    transform: translateY(-10px) rotate(270deg); 
  }
}

.animate-bounce-spin {
  animation: bounce-spin 2s ease-in-out infinite;
}

.animate-bounce-spin:hover {
  animation: bounce-spin 1s ease-in-out infinite;
}
</style>
