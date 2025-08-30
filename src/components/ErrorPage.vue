<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="max-w-md w-full">
      <!-- Error Icon -->
      <div class="text-center mb-8">
        <div class="w-20 h-20 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
          <svg class="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z">
            </path>
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-gray-900 mb-2">{{ $t('errors.connection_error') }}</h1>
        <p class="text-gray-600">
          {{ errorMessage }}
        </p>
      </div>

      <!-- Error Details -->
      <div class="bg-white rounded-lg border border-red-200 p-6 mb-6">
        <div class="space-y-4">
          <!-- Status -->
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-gray-700">{{ $t('errors.status') }}:</span>
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              {{ isOnline ? $t('errors.service_unavailable') : $t('errors.offline') }}
            </span>
          </div>

          <!-- Last Attempt -->
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-gray-700">{{ $t('errors.last_attempt') }}:</span>
            <span class="text-sm text-gray-600">{{ lastAttempt }}</span>
          </div>

          <!-- Error Code -->
          <div v-if="errorCode" class="flex items-center justify-between">
            <span class="text-sm font-medium text-gray-700">{{ $t('errors.error_code') }}:</span>
            <span class="text-sm font-mono text-gray-600">{{ errorCode }}</span>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="space-y-3">
        <!-- Retry Button -->
        <button
          @click="retry"
          :disabled="isRetrying"
          class="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg v-if="isRetrying" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ isRetrying ? $t('errors.retrying') : $t('errors.retry') }}
        </button>

        <!-- Refresh Page -->
        <button
          @click="refreshPage"
          class="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          {{ $t('errors.refresh_page') }}
        </button>
      </div>

      <!-- Help Section -->
      <div class="mt-8 text-center">
        <div class="text-sm text-gray-600 space-y-2">
          <p><strong>{{ $t('errors.possible_causes') }}:</strong></p>
          <ul class="text-left space-y-1 text-xs">
            <li>• {{ $t('errors.no_internet') }}</li>
            <li>• {{ $t('errors.server_unavailable') }}</li>
            <li>• {{ $t('errors.maintenance') }}</li>
            <li>• {{ $t('errors.firewall_blocked') }}</li>
          </ul>
        </div>
        
        <!-- Contact Support -->
        <div class="mt-6 pt-6 border-t border-gray-200">
          <p class="text-xs text-gray-500 mb-2">
            {{ $t('errors.problem_persists') }}
          </p>
          <a 
            href="mailto:support@fastingtracker.com" 
            class="text-xs text-blue-600 hover:text-blue-500 underline"
          >
            {{ $t('errors.contact_support') }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'

interface Props {
  error?: Error
  retryCallback?: () => Promise<void>
}

const props = defineProps<Props>()
const emit = defineEmits<{
  retry: []
  close: []
}>()

const { t } = useI18n()
const isRetrying = ref(false)
const lastAttempt = ref(new Date().toLocaleTimeString())
const onlineStatus = ref(navigator.onLine)

// Computed Properties
const errorMessage = computed(() => {
  if (!onlineStatus.value) {
    return t('errors.no_connection_message')
  }
  
  if (props.error?.message.includes('NetworkError') || props.error?.message.includes('fetch')) {
    return t('errors.service_unreachable_message')
  }
  
  return t('errors.unexpected_error')
})

const isOnline = computed(() => onlineStatus.value)

const errorCode = computed(() => {
  if (props.error) {
    // Extract error code from message or response
    if (props.error.message.includes('500')) return 'HTTP 500'
    if (props.error.message.includes('404')) return 'HTTP 404'
    if (props.error.message.includes('timeout')) return 'TIMEOUT'
    if (props.error.message.includes('NetworkError')) return 'NETWORK_ERROR'
    return 'UNKNOWN_ERROR'
  }
  return null
})

// Methods
async function retry() {
  if (isRetrying.value) return
  
  isRetrying.value = true
  lastAttempt.value = new Date().toLocaleTimeString()
  
  try {
    if (props.retryCallback) {
      await props.retryCallback()
      emit('close') // Schließe Error-Seite bei Erfolg
    } else {
      emit('retry')
    }
  } catch (error) {
    console.error('Retry failed:', error)
    // Bleibe auf Error-Seite
  } finally {
    isRetrying.value = false
  }
}

function refreshPage() {
  window.location.reload()
}

// Online/Offline Detection
function updateOnlineStatus() {
  onlineStatus.value = navigator.onLine
}

// Lifecycle
onMounted(() => {
  window.addEventListener('online', updateOnlineStatus)
  window.addEventListener('offline', updateOnlineStatus)
})

onUnmounted(() => {
  window.removeEventListener('online', updateOnlineStatus)
  window.removeEventListener('offline', updateOnlineStatus)
})
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
