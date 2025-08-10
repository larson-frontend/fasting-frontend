<template>
  <div v-if="show" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-bold text-gray-900">Fasten-Phasen</h3>
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
              <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <!-- Häkchen für erledigte Phase -->
              <div v-if="getPhaseProgress(0, 3) >= 100" class="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            </div>
            <div>
              <h4 class="font-semibold text-blue-900">0-3 Stunden {{ getPhaseStatus(0, 3) }}</h4>
              <p class="text-sm text-blue-800">Verdauung läuft noch. Insulinspiegel beginnt zu sinken.</p>
              <!-- DEBUG INFO -->
              <p class="text-xs text-blue-600 mt-1 font-mono">DEBUG: {{ getPhaseProgress(0, 3).toFixed(1) }}% Progress | Current: {{ currentHours.toFixed(1) }}h</p>
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
              <div class="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <!-- Häkchen für erledigte Phase -->
              <div v-if="getPhaseProgress(3, 8) >= 100" class="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            </div>
            <div>
              <h4 class="font-semibold text-yellow-900">3-8 Stunden {{ getPhaseStatus(3, 8) }}</h4>
              <p class="text-sm text-yellow-800">Insulin normalisiert sich. Körper beginnt gespeicherte Glukose zu nutzen.</p>
              <!-- DEBUG INFO -->
              <p class="text-xs text-yellow-600 mt-1 font-mono">DEBUG: {{ getPhaseProgress(3, 8).toFixed(1) }}% Progress</p>
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
              <div class="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 716.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"></path>
                </svg>
              </div>
              <!-- Häkchen für erledigte Phase -->
              <div v-if="getPhaseProgress(8, 12) >= 100" class="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            </div>
            <div>
              <h4 class="font-semibold text-orange-900">8-12 Stunden {{ getPhaseStatus(8, 12) }}</h4>
              <p class="text-sm text-orange-800">Fettverbrennung startet! Körper wechselt von Glukose zu Fett als Energiequelle.</p>
              <!-- DEBUG INFO -->
              <p class="text-xs text-orange-600 mt-1 font-mono">DEBUG: {{ getPhaseProgress(8, 12).toFixed(1) }}% Progress</p>
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
              <div class="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                </svg>
              </div>
              <!-- Häkchen für erledigte Phase -->
              <div v-if="getPhaseProgress(12, 16) >= 100" class="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            </div>
            <div>
              <h4 class="font-semibold text-emerald-900">12-16 Stunden {{ getPhaseStatus(12, 16) }}</h4>
              <p class="text-sm text-emerald-800">Ketose beginnt. Erste Ketone werden produziert. Mentale Klarheit steigt.</p>
              <!-- DEBUG INFO -->
              <p class="text-xs text-emerald-600 mt-1 font-mono">DEBUG: {{ getPhaseProgress(12, 16).toFixed(1) }}% Progress</p>
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
              <div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                </svg>
              </div>
              <!-- Häkchen für erledigte Phase -->
              <div v-if="getPhaseProgress(16, 24) >= 100" class="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            </div>
            <div>
              <h4 class="font-semibold text-purple-900">16+ Stunden {{ getPhaseStatus(16, 24) }}</h4>
              <p class="text-sm text-purple-800">Autophagie aktiviert! Zellerneuerung und -reparatur beginnen. Tiefe Ketose.</p>
              <!-- DEBUG INFO -->
              <p class="text-xs text-purple-600 mt-1 font-mono">DEBUG: {{ getPhaseProgress(16, 24).toFixed(1) }}% Progress</p>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-6 pt-4 border-t border-gray-200">
        <p class="text-xs text-gray-500 text-center">
          Basierend auf wissenschaftlichen Studien zu Intervallfasten.<br>
          <span class="font-medium">Quellen:</span> Harvard Health, NIH, Journal of Clinical Investigation
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

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

defineEmits<{
  close: []
}>()

// Berechne aktuelle Fasten-Stunden
const currentHours = computed(() => {
  // Berechne aktuelle Fasten-Stunden basierend auf Status
  if (!props.status?.active) return 0
  return (props.status.hours || 0) + ((props.status.minutes || 0) / 60)
})

// Berechne Progress für eine Phase (0-100%)
function getPhaseProgress(start: number, end: number): number {
  const current = currentHours.value
  console.log(`Phase ${start}-${end}: current=${current}`)
  
  if (!props.status?.active && current === 0) return 0
  if (current < start) return 0
  if (current >= end) return 100
  
  const progress = ((current - start) / (end - start)) * 100
  console.log(`Phase ${start}-${end}: progress=${progress}%`)
  return progress
}

// Status-Text für eine Phase
function getPhaseStatus(start: number, end: number): string {
  const current = currentHours.value
  
  if (!props.status?.active && current === 0) return ''
  if (current < start) return '(noch nicht erreicht)'
  if (current >= end) return '✓ (abgeschlossen)'
  
  const progress = Math.round(((current - start) / (end - start)) * 100)
  return `(${progress}% erreicht)`
}
</script>
