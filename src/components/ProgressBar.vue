<template>
  <div class="w-full">
    <!-- Progress Bar mit Highlight-Markierungen -->
    <div class="relative w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
      <!-- Highlight-Punkte im Hintergrund -->
      <div class="absolute inset-0 flex items-center">
        <!-- 10h Markierung -->
        <div class="absolute h-6 w-0.5 bg-gray-400 -translate-y-1" :style="{ left: (10/24*100) + '%' }">
          <div class="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-gray-500 font-medium whitespace-nowrap">10h</div>
        </div>
        <!-- 12h Markierung -->
        <div class="absolute h-6 w-0.5 bg-gray-400 -translate-y-1" :style="{ left: (12/24*100) + '%' }">
          <div class="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-gray-500 font-medium whitespace-nowrap">12h</div>
        </div>
        <!-- 16h Markierung -->
        <div class="absolute h-6 w-0.5 bg-gray-400 -translate-y-1" :style="{ left: (16/24*100) + '%' }">
          <div class="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-gray-500 font-medium whitespace-nowrap">16h</div>
        </div>
      </div>
      
      <!-- Fortschrittsbalken -->
      <div 
        class="h-full rounded-full transition-all duration-500 ease-out relative"
        :class="progressBarColor"
        :style="{ width: progressWidth + '%' }">
        <div class="h-full bg-gradient-to-r from-white/20 to-transparent rounded-full"></div>
      </div>
    </div>
    
    <!-- Zeit-Labels -->
    <div class="flex justify-between text-xs text-gray-500 mt-8">
      <span>0h</span>
      <span>24h</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  hours: number
  minutes: number
}

const props = defineProps<Props>()

const totalMinutes = computed(() => props.hours * 60 + props.minutes)
const currentHours = computed(() => props.hours)
const currentMinutes = computed(() => props.minutes)

// Progress basiert auf 24h Maximum (1440 Minuten)
const progressWidth = computed(() => {
  const maxMinutes = 24 * 60 // 24 Stunden
  return Math.min((totalMinutes.value / maxMinutes) * 100, 100)
})

const progressBarColor = computed(() => {
  const hours = props.hours
  
  if (hours < 10) {
    return 'bg-gradient-to-r from-red-500 to-red-600'
  } else if (hours < 12) {
    return 'bg-gradient-to-r from-orange-500 to-orange-600'
  } else {
    return 'bg-gradient-to-r from-emerald-500 to-emerald-600'
  }
})
</script>
