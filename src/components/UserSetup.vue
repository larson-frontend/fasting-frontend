<template>
  <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-md mx-4">
      <!-- Header -->
      <div class="text-center mb-6">
        <div class="w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {{ $t('user.welcome') }}
        </h2>
        <p class="text-gray-600 dark:text-gray-300">
          {{ $t('user.subtitle') }}
        </p>
        
        <!-- Mock-Mode Hinweis - klein und prominent -->
        <div v-if="isMockMode" class="mt-3 px-2 py-1 bg-amber-50 border border-amber-200 rounded-md">
          <div class="text-xs text-amber-700">
            🧪 <strong>Mock-Modus:</strong> Verwende <code class="bg-amber-100 px-1 rounded">test_user</code>
          </div>
        </div>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Username or Email -->
        <div>
          <label for="identifier" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ $t('user.usernameOrEmail') }}
          </label>
          <input
            id="identifier"
            v-model="identifier"
            type="text"
            required
            :placeholder="$t('user.usernameOrEmailPlaceholder')"
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                   bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                   focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                   placeholder-gray-400 dark:placeholder-gray-500"
          >
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {{ $t('user.identifierHint') }}
          </p>
        </div>

        <!-- Language Selection -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ $t('user.preferredLanguage') }}
          </label>
          <div class="grid grid-cols-2 gap-3">
            <button
              type="button"
              @click="selectLanguage('en')"
              :class="[
                'flex items-center justify-center p-3 border-2 rounded-lg transition-all',
                selectedLanguage === 'en' 
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30' 
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
              ]"
            >
              <span class="text-2xl mr-2">🇺🇸</span>
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('languages.en') }}</span>
            </button>
            <button
              type="button"
              @click="selectLanguage('de')"
              :class="[
                'flex items-center justify-center p-3 border-2 rounded-lg transition-all',
                selectedLanguage === 'de' 
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30' 
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
              ]"
            >
              <span class="text-2xl mr-2">🇩🇪</span>
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('languages.de') }}</span>
            </button>
          </div>
        </div>

        <!-- Error Message -->
    <div v-if="error" class="mb-4 p-4 rounded-lg border" :class="errorClass" data-testid="error-message">
      <div class="flex items-center space-x-2">
        <svg class="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="errorIcon" />
        </svg>
        <div>
          <h3 class="font-semibold text-sm">
            {{ errorType === 'USER_EXISTS' ? t('user.userExistsTitle') : t('user.errorTitle') }}
          </h3>
          <p class="text-sm mt-1">
            {{ errorType === 'USER_EXISTS' ? t('user.tryDifferentIdentifier') : error }}
          </p>
        </div>
      </div>
    </div>        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="loading || !identifier.trim()"
          class="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 
                 text-white font-medium py-3 px-4 rounded-lg transition-colors
                 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 
                 disabled:cursor-not-allowed"
        >
          <span v-if="loading" class="flex items-center justify-center">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ $t('common.loading') }}
          </span>
          <span v-else>{{ $t('user.getStarted') }}</span>
        </button>
      </form>

      <!-- Footer -->
      <div class="mt-6 text-center">
        <p class="text-xs text-gray-500 dark:text-gray-400">
          {{ $t('user.privacyNote') }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { loginOrCreateUser, getStoredLanguage } from '../api'
import type { LoginRequest } from '../types/user'

// Emits
const emits = defineEmits<{
  success: [user: any]
  error: [error: string]
}>()

// Composables
const { locale, t } = useI18n()

// Reactive Data
const identifier = ref('')
const selectedLanguage = ref<'en' | 'de'>('en')
const loading = ref(false)
const error = ref('')
const errorType = ref('')

// Computed Properties
const errorClass = computed(() => {
  if (errorType.value === 'USER_EXISTS') {
    return 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-700 dark:bg-amber-900/20 dark:text-amber-200'
  }
  return 'border-red-200 bg-red-50 text-red-800 dark:border-red-700 dark:bg-red-900/20 dark:text-red-200'
})

const errorIcon = computed(() => {
  if (errorType.value === 'USER_EXISTS') {
    return 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z'
  }
  return 'M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
})

// Helper function to detect if input is email
const isEmail = (input: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(input)
}

// Language selection handler
const selectLanguage = (lang: 'en' | 'de') => {
  selectedLanguage.value = lang
  locale.value = lang
}

// Methods
const handleSubmit = async () => {
  if (!identifier.value.trim()) return

  loading.value = true
  error.value = ''
  errorType.value = ''

  try {
    const trimmedIdentifier = identifier.value.trim()
    const request: LoginRequest = isEmail(trimmedIdentifier) 
      ? { email: trimmedIdentifier }
      : { username: trimmedIdentifier }

    const response = await loginOrCreateUser(request)
    
    // Sprache sofort setzen
    locale.value = selectedLanguage.value
    
    emits('success', response.user)
  } catch (err: any) {
    // Handle different error types
    if (err.code === 'USER_EXISTS') {
      errorType.value = 'USER_EXISTS'
      error.value = err.message
    } else {
      errorType.value = 'GENERAL_ERROR'
      error.value = err.message || 'An error occurred'
    }
    emits('error', error.value)
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(() => {
  // Gespeicherte Sprache als Default verwenden
  selectedLanguage.value = getStoredLanguage()
  locale.value = selectedLanguage.value
})

// Environment-driven mock indicator without touching mocked module exports
const isMockMode = computed(() => Boolean(import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_DATA === 'true'))
</script>
