<template>
  <div class="rounded-lg border bg-white p-4 shadow-sm">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
      <h2 class="font-semibold text-lg">Historie</h2>
      <button 
        @click="$emit('refresh')" 
        class="text-sm px-3 py-2 rounded border hover:bg-gray-100 touch-manipulation font-medium" 
        :disabled="loading">
        {{ loading ? 'Lädt…' : 'Aktualisieren' }}
      </button>
    </div>
    <div class="space-y-3">
      <div v-for="item in items" :key="item.id" class="border-b last:border-b-0 pb-3 last:pb-0">
        <div class="flex items-center justify-between gap-3 mb-2">
          <div class="flex items-center gap-3 min-w-0 flex-1">
            <div class="flex-shrink-0 w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
              <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
          <div class="flex items-center flex-shrink-0">
            <span v-if="item.endAt" class="flex items-center gap-1 text-gray-500 text-xs">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              beendet
            </span>
            <span v-else class="flex items-center gap-1 text-emerald-600 text-xs font-medium">
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              aktiv
            </span>
          </div>
        </div>
        <div class="text-gray-600 text-xs space-y-1">
          <div class="truncate">Start: {{ new Date(item.startAt).toLocaleString() }}</div>
          <div v-if="item.endAt" class="truncate">Ende: {{ new Date(item.endAt).toLocaleString() }}</div>
        </div>
      </div>
    </div>
    <div v-if="items.length === 0" class="text-center text-gray-500 py-8 text-sm">
      Noch keine Sessions vorhanden
    </div>
  </div>
</template>

<script setup lang="ts">
interface FastSession {
  id: number
  startAt: string
  endAt: string | null
}

interface Props {
  items: FastSession[]
  loading: boolean
}

defineProps<Props>()

defineEmits<{
  refresh: []
}>()
</script>
