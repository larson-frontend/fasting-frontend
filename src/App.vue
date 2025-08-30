<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { startFast, stopFast, statusFast, historyFast, startUserFast, stopUserFast, fetchUserFastingHistory, fetchUserFastingStatus, getCurrentUser, isMockMode, apiBase } from './api/index'
import { fallbackApiService } from './api/fallback-service'
import './utils/error-tests' // Lade Error-Tests für Browser Console
import WelcomeScreen from './components/WelcomeScreen.vue'
import ConfirmDialog from './components/ConfirmDialog.vue'
import GoalSelectionDialog from './components/GoalSelectionDialog.vue'
import StatusCard from './components/StatusCard.vue'
import HistoryCard from './components/HistoryCard.vue'
import FastingInfoModal from './components/FastingInfoModal.vue'
import TestPanel from './components/TestPanel.vue'
import ErrorPage from './components/ErrorPage.vue'
<<<<<<< HEAD
import UserManager from './components/UserManager.vue'
import LoadingSpinner from './components/LoadingSpinner.vue'
=======
import LanguageSwitcher from './components/LanguageSwitcher.vue'
>>>>>>> dc622e2 (added translations i18n)

const loading = ref(false)
const stat = ref<{active?: boolean; hours?: number; minutes?: number; since?: string}>({})
const items = ref<any[]>([])
const currentUser = ref<any>(null)

const showWelcome = ref(true)
const showDialog = ref(false)
const showGoalDialog = ref(false)
const showInfoModal = ref(false)
const showErrorPage = ref(false)
const dialogAction = ref<'start' | 'stop' | null>(null)
const lastError = ref<Error | null>(null)

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

function handleDialogCancel() {
  showDialog.value = false
  dialogAction.value = null
}

async function handleGoalConfirm(goalHours: number) {
  showGoalDialog.value = false
  await onStart(goalHours)
}

function handleGoalCancel() {
  showGoalDialog.value = false
}

async function refresh() {
  loading.value = true
  try {
    // Use user-specific endpoints if user is available
    let status, history
    if (currentUser.value) {
      try {
        // Try user-specific status and history first
        [status, history] = await Promise.all([
          fetchUserFastingStatus(),
          fetchUserFastingHistory()
        ])
        
        // Ensure status has a proper structure
        if (!status) {
          status = { active: false }
        }
      } catch (error) {
        console.warn('User-specific endpoints failed, falling back to global:', error)
        // Fallback to global endpoints
        status = await statusFast()
        history = await historyFast()
      }
    } else {
      // No user, use global endpoints
      status = await statusFast()
      history = await historyFast()
    }
    
    // Ensure status is never null
    stat.value = status || { active: false }
    
    // Ensure history is an array
    const historyArray = Array.isArray(history) ? history : []
    
    // Sortiere: aktive Sessions zuerst, dann nach ID (neueste zuerst)
    items.value = historyArray.sort((a, b) => {
      if (a.endAt === null && b.endAt !== null) return -1
      if (a.endAt !== null && b.endAt === null) return 1
      return b.id - a.id
    })
    
    // Error-Seite schließen bei erfolgreichem Laden (nur in Production)
    if (showErrorPage.value && !isDev) {
      showErrorPage.value = false
      lastError.value = null
    }
  } catch (error) {
    console.error('API Error:', error)
    lastError.value = error as Error
    
    // Set safe defaults to prevent further errors
    stat.value = { active: false }
    items.value = []
    
    // In Production: Zeige Error-Seite
    if (!isDev) {
      showErrorPage.value = true
    }
    // In Development: Fallback-System übernimmt automatisch
  } finally { 
    loading.value = false 
  }
}

async function onStart(goalHours?: number) { 
  loading.value = true
  try {
    // Use user-specific endpoint if user is available
    if (currentUser.value) {
      try {
        const userIdentifier = currentUser.value.username || currentUser.value.email
        if (userIdentifier) {
          await startUserFast(userIdentifier, goalHours)
        } else {
          throw new Error('No user identifier available')
        }
      } catch (error) {
        console.warn('User-specific start failed, falling back to global:', error)
        await startFast(goalHours)
      }
    } else {
      await startFast(goalHours)
    }
    await refresh()
  } catch (error) {
    console.error('Start Fast Error:', error)
    lastError.value = error as Error
    
    // In Production: Zeige Error-Seite
    if (!isDev) {
      showErrorPage.value = true
    }
  } finally {
    loading.value = false
  }
}

