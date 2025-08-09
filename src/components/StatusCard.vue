<template>
  <div class="rounded-lg border bg-white p-4 shadow-sm">
    <div class="flex items-center justify-between">
      <div class="min-w-0 flex-1">
        <p class="text-sm text-gray-500">Status</p>
        <div class="flex items-center gap-3">
          <div>
            <p class="text-lg font-semibold">
              {{ status.active ? 'Aktiv' : 'Inaktiv' }}
              <span v-if="status.active" class="block sm:inline sm:ml-2 text-sm text-gray-500">
                ({{ status.hours }}h {{ status.minutes }}m)
              </span>
            </p>
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
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 9l6 6m0-6l-6 6"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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
