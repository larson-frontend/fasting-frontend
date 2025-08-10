<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { startFast, stopFast, statusFast, historyFast } from './api'
import WelcomeScreen from './components/WelcomeScreen.vue'
import ConfirmDialog from './components/ConfirmDialog.vue'
import StatusCard from './components/StatusCard.vue'
import HistoryCard from './components/HistoryCard.vue'

const loading = ref(false)
const stat = ref<{active?: boolean; hours?: number; minutes?: number; since?: string}>({})
const items = ref<any[]>([])
const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:8080/api'

const showWelcome = ref(true)
const showDialog = ref(false)
const dialogAction = ref<'start' | 'stop' | null>(null)

function enterApp() {
  showWelcome.value = false
}

function confirmAction(action: 'start' | 'stop') {
  dialogAction.value = action
  showDialog.value = true
}

async function handleDialogConfirm() {
  showDialog.value = false
  if (dialogAction.value === 'start') {
    await onStart()
  } else if (dialogAction.value === 'stop') {
    await onStop()
  }
  dialogAction.value = null
}

function handleDialogCancel() {
  showDialog.value = false
  dialogAction.value = null
}

async function refresh() {
  loading.value = true
  try {
    stat.value = await statusFast()
    items.value = await historyFast()
  } finally { loading.value = false }
}

async function onStart() { await startFast(); await refresh() }
async function onStop()  { try { await stopFast(); } catch {} await refresh() }
onMounted(refresh)
</script>

<template>
  <!-- Welcome Screen -->
  <WelcomeScreen v-if="showWelcome" @enter="enterApp" />

  <!-- Main App -->
  <div v-else class="min-h-screen bg-gray-50 text-gray-900">
    <div class="max-w-xl mx-auto p-6 space-y-6">
      <div class="flex items-center gap-3 mb-2">
        <img src="./assets/logo.png" alt="Logo" class="h-10 w-10 rounded-full shadow" />
        <h1 class="text-2xl font-bold">Fasting Tracker</h1>
      </div>
      
      <StatusCard :status="stat" @start="confirmAction('start')" @stop="confirmAction('stop')" />
      
      <HistoryCard :items="items" :loading="loading" @refresh="refresh" />
      
      <p class="text-xs text-gray-400">API: {{ apiBase }}</p>
    </div>
  </div>

  <!-- Dialog -->
  <ConfirmDialog 
    :show="showDialog" 
    :action="dialogAction" 
    @confirm="handleDialogConfirm" 
    @cancel="handleDialogCancel" 
  />
</template>

<style scoped></style>
