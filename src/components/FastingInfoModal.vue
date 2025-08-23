<template>
  <div v-if="show" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-bold text-gray-900">{{ $t('fasting.phases.title') }}</h3>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      
      <div class="space-y-4">
        <!-- Phase 1: 0-3 Stunden -->
        <div class="relative rounded-lg overflow-hidden border-2 border-blue-200">
          <!-- Progress Hintergrund mit Gradient -->
          <div class="flex gap-3 p-3"
               :style="{ 
                 background: `linear-gradient(to right, rgb(147 197 253) 0%, rgb(147 197 253) ${getPhaseProgress(0, 3)}%, rgb(239 246 255) ${getPhaseProgress(0, 3)}%, rgb(239 246 255) 100%)` 
               }">
            <div class="flex-shrink-0 relative">
              <div class="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-md">
                <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
              <!-- Häkchen für erledigte Phase -->
              <div v-if="getPhaseProgress(0, 3) >= 100" class="absolute -top-1 -right-1 w-5 h-5 bg-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            </div>
            <div>
              <h4 class="font-semibold text-blue-900">{{ $t('fasting.phases.phase1.time') }} {{ getPhaseStatus(0, 3) }}</h4>
              <p class="text-sm text-blue-800">{{ $t('fasting.phases.phase1.description') }}</p>
            </div>
          </div>
        </div>

        <!-- Phase 2: 3-8 Stunden -->
        <div class="relative rounded-lg overflow-hidden border-2 border-yellow-200">
          <!-- Progress Hintergrund mit Gradient -->
          <div class="flex gap-3 p-3"
               :style="{ 
                 background: `linear-gradient(to right, rgb(253 224 71) 0%, rgb(253 224 71) ${getPhaseProgress(3, 8)}%, rgb(254 249 195) ${getPhaseProgress(3, 8)}%, rgb(254 249 195) 100%)` 
               }">
            <div class="flex-shrink-0 relative">
              <div class="w-12 h-12 bg-yellow-600 rounded-full flex items-center justify-center shadow-md">
                <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              <!-- Häkchen für erledigte Phase -->
              <div v-if="getPhaseProgress(3, 8) >= 100" class="absolute -top-1 -right-1 w-5 h-5 bg-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            </div>
            <div>
              <h4 class="font-semibold text-yellow-900">{{ $t('fasting.phases.phase2.time') }} {{ getPhaseStatus(3, 8) }}</h4>
              <p class="text-sm text-yellow-800">{{ $t('fasting.phases.phase2.description') }}</p>
            </div>
          </div>
        </div>

        <!-- Phase 3: 8-12 Stunden -->
        <div class="relative rounded-lg overflow-hidden border-2 border-orange-200">
          <!-- Progress Hintergrund mit Gradient -->
          <div class="flex gap-3 p-3"
               :style="{ 
                 background: `linear-gradient(to right, rgb(251 146 60) 0%, rgb(251 146 60) ${getPhaseProgress(8, 12)}%, rgb(255 237 213) ${getPhaseProgress(8, 12)}%, rgb(255 237 213) 100%)` 
               }">
            <div class="flex-shrink-0 relative">
              <div class="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center shadow-md">
                <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13.5 0.5C13.5 0.5 21 8 13.5 15C13.5 15 11 12.5 11 9.5C11 6.5 13.5 0.5 13.5 0.5ZM6.5 6C6.5 6 14 13.5 6.5 20.5C6.5 20.5 4 18 4 15C4 12 6.5 6 6.5 6Z"/>
                </svg>
              </div>
              <!-- Häkchen für erledigte Phase -->
              <div v-if="getPhaseProgress(8, 12) >= 100" class="absolute -top-1 -right-1 w-5 h-5 bg-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            </div>
            <div>
              <h4 class="font-semibold text-orange-900">{{ $t('fasting.phases.phase3.time') }} {{ getPhaseStatus(8, 12) }}</h4>
              <p class="text-sm text-orange-800">{{ $t('fasting.phases.phase3.description') }}</p>
            </div>
          </div>
        </div>

        <!-- Phase 4: 12-16 Stunden -->
        <div class="relative rounded-lg overflow-hidden border-2 border-emerald-200">
          <!-- Progress Hintergrund mit Gradient -->
          <div class="flex gap-3 p-3"
               :style="{ 
                 background: `linear-gradient(to right, rgb(52 211 153) 0%, rgb(52 211 153) ${getPhaseProgress(12, 16)}%, rgb(209 250 229) ${getPhaseProgress(12, 16)}%, rgb(209 250 229) 100%)` 
               }">
            <div class="flex-shrink-0 relative">
              <div class="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center shadow-md">
                <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                </svg>
              </div>
              <!-- Häkchen für erledigte Phase -->
              <div v-if="getPhaseProgress(12, 16) >= 100" class="absolute -top-1 -right-1 w-5 h-5 bg-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            </div>
            <div>
              <h4 class="font-semibold text-emerald-900">{{ $t('fasting.phases.phase4.time') }} {{ getPhaseStatus(12, 16) }}</h4>
              <p class="text-sm text-emerald-800">{{ $t('fasting.phases.phase4.description') }}</p>
            </div>
          </div>
        </div>

        <!-- Phase 5: 16+ Stunden -->
        <div class="relative rounded-lg overflow-hidden border-2 border-purple-200">
          <!-- Progress Hintergrund mit Gradient -->
          <div class="flex gap-3 p-3"
               :style="{ 
                 background: `linear-gradient(to right, rgb(168 85 247) 0%, rgb(168 85 247) ${getPhaseProgress(16, 24)}%, rgb(243 232 255) ${getPhaseProgress(16, 24)}%, rgb(243 232 255) 100%)` 
               }">
            <div class="flex-shrink-0 relative">
              <div class="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center shadow-md">
                <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                </svg>
              </div>
              <!-- Häkchen für erledigte Phase -->
              <div v-if="getPhaseProgress(16, 24) >= 100" class="absolute -top-1 -right-1 w-5 h-5 bg-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            </div>
            <div>
              <h4 class="font-semibold text-purple-900">{{ $t('fasting.phases.phase5.time') }} {{ getPhaseStatus(16, 24) }}</h4>
              <p class="text-sm text-purple-800">{{ $t('fasting.phases.phase5.description') }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-6 pt-4 border-t border-gray-200">
        <p class="text-xs text-gray-500 text-center">
          {{ $t('fasting.phases.source_note') }}<br>
          <span class="font-medium">{{ $t('fasting.phases.sources') }}:</span> Harvard Health, NIH, Journal of Clinical Investigation
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

interface FastStatus {
  active?: boolean
  hours?: number
  minutes?: number
  since?: string
}

interface Props {
  show: boolean
  status?: FastStatus
}

const props = defineProps<Props>()
const { t } = useI18n()

defineEmits<{
  close: []
}>()

// Berechne aktuelle Fasten-Stunden
const currentHours = computed(() => {
  if (!props.status?.active) return 0
  return (props.status.hours || 0) + ((props.status.minutes || 0) / 60)
})

// Berechne Progress für eine Phase (0-100%)
function getPhaseProgress(start: number, end: number): number {
  const current = currentHours.value
  
  if (!props.status?.active) return 0
  if (current < start) return 0
  if (current >= end) return 100
  
  return ((current - start) / (end - start)) * 100
}

// Status-Text für eine Phase
function getPhaseStatus(start: number, end: number): string {
  const current = currentHours.value
  
  if (!props.status?.active) return ''
  if (current < start) return `(${t('fasting.phases.status.not_reached')})`
  if (current >= end) return `✓ (${t('fasting.phases.status.completed')})`
  
  const progress = Math.round(((current - start) / (end - start)) * 100)
  return `(${progress}% ${t('fasting.phases.status.progress')})`
}
</script>
