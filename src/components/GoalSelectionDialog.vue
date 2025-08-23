<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-xl max-w-md w-full p-6 animate-scale-up">
      <!-- Header -->
      <div class="text-center mb-6">
        <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-gray-800 mb-2">{{ $t('fasting.goals.title') }}</h2>
        <p class="text-gray-600">{{ $t('fasting.goals.description') }}</p>
      </div>

      <!-- Ziel-Buttons -->
      <div class="space-y-3 mb-6">
        <button
          v-for="goal in goals"
          :key="goal.hours"
          @click="selectGoal(goal.hours)"
          data-testid="goal-option"
          class="w-full p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md text-left group"
          :class="selectedGoal === goal.hours 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-200 hover:border-gray-300'"
        >
          <div class="flex items-center justify-between">
            <div>
              <div class="font-semibold text-gray-800" :class="selectedGoal === goal.hours ? 'text-blue-700' : ''">
                {{ goal.hours }} {{ $t('fasting.time.hours') }}
              </div>
              <div class="text-sm text-gray-600" :class="selectedGoal === goal.hours ? 'text-blue-600' : ''">
                {{ $t(`fasting.goals.options.${goal.hours}`) }}
              </div>
            </div>
            <div class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all"
                 :class="selectedGoal === goal.hours 
                   ? 'border-blue-500 bg-blue-500' 
                   : 'border-gray-300 group-hover:border-gray-400'">
              <div v-if="selectedGoal === goal.hours" class="w-3 h-3 bg-white rounded-full"></div>
            </div>
          </div>
        </button>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-3">
        <button
          @click="cancel"
          class="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
        >
          {{ $t('dialog.cancel') }}
        </button>
        <button
          @click="confirm"
          :disabled="!selectedGoal"
          data-testid="confirm-goal-button"
          class="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ $t('fasting.actions.start') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  show: boolean
}

interface GoalOption {
  hours: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  confirm: [goal: number]
  cancel: []
}>()

const selectedGoal = ref<number | null>(null)

const goals: GoalOption[] = [
  { hours: 10 },
  { hours: 12 },
  { hours: 16 },
  { hours: 18 },
  { hours: 20 },
  { hours: 24 }
]

function selectGoal(hours: number) {
  selectedGoal.value = hours
}

function confirm() {
  if (selectedGoal.value) {
    emit('confirm', selectedGoal.value)
    selectedGoal.value = null
  }
}

function cancel() {
  emit('cancel')
  selectedGoal.value = null
}
</script>

<style scoped>
.animate-scale-up {
  animation: scaleUp 0.2s ease-out;
}

@keyframes scaleUp {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
