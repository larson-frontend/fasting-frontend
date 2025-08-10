<template>
  <div v-if="showPanel" class="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border p-4 z-50 max-w-sm">
    <!-- Header -->
    <div class="flex items-center justify-between mb-3">
      <h3 class="font-bold text-gray-800 flex items-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
        </svg>
        Test Panel
      </h3>
      <button @click="showPanel = false" class="text-gray-400 hover:text-gray-600">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>

    <!-- Test Status -->
    <div class="mb-3 p-2 bg-gray-50 rounded text-sm">
      <div class="font-medium">
        Status: 
        <span :class="isTestActive ? 'text-orange-600' : 'text-green-600'">
          {{ isTestActive ? 'Test-Modus' : 'Live-Daten' }}
        </span>
      </div>
      <div v-if="currentTest" class="text-gray-600">
        {{ currentTest.hours }}h {{ currentTest.minutes }}m - {{ getPhase(currentTest.hours) }}
      </div>
    </div>

    <!-- Quick Tests -->
    <div class="space-y-2">
      <div class="text-sm font-medium text-gray-700">Quick Tests:</div>
      <div class="grid grid-cols-2 gap-2">
        <button
          v-for="(test, key) in quickTestButtons"
          :key="key"
          @click="test.action"
          class="px-3 py-2 text-xs rounded border hover:bg-gray-50 transition-colors"
          :class="test.active ? 'border-orange-300 bg-orange-50 text-orange-700' : 'border-gray-200'"
        >
          {{ test.label }}
        </button>
      </div>
    </div>

    <!-- Custom Test -->
    <div class="mt-3 pt-3 border-t">
      <div class="text-sm font-medium text-gray-700 mb-2">Custom Test:</div>
      <div class="flex gap-2">
        <input
          v-model.number="customHours"
          type="number"
          min="0"
          max="48"
          placeholder="Std"
          class="w-16 px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
        <input
          v-model.number="customMinutes"
          type="number"
          min="0"
          max="59"
          placeholder="Min"
          class="w-16 px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
        <button
          @click="activateCustomTest"
          class="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Test
        </button>
      </div>
    </div>
  </div>

  <!-- Toggle Button -->
  <button
    v-if="!showPanel"
    @click="showPanel = true"
    class="fixed bottom-4 right-4 w-12 h-12 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700 transition-colors z-50 flex items-center justify-center"
  >
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
    </svg>
  </button>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { 
  quickTests, 
  activateTestMode, 
  deactivateTestMode, 
  isTestModeActive, 
  getTestData 
} from '../utils/testScenarios'

const showPanel = ref(false)
const customHours = ref(17)
const customMinutes = ref(30)

const isTestActive = computed(() => isTestModeActive())
const currentTest = computed(() => getTestData())

const quickTestButtons = computed(() => [
  {
    label: 'Start',
    action: quickTests.start,
    active: isTestActive.value && currentTest.value?.hours === 0
  },
  {
    label: '8h',
    action: quickTests.middle,
    active: isTestActive.value && currentTest.value?.hours === 8
  },
  {
    label: '12h',
    action: quickTests.ketosis,
    active: isTestActive.value && currentTest.value?.hours === 12
  },
  {
    label: '16h',
    action: quickTests.autophagy,
    active: isTestActive.value && currentTest.value?.hours === 16
  },
  {
    label: '17h',
    action: quickTests.extended,
    active: isTestActive.value && currentTest.value?.hours === 17
  },
  {
    label: '24h',
    action: quickTests.full,
    active: isTestActive.value && currentTest.value?.hours === 24
  },
  {
    label: 'Live',
    action: quickTests.off,
    active: !isTestActive.value
  },
  {
    label: 'Info',
    action: () => console.log('Current test data:', currentTest.value),
    active: false
  }
])

function activateCustomTest() {
  if (customHours.value >= 0 && customMinutes.value >= 0) {
    activateTestMode(customHours.value, customMinutes.value)
  }
}

function getPhase(hours: number): string {
  if (hours < 3) return "Aufwärmphase"
  if (hours < 8) return "Aufwärmphase"
  if (hours < 12) return "Fettverbrennung"
  if (hours < 16) return "Ketose"
  if (hours === 16) return "Autophagie"
  return "Erweiterte Autophagie"
}

// Auto-activate 17h test on mount (for development)
onMounted(() => {
  if (import.meta.env.DEV) {
    // quickTests.extended() // Uncomment to auto-start 17h test
    console.log('🧪 Test Panel geladen - Klicke auf das Test-Icon unten rechts')
  }
})
</script>

<style scoped>
/* Custom styles für das Test Panel */
</style>
