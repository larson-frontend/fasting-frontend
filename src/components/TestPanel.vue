<template>
  <div v-if="showPanel" class="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border p-4 z-50 max-w-sm">
    <!-- Header -->
    <div class="flex items-center justify-between mb-3">
      <h3 class="font-bold text-gray-800 flex items-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
        </svg>
        {{ $t('test.panel') }}
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
        {{ $t('test.status') }}: 
        <span :class="isTestActive ? 'text-orange-600' : 'text-green-600'">
          {{ isTestActive ? $t('test.test_mode') : $t('test.live_data') }}
        </span>
      </div>
      <div v-if="currentTest" class="text-gray-600">
        {{ currentTest.hours }}{{ $t('test.hours_short') }} {{ currentTest.minutes }}{{ $t('test.minutes_short') }} - {{ getPhase(currentTest.hours) }}
      </div>
    </div>

    <!-- Quick Tests -->
    <div class="space-y-2">
      <div class="text-sm font-medium text-gray-700">{{ $t('test.quick_tests') }}:</div>
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

    <!-- Phase Tests -->
    <div class="mt-3 pt-3 border-t space-y-2">
      <div class="text-sm font-medium text-gray-700">{{ $t('test.phase_tests') }}:</div>
      <div class="grid grid-cols-3 gap-1">
        <button
          v-for="(phase, index) in phaseTestButtons"
          :key="index"
          @click="phase.action"
          class="px-2 py-1 text-xs rounded border hover:bg-gray-50 transition-colors"
          :class="phase.active ? 'border-purple-300 bg-purple-50 text-purple-700' : 'border-gray-200'"
        >
          {{ phase.label }}
        </button>
      </div>
    </div>

    <!-- Goal Tests -->
    <div class="mt-3 pt-3 border-t space-y-2">
      <div class="text-sm font-medium text-gray-700">{{ $t('test.goal_tests') }}:</div>
      <div class="grid grid-cols-3 gap-1">
        <button
          v-for="(goal, index) in goalTestButtons"
          :key="index"
          @click="goal.action"
          class="px-2 py-1 text-xs rounded border hover:bg-gray-50 transition-colors"
          :class="goal.active ? 'border-emerald-300 bg-emerald-50 text-emerald-700' : 'border-gray-200'"
        >
          {{ goal.label }}
        </button>
      </div>
    </div>

    <!-- Custom Test -->
    <div class="mt-3 pt-3 border-t">
      <div class="text-sm font-medium text-gray-700 mb-2">{{ $t('test.custom_test') }}:</div>
      <div class="flex gap-2">
        <input
          v-model.number="customHours"
          type="number"
          min="0"
          max="48"
          :placeholder="$t('test.hours_short')"
          class="w-16 px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
        <input
          v-model.number="customMinutes"
          type="number"
          min="0"
          max="59"
          :placeholder="$t('test.minutes_short')"
          class="w-16 px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
        <button
          @click="activateCustomTest"
          class="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {{ $t('test.test_button') }}
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
import { useI18n } from 'vue-i18n'
import { 
  quickTests, 
  activateTestMode, 
  deactivateTestMode, 
  isTestModeActive, 
  getTestData 
} from '../utils/testScenarios'
import { MOCK_PHASE_SCENARIOS, createMockStatus } from '../mocks/phase-data'

const showPanel = ref(false)
const customHours = ref(17)
const customMinutes = ref(30)

const isTestActive = computed(() => isTestModeActive())
const currentTest = computed(() => getTestData())
const { t } = useI18n()

const quickTestButtons = computed(() => [
  {
  label: t('fasting.actions.start'),
    action: () => { quickTests.start(); showPanel.value = false },
    active: isTestActive.value && currentTest.value?.hours === 0
  },
  {
    label: '8h',
    action: () => { quickTests.middle(); showPanel.value = false },
    active: isTestActive.value && currentTest.value?.hours === 8
  },
  {
    label: '12h',
    action: () => { quickTests.ketosis(); showPanel.value = false },
    active: isTestActive.value && currentTest.value?.hours === 12
  },
  {
    label: '16h',
    action: () => { quickTests.autophagy(); showPanel.value = false },
    active: isTestActive.value && currentTest.value?.hours === 16
  },
  {
    label: '17h',
    action: () => { quickTests.extended(); showPanel.value = false },
    active: isTestActive.value && currentTest.value?.hours === 17
  },
  {
    label: '24h',
    action: () => { quickTests.full(); showPanel.value = false },
    active: isTestActive.value && currentTest.value?.hours === 24
  },
  {
  label: t('test.live'),
    action: () => { quickTests.off(); showPanel.value = false },
    active: !isTestActive.value
  },
  {
  label: t('test.info'),
    action: () => console.log('Current test data:', currentTest.value),
    active: false
  }
])