async function onStop() { 
  loading.value = true
  try { 
    // Use user-specific endpoint if user is available
    if (currentUser.value) {
      try {
        const userIdentifier = currentUser.value.username || currentUser.value.email
        if (userIdentifier) {
          await stopUserFast(userIdentifier)
        } else {
          throw new Error('No user identifier available')
        }
      } catch (error) {
        console.warn('User-specific stop failed, falling back to global:', error)
        await stopFast()
      }
    } else {
      await stopFast()
    }
    await refresh()
  } catch (error) {
    console.error('Stop Fast Error:', error)
    lastError.value = error as Error
    
    // In Production: Zeige Error-Seite
    if (!isDev) {
      showErrorPage.value = true
    }
  } finally {
    loading.value = false
  }
}

async function handleErrorRetry() {
  showErrorPage.value = false
  lastError.value = null
  await refresh() // Versuche erneut zu laden
}

function showDebugInfo() {
  const debugInfo = fallbackApiService.getDebugInfo();
  alert(`Debug Info:\n${JSON.stringify(debugInfo, null, 2)}`);
}

onMounted(async () => {
  // Initialize current user first
  try {
    currentUser.value = await getCurrentUser()
  } catch (error) {
    console.error('Failed to get current user:', error)
    // Use fallback user ID for demo purposes
    currentUser.value = { id: 1, username: 'demo_user' }
  }
  
  // Then refresh data
  await refresh()
})
</script>

<template>
  <!-- Error Page (nur Production) -->
  <ErrorPage 
    v-if="showErrorPage && !isDev"
    :error="lastError || undefined"
    :retry-callback="handleErrorRetry"
    @retry="handleErrorRetry"
    @close="showErrorPage = false"
  />
  
  <!-- Welcome Screen -->
  <WelcomeScreen v-else-if="showWelcome" @enter="enterApp" />

  <!-- Main App -->
  <div v-else class="min-h-screen bg-gray-50 text-gray-900">
    <div class="max-w-2xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
<<<<<<< HEAD
      <!-- Header -->
      <div class="flex items-center justify-between mb-2">
        <div class="flex items-center gap-2">
          <!-- User Manager -->
          <UserManager />
        </div>
        <div class="flex items-center gap-3">
=======
      <!-- Header with Language Switcher -->
      <div class="flex items-center justify-between mb-2">
        <div class="flex items-center gap-3">
          <span class="text-2xl sm:text-3xl">🍃</span>
          <h1 class="text-xl sm:text-2xl font-bold">{{ $t('app.title') }}</h1>
        </div>
        <div class="flex items-center gap-2">
          <!-- Language Switcher -->
          <LanguageSwitcher />
>>>>>>> dc622e2 (added translations i18n)
          <!-- Info Button -->
          <button 
            @click="showInfoModal = true"
            class="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 flex items-center justify-center touch-manipulation transition-colors"
            :title="$t('fasting.phases.title')">
            <span class="text-sm sm:text-base font-bold italic">i</span>
          </button>
        </div>
      </div>
      
      <StatusCard :status="stat" @start="confirmAction('start')" @stop="confirmAction('stop')" />
      
      <HistoryCard :items="items" :loading="loading" @refresh="refresh" />
      
      <!-- Debug Info für Development -->
      <div v-if="isDev" class="text-xs text-gray-400 text-center space-y-1">
        <p>{{ isMockMode ? `🎭 ${$t('info.mock_mode')}` : `${$t('info.api')}: ${apiBase}` }}</p>
        <button 
          @click="showDebugInfo" 
          class="text-blue-500 hover:text-blue-700 underline"
        >
          {{ $t('info.show_debug') }}
        </button>
      </div>
      
      <p v-else class="text-xs text-gray-400 text-center">
        {{ isMockMode ? `🎭 ${$t('info.mock_mode')}` : `${$t('info.api')}: ${apiBase}` }}
      </p>
    </div>
  </div>

  <!-- Loading Spinner -->
  <LoadingSpinner 
    :show="loading" 
  />

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
