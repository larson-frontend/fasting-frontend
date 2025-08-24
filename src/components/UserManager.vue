<template>
  <div class="user-manager">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center space-x-2">
      <div class="w-8 h-8 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      <span class="text-sm text-gray-500">{{ $t('common.loading') }}</span>
    </div>

    <!-- User Setup Modal -->
    <UserSetup
      v-else-if="showSetup"
      @success="handleUserLogin"
      @error="handleError"
    />

    <!-- User Settings Modal -->
    <div
      v-if="showSettings"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <UserSettings
        @close="showSettings = false"
        @updated="handleUserUpdate"
      />
    </div>

    <!-- User Profile Button (when logged in) -->
    <div
      v-else-if="currentUser && !showSetup && !loading"
      class="flex items-center space-x-2"
    >
      <button
        @click="showSettings = true"
        class="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <div class="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
          <svg class="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
          </svg>
        </div>
        <span>{{ currentUser.username }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { getCurrentUser, getStoredLanguage } from '../api'
import type { User } from '../types/user'
import UserSetup from './UserSetup.vue'
import UserSettings from './UserSettings.vue'

// Composables
const { locale } = useI18n()

// Reactive Data
const currentUser = ref<User | null>(null)
const showSetup = ref(false)
const showSettings = ref(false)
const loading = ref(true)

// Methods
const handleUserLogin = (user: User) => {
  currentUser.value = user
  showSetup.value = false
  
  // Set language from user preferences
  locale.value = user.preferences.language
  
  // Apply theme
  applyTheme(user.preferences.theme)
}

const handleUserUpdate = (user: User) => {
  currentUser.value = user
  showSettings.value = false
  
  // Update language if changed
  locale.value = user.preferences.language
  
  // Apply theme if changed
  applyTheme(user.preferences.theme)
}

const handleError = (error: string) => {
  console.error('User setup error:', error)
  // You could show a toast notification here
}

const applyTheme = (theme: string) => {
  const root = document.documentElement
  if (theme === 'dark') {
    root.classList.add('dark')
  } else if (theme === 'light') {
    root.classList.remove('dark')
  } else {
    // System theme
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    if (prefersDark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }
}

const initializeUser = async () => {
  loading.value = true
  try {
    const user = await getCurrentUser()
    if (user) {
      currentUser.value = user
      locale.value = user.preferences.language
      applyTheme(user.preferences.theme)
    } else {
      // No user found or session expired, show setup
      showSetup.value = true
      // Set language from stored preference or default
      locale.value = getStoredLanguage()
    }
  } catch (error) {
    console.error('Failed to initialize user:', error)
    // Show setup on error
    showSetup.value = true
    locale.value = getStoredLanguage()
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(() => {
  initializeUser()
})

// Expose current user for parent components
defineExpose({
  currentUser,
  showSettings
})
</script>

<style scoped>
/* UserManager specific styles */
</style>
