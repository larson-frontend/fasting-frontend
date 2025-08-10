<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { startFast, stopFast, statusFast, historyFast } from './api'
import WelcomeScreen from './components/WelcomeScreen.vue'
import ConfirmDialog from './components/ConfirmDialog.vue'
import GoalSelectionDialog from './components/GoalSelectionDialog.vue'
import StatusCard from './components/StatusCard.vue'
import HistoryCard from './components/HistoryCard.vue'
import FastingInfoModal from './components/FastingInfoModal.vue'
import TestPanel from './components/TestPanel.vue'

const loading = ref(false)
const stat = ref<{active?: boolean; hours?: number; minutes?: number; since?: string}>({})
const items = ref<any[]>([])
const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:8080/api'

const showWelcome = ref(true)
const showDialog = ref(false)
const showGoalDialog = ref(false)
const showInfoModal = ref(false)
const dialogAction = ref<'start' | 'stop' | null>(null)

// Development mode check für Test Panel
const isDev = import.meta.env.DEV

function enterApp() {
  showWelcome.value = false
}

function confirmAction(action: 'start' | 'stop') {
  if (action === 'start') {
    // Zeige Ziel-Auswahl-Dialog direkt
    showGoalDialog.value = true
  } else {
    // Für Stop zeige normalen Confirm-Dialog
    dialogAction.value = action
    showDialog.value = true
  }
}

async function handleDialogConfirm() {
  showDialog.value = false
  if (dialogAction.value === 'stop') {
    await onStop()
  }
  dialogAction.value = null
}

async function handleGoalConfirm(goalHours: number) {
  showGoalDialog.value = false
  await onStart(goalHours)
}

function handleGoalCancel() {
  showGoalDialog.value = false
}

function handleDialogCancel() {
  showDialog.value = false
  dialogAction.value = null
}

async function refresh() {
  loading.value = true
  try {
    stat.value = await statusFast()
    const history = await historyFast()
    // Sortiere: aktive Sessions zuerst, dann nach ID (neueste zuerst)
    items.value = history.sort((a, b) => {
      if (a.endAt === null && b.endAt !== null) return -1
      if (a.endAt !== null && b.endAt === null) return 1
      return b.id - a.id
    })
  } finally { loading.value = false }
}

async function onStart(goalHours?: number) { 
  await startFast(goalHours); 
  await refresh() 
}
async function onStop()  { try { await stopFast(); } catch {} await refresh() }
onMounted(refresh)
</script>

<template>
  <!-- Welcome Screen -->
  <WelcomeScreen v-if="showWelcome" @enter="enterApp" />

  <!-- Main App -->
  <div v-else class="min-h-screen bg-gray-50 text-gray-900">
    <div class="max-w-2xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div class="flex items-center justify-between mb-2">
        <div class="flex items-center gap-3">
          <img src="./assets/logo.png" alt="Logo" class="h-8 w-8 sm:h-10 sm:w-10 rounded-full shadow" />
          <h1 class="text-xl sm:text-2xl font-bold">Fasting Tracker</h1>
        </div>
        <button 
          @click="showInfoModal = true"
          class="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-100 hover:bg-blue-200 flex items-center justify-center transition-colors touch-manipulation"
          title="Fasten-Phasen Info">
          <svg class="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </button>
      </div>
      
      <!-- Zentrales Logo wenn kein Fasten aktiv -->
      <div v-if="!stat.active" class="flex justify-center py-8">
        <img src="./assets/logo.png" alt="Logo" class="h-24 w-24 sm:h-32 sm:w-32 rounded-full shadow-lg animate-bounce-gentle" />
      </div>
      
      <StatusCard :status="stat" @start="confirmAction('start')" @stop="confirmAction('stop')" />
      
      <HistoryCard :items="items" :loading="loading" @refresh="refresh" />
      
      <p class="text-xs text-gray-400 text-center">API: {{ apiBase }}</p>
    </div>
  </div>

  <!-- Dialog -->
  <ConfirmDialog 
    :show="showDialog" 
    :action="dialogAction" 
    @confirm="handleDialogConfirm" 
    @cancel="handleDialogCancel" 
  />
  
  <!-- Goal Selection Dialog -->
  <GoalSelectionDialog 
    :show="showGoalDialog" 
    @confirm="handleGoalConfirm" 
    @cancel="handleGoalCancel" 
  />
  
  <!-- Fasten Info Modal -->
  <FastingInfoModal 
    :show="showInfoModal" 
    :status="stat"
    @close="showInfoModal = false" 
  />
  
  <!-- Test Panel (nur in Development) -->
  <TestPanel v-if="isDev" />
</template>

<style scoped>
@keyframes bounce-gentle {
  0%, 100% { 
    transform: translateY(0) scale(1); 
  }
  50% { 
    transform: translateY(-8px) scale(1.05); 
  }
}

.animate-bounce-gentle {
  animation: bounce-gentle 3s ease-in-out infinite;
}
</style>

<style scoped></style>
