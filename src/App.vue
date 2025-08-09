<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { startFast, stopFast, statusFast, historyFast } from './api'
const loading = ref(false)
const stat = ref<{active?: boolean; hours?: number; minutes?: number; since?: string}>({})
const items = ref<any[]>([])
const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:8080/api'
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
  <div class="min-h-screen bg-gray-50 text-gray-900">
    <div class="max-w-xl mx-auto p-6 space-y-6">
      <h1 class="text-2xl font-bold">Fasting Tracker</h1>
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
            <button @click="onStart" class="px-3 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700">Start</button>
            <button @click="onStop" class="px-3 py-2 rounded-md bg-rose-600 text-white hover:bg-rose-700">Stop</button>
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
<style scoped></style>
