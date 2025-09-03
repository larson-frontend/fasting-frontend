<template>
  <div class="rounded-lg border shadow-sm relative overflow-hidden">
    <!-- Hintergrund Progress Bar -->
    <div 
      class="absolute inset-0 transition-all duration-500 ease-out"
      :class="backgroundGradient"
      :style="{ width: backgroundProgress + '%' }">
    </div>
    
    <!-- Content Overlay -->
    <div class="relative bg-white/90 backdrop-blur-sm p-4">
      <div class="space-y-4">
        <!-- Status Header mit Buttons -->
        <div class="flex items-center justify-between">
          <div class="min-w-0 flex-1">
            <p class="text-sm text-gray-500">{{ $t('fasting.status.title') }}</p>
            <div class="flex items-center gap-3 flex-wrap">
              <p class="text-lg font-semibold">
                {{ status.active ? $t('fasting.status.active') : $t('fasting.status.inactive') }}
              </p>
              <TimeBadge 
                v-if="status.active" 
                :hours="status.hours || 0" 
                :minutes="status.minutes || 0" 
              />
            </div>
            <p v-if="status.since" class="text-xs text-gray-400 truncate">
              {{ $t('fasting.time.since') }} {{ new Date(status.since).toLocaleString() }}
            </p>
          </div>
          <div class="flex gap-2 ml-auto">
            <button 
              @click="$emit('start')" 
              :disabled="status.active" 
              :class="status.active 
                ? 'w-12 h-12 rounded-full bg-gray-400 text-gray-600 cursor-not-allowed flex items-center justify-center' 
                : 'w-12 h-12 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 flex items-center justify-center touch-manipulation shadow-md hover:shadow-lg transition-all'"
              :title="$t('fasting.actions.start')">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </button>
            <button 
              @click="$emit('stop')" 
              :disabled="!status.active" 
              :class="!status.active 
                ? 'w-12 h-12 rounded-full bg-gray-400 text-gray-600 cursor-not-allowed flex items-center justify-center' 
                : 'w-12 h-12 rounded-full bg-rose-600 text-white hover:bg-rose-700 flex items-center justify-center touch-manipulation shadow-md hover:shadow-lg transition-all'"
              :title="$t('fasting.actions.stop')">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="6" width="12" height="12" rx="1"/>
              </svg>
            </button>
          </div>
        </div>
        
        <!-- Progress Bar (volle Breite, nur bei aktiver Session) -->
        <ProgressBar 
          v-if="status.active" 
          :hours="status.hours || 0" 
          :minutes="status.minutes || 0" 
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ProgressBar from './ProgressBar.vue'
import TimeBadge from './TimeBadge.vue'

interface FastStatus {
  active?: boolean
  hours?: number
  minutes?: number
  since?: string
}

interface Props {
  status: FastStatus
}

const props = defineProps<Props>()

defineEmits<{
  start: []
  stop: []
}>()

// Hintergrund Progress basierend auf Fasten-Phasen
const backgroundProgress = computed(() => {
  if (!props.status.active) return 0
  
  const hours = props.status.hours || 0
  
  // 0-3h: 0-25%
  if (hours < 3) return (hours / 3) * 25
  // 3-8h: 25-50%
  if (hours < 8) return 25 + ((hours - 3) / 5) * 25
  // 8-12h: 50-75%
  if (hours < 12) return 50 + ((hours - 8) / 4) * 25
  // 12-16h: 75-100%
  if (hours < 16) return 75 + ((hours - 12) / 4) * 25
  // 16h+: 100%
  return 100
})

const backgroundGradient = computed(() => {
  if (!props.status.active) return 'bg-gray-100'
  
  const hours = props.status.hours || 0
  
  if (hours < 3) {
    return 'bg-gradient-to-r from-blue-100 to-blue-50'
  } else if (hours < 8) {
    return 'bg-gradient-to-r from-yellow-100 to-yellow-50'
  } else if (hours < 12) {
    return 'bg-gradient-to-r from-orange-100 to-orange-50'
  } else if (hours < 16) {
    return 'bg-gradient-to-r from-emerald-100 to-emerald-50'
  } else {
    return 'bg-gradient-to-r from-purple-100 to-purple-50'
  }
})
</script>