const phaseTestButtons = computed(() => [
  {
    label: '1.5h',
    action: () => { activateTestMode(1, 30, 16); showPanel.value = false },
    active: isTestActive.value && currentTest.value?.hours === 1 && currentTest.value?.minutes === 30
  },
  {
    label: '4h',
    action: () => { activateTestMode(4, 0, 16); showPanel.value = false },
    active: isTestActive.value && currentTest.value?.hours === 4
  },
  {
    label: '10h',
    action: () => { activateTestMode(10, 30, 16); showPanel.value = false },
    active: isTestActive.value && currentTest.value?.hours === 10 && currentTest.value?.minutes === 30
  },
  {
    label: '14h',
    action: () => { activateTestMode(14, 0, 16); showPanel.value = false },
    active: isTestActive.value && currentTest.value?.hours === 14
  },
  {
    label: '18h',
    action: () => { activateTestMode(18, 30, 16); showPanel.value = false },
    active: isTestActive.value && currentTest.value?.hours === 18 && currentTest.value?.minutes === 30
  },
  {
    label: '25h',
    action: () => { activateTestMode(25, 0, 24); showPanel.value = false },
    active: isTestActive.value && currentTest.value?.hours === 25
  }
])

const goalTestButtons = computed(() => [
  {
    label: '10h',
    action: () => { activateTestMode(currentTest.value?.hours || 16, currentTest.value?.minutes || 0, 10); showPanel.value = false },
    active: currentTest.value?.goalHours === 10
  },
  {
    label: '12h',
    action: () => { activateTestMode(currentTest.value?.hours || 16, currentTest.value?.minutes || 0, 12); showPanel.value = false },
    active: currentTest.value?.goalHours === 12
  },
  {
    label: '16h',
    action: () => { activateTestMode(currentTest.value?.hours || 16, currentTest.value?.minutes || 0, 16); showPanel.value = false },
    active: currentTest.value?.goalHours === 16
  },
  {
    label: '18h',
    action: () => { activateTestMode(currentTest.value?.hours || 16, currentTest.value?.minutes || 0, 18); showPanel.value = false },
    active: currentTest.value?.goalHours === 18
  },
  {
    label: '20h',
    action: () => { activateTestMode(currentTest.value?.hours || 16, currentTest.value?.minutes || 0, 20); showPanel.value = false },
    active: currentTest.value?.goalHours === 20
  },
  {
    label: '24h',
    action: () => { activateTestMode(currentTest.value?.hours || 16, currentTest.value?.minutes || 0, 24); showPanel.value = false },
    active: currentTest.value?.goalHours === 24
  }
])

function activateCustomTest() {
  if (customHours.value >= 0 && customMinutes.value >= 0) {
    activateTestMode(customHours.value, customMinutes.value)
    showPanel.value = false
  }
}

function getPhase(hours: number): string {
  if (hours < 3) return t('fasting.progress.phases.early')
  if (hours < 8) return t('fasting.progress.phases.warming')
  if (hours < 12) return t('fasting.progress.phases.burning')
  if (hours < 16) return t('fasting.progress.phases.ketosis')
  if (hours === 16) return t('fasting.progress.phases.goal_reached', { goal: 16 })
  return t('fasting.progress.phases.bonus')
}

// Auto-activate 17h test on mount (for development)
onMounted(() => {
  if (import.meta.env.DEV) {
    if (import.meta.env.VITE_AUTO_START_17H_TEST === 'true') {
      quickTests.extended()
    }
    console.log('🧪 Test Panel geladen - Klicke auf das Test-Icon unten rechts')
  }
})
</script>

<style scoped>
/* Custom styles für das Test Panel */
</style>
