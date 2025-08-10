<template>
  <div class="rounded-lg border bg-white p-4 shadow-sm">
    <div class="space-y-4">
      <!-- Status Header mit Buttons -->
      <div class="flex items-center justify-between">
        <div class="min-w-0 flex-1">
          <p class="text-sm text-gray-500">Status</p>
          <div class="flex items-center gap-3 flex-wrap">
            <p class="text-lg font-semibold">
              {{ status.active ? 'Aktiv' : 'Inaktiv' }}
            </p>
            <TimeBadge 
              v-if="status.active" 
              :hours="status.hours || 0" 
              :minutes="status.minutes || 0" 
            />
          </div>
          <p v-if="status.since" class="text-xs text-gray-400 truncate">
            seit {{ new Date(status.since).toLocaleString() }}
          </p>
        </div>
        <div class="flex gap-2 ml-auto">
          <button 
            @click="$emit('start')" 
            :disabled="status.active" 
            :class="status.active 
              ? 'w-12 h-12 rounded-full bg-gray-400 text-gray-600 cursor-not-allowed flex items-center justify-center' 
              : 'w-12 h-12 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 flex items-center justify-center touch-manipulation shadow-md hover:shadow-lg transition-all'"
            :title="'Fasten starten'">
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
            :title="'Fasten beenden'">
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
</template>

<script setup lang="ts">
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

defineProps<Props>()

defineEmits<{
  start: []
  stop: []
}>()
</script>
