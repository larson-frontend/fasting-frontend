<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { startFast, stopFast, statusFast, historyFast } from './api'
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
  <div v-if="showWelcome" class="min-h-screen bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center">
    <div class="text-center">
      <div @click="enterApp" class="cursor-pointer transform transition-all duration-300 hover:scale-110 active:scale-95">
        <img src="./assets/logo.png" alt="Logo" class="h-32 w-32 mx-auto rounded-full shadow-lg animate-pulse hover:animate-bounce" />
        <h1 class="text-4xl font-bold text-emerald-800 mt-6 mb-2">Fasting Tracker</h1>
        <p class="text-emerald-600">Klicke auf das Logo zum Starten</p>
      </div>
    </div>
  </div>

  <!-- Main App -->
  <div v-else class="min-h-screen bg-gray-50 text-gray-900">
    <div class="max-w-xl mx-auto p-6 space-y-6">
      <div class="flex items-center gap-3 mb-2">
        <img src="./assets/logo.png" alt="Logo" class="h-10 w-10 rounded-full shadow" />
        <h1 class="text-2xl font-bold">Fasting Tracker</h1>
      </div>
      <div class="rounded-lg border bg-white p-4 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Status</p>
            <p class="text-lg font-semibold">
              {{ stat.active ? 'Aktiv' : 'Inaktiv' }}
              <span v-if="stat.active" class="ml-2 text-sm text-gray-500">
                ({{ stat.hours }}h {{ stat.minutes }}m)
              </span>
            </p>
            <p v-if="stat.since" class="text-xs text-gray-400">seit {{ new Date(stat.since).toLocaleString() }}</p>
          </div>
          <div class="flex gap-2">
            <button 
              @click="confirmAction('start')" 
              :disabled="stat.active" 
              :class="stat.active ? 'px-3 py-2 rounded-md bg-gray-400 text-gray-600 cursor-not-allowed' : 'px-3 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700'">
              Start
            </button>
            <button 
              @click="confirmAction('stop')" 
              :disabled="!stat.active" 
              :class="!stat.active ? 'px-3 py-2 rounded-md bg-gray-400 text-gray-600 cursor-not-allowed' : 'px-3 py-2 rounded-md bg-rose-600 text-white hover:bg-rose-700'">
              Stop
            </button>
          </div>
      <!-- Dialog -->
      <div v-if="showDialog" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
        <div class="bg-white rounded-lg shadow-lg p-6 w-80">
          <h3 class="text-lg font-semibold mb-4">Aktion bestätigen</h3>
          <p class="mb-6">Möchtest du wirklich <span class="font-bold">{{ dialogAction === 'start' ? 'Fasten starten' : 'Fasten beenden' }}</span>?</p>
          <div class="flex justify-end gap-2">
            <button @click="handleDialogCancel" class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Abbrechen</button>
            <button @click="handleDialogConfirm" class="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700" v-if="dialogAction === 'start'">Starten</button>
            <button @click="handleDialogConfirm" class="px-4 py-2 rounded bg-rose-600 text-white hover:bg-rose-700" v-if="dialogAction === 'stop'">Beenden</button>
          </div>
        </div>
      </div>
        </div>
      </div>
      <div class="rounded-lg border bg-white p-4 shadow-sm">
        <div class="flex items-center justify-between mb-2">
          <h2 class="font-semibold">Historie</h2>
          <button @click="refresh" class="text-sm px-2 py-1 rounded border hover:bg-gray-100" :disabled="loading">
            {{ loading ? 'Lädt…' : 'Aktualisieren' }}
          </button>
        </div>
        <ul class="divide-y">
          <li v-for="it in items" :key="it.id" class="py-2 text-sm">
            <div class="flex justify-between">
              <span>#{{ it.id }}</span>
              <span v-if="it.endAt" class="text-gray-500">beendet</span>
              <span v-else class="text-emerald-600">aktiv</span>
            </div>
            <div class="text-gray-600">
              <div>Start: {{ new Date(it.startAt).toLocaleString() }}</div>
              <div v-if="it.endAt">Ende: {{ new Date(it.endAt).toLocaleString() }}</div>
            </div>
          </li>
        </ul>
      </div>
  <p class="text-xs text-gray-400">API: {{ apiBase }}</p>
    </div>
  </div>
</template>
<style scoped>
@keyframes wiggle {
  0%, 100% { transform: rotate(-3deg); }
  50% { transform: rotate(3deg); }
}

.animate-wiggle {
  animation: wiggle 1s ease-in-out infinite;
}

.animate-wiggle:hover {
  animation: wiggle 0.5s ease-in-out infinite;
}
</style>
