<template>
  <div class="min-h-screen bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center px-4">
    <div class="text-center w-full max-w-sm">
      <div @click="$emit('enter')" class="cursor-pointer transform transition-all duration-300 hover:scale-105 active:scale-95 touch-manipulation">
        <img src="../assets/logo.png" alt="Logo" class="h-24 w-24 sm:h-32 sm:w-32 mx-auto rounded-full shadow-lg animate-pulse hover:animate-bounce" />
        <h1 class="text-3xl sm:text-4xl font-bold text-emerald-800 mt-4 sm:mt-6 mb-2">Fasting Tracker</h1>
        <p class="text-emerald-600 text-sm sm:text-base">Tippe auf das Logo zum Starten</p>
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
@keyframes wiggle {
  0%, 100% { transform: rotate(-3deg); }
  50% { transform: rotate(3deg); }
}

.animate-wiggle {
  animation: wiggle 1s ease-in-out infinite;
}

.animate-wiggle:hover {
  animation: wiggle 0.5s ease-in-out infinite;
}
</style>
