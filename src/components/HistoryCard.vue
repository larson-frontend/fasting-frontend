<template>
  <div class="rounded-lg border bg-white p-4 shadow-sm">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
      <h2 class="font-semibold text-lg">{{ $t('history.title') }}</h2>
      <button 
        @click="$emit('refresh')" 
        class="text-sm px-3 py-2 rounded border hover:bg-gray-100 touch-manipulation font-medium" 
        :disabled="loading">
        {{ loading ? '...' : $t('history.refresh') }}
      </button>
    </div>
    <div class="space-y-3">
      <div v-for="item in items" :key="item.id" 
           class="flex gap-3 p-3 rounded-lg transition-colors" 
           :class="getBackgroundClass(item)">
        <div class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
             :class="getIconClass(item)">
          <svg class="w-4 h-4" :class="getIconColorClass(item)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between gap-3 mb-2">
            <div class="flex items-center gap-2">
              <span class="font-medium text-sm">
                {{ formatDuration(item) }}
              </span>
              <span v-if="item.endAt" class="flex items-center gap-1 text-gray-500 text-xs">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                {{ $t('history.completed') }}
              </span>
              <span v-else class="flex items-center gap-1 text-emerald-600 text-xs font-medium">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                {{ $t('history.active') }}
              </span>
            </div>
            <div class="text-xs text-gray-500">
              {{ getPhaseText(item) }}
            </div>
          </div>
          <div class="text-gray-600 text-xs space-y-1">
            <div class="truncate">{{ $t('history.started') }}: {{ new Date(item.startAt).toLocaleString() }}</div>
            <div v-if="item.endAt" class="truncate">{{ $t('history.ended') }}: {{ new Date(item.endAt).toLocaleString() }}</div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="items.length === 0" class="text-center text-gray-500 py-8 text-sm">
      Noch keine Sessions vorhanden
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

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

// Berechne die Dauer einer Session in Stunden
function getDurationHours(item: FastSession): number {
  const start = new Date(item.startAt).getTime()
  const end = item.endAt ? new Date(item.endAt).getTime() : Date.now()
  return (end - start) / (1000 * 60 * 60)
}

// Formatiere die Dauer
function formatDuration(item: FastSession): string {
  const hours = getDurationHours(item)
  const h = Math.floor(hours)
  const m = Math.floor((hours - h) * 60)
  return `${h}h ${m}m`
}

// Bestimme die Fasten-Phase basierend auf der Dauer
function getPhase(item: FastSession): 'early' | 'warming' | 'burning' | 'ketosis' | 'deep' {
  const hours = getDurationHours(item)
  if (hours < 3) return 'early'
  if (hours < 8) return 'warming'
  if (hours < 12) return 'burning'
  if (hours < 16) return 'ketosis'
  return 'deep'
}

// Phasen-Text
function getPhaseText(item: FastSession): string {
  const phase = getPhase(item)
  const phaseNames = {
    early: 'Anfangsphase',
    warming: 'Aufwärmphase', 
    burning: 'Fettverbrennung',
    ketosis: 'Ketose',
    deep: 'Tiefe Ketose'
  }
  return phaseNames[phase]
}

// Hintergrund-Klassen basierend auf Phase
function getBackgroundClass(item: FastSession): string {
  const phase = getPhase(item)
  const isActive = !item.endAt
  
  if (isActive) {
    // Aktive Sessions: kräftigere Farben
    const activeClasses = {
      early: 'bg-blue-100 border border-blue-200',
      warming: 'bg-yellow-100 border border-yellow-200',
      burning: 'bg-orange-100 border border-orange-200', 
      ketosis: 'bg-emerald-100 border border-emerald-200',
      deep: 'bg-purple-100 border border-purple-200'
    }
    return activeClasses[phase]
  } else {
    // Beendete Sessions: dezentere Farben
    const completedClasses = {
      early: 'bg-blue-50 border border-blue-100',
      warming: 'bg-yellow-50 border border-yellow-100',
      burning: 'bg-orange-50 border border-orange-100',
      ketosis: 'bg-emerald-50 border border-emerald-100', 
      deep: 'bg-purple-50 border border-purple-100'
    }
    return completedClasses[phase]
  }
}

// Icon-Hintergrund-Klassen
function getIconClass(item: FastSession): string {
  const phase = getPhase(item)
  const isActive = !item.endAt
  
  if (isActive) {
    const activeClasses = {
      early: 'bg-blue-200',
      warming: 'bg-yellow-200',
      burning: 'bg-orange-200',
      ketosis: 'bg-emerald-200',
      deep: 'bg-purple-200'
    }
    return activeClasses[phase]
  } else {
    const completedClasses = {
      early: 'bg-blue-100',
      warming: 'bg-yellow-100',
      burning: 'bg-orange-100',
      ketosis: 'bg-emerald-100',
      deep: 'bg-purple-100'
    }
    return completedClasses[phase]
  }
}

// Icon-Farb-Klassen
function getIconColorClass(item: FastSession): string {
  const phase = getPhase(item)
  const colorClasses = {
    early: 'text-blue-600',
    warming: 'text-yellow-600',
    burning: 'text-orange-600',
    ketosis: 'text-emerald-600',
    deep: 'text-purple-600'
  }
  return colorClasses[phase]
}
</script>
