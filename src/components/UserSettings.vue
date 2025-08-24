<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
          <svg class="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
        </div>
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ $t('user.settings') }}
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ currentUser?.username || $t('common.unknownUser') }}
          </p>
        </div>
      </div>
      <button
        @click="closeModal"
        class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        data-testid="close-button"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>

    <!-- Settings Form -->
    <div class="space-y-6">
      <!-- Language Selection -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          {{ $t('user.language') }}
        </label>
        <div class="grid grid-cols-2 gap-3">
          <button
            @click="changeLanguage('en')"
            :class="[
              'flex items-center justify-center p-3 border-2 rounded-lg transition-all',
              preferences.language === 'en' 
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30' 
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
            ]"
            data-testid="language-en"
          >
            <span class="text-2xl mr-2">🇺🇸</span>
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('languages.en') }}</span>
          </button>
          <button
            @click="changeLanguage('de')"
            :class="[
              'flex items-center justify-center p-3 border-2 rounded-lg transition-all',
              preferences.language === 'de' 
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30' 
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
            ]"
            data-testid="language-de"
          >
            <span class="text-2xl mr-2">🇩🇪</span>
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('languages.de') }}</span>
          </button>
        </div>
      </div>

      <!-- Theme Selection -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          {{ $t('user.theme') }}
        </label>
        <div class="grid grid-cols-3 gap-2">
          <button
            @click="changeTheme('light')"
            :class="[
              'flex flex-col items-center p-3 border-2 rounded-lg transition-all',
              preferences.theme === 'light' 
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30' 
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
            ]"
          >
            <svg class="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
            </svg>
            <span class="text-xs font-medium">{{ $t('user.light') }}</span>
          </button>
          <button
            @click="changeTheme('dark')"
            :class="[
              'flex flex-col items-center p-3 border-2 rounded-lg transition-all',
              preferences.theme === 'dark' 
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30' 
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
            ]"
          >
            <svg class="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
            </svg>
            <span class="text-xs font-medium">{{ $t('user.dark') }}</span>
          </button>
          <button
            @click="changeTheme('system')"
            :class="[
              'flex flex-col items-center p-3 border-2 rounded-lg transition-all',
              preferences.theme === 'system' 
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30' 
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
            ]"
          >
            <svg class="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
            <span class="text-xs font-medium">{{ $t('user.system') }}</span>
          </button>
        </div>
      </div>

      <!-- Notifications -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          {{ $t('user.notifications') }}
        </label>
        <div class="space-y-4">
          <!-- Enable Notifications Master Switch -->
          <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Enable Notifications</span>
              <p class="text-xs text-gray-500 dark:text-gray-400">Master control for all notifications</p>
            </div>
            <toggle-switch 
              :value="preferences.notifications.enabled"
              @change="updateNotifications('enabled', $event)"
            />
          </div>
          
          <!-- Individual Notification Settings (only if enabled) -->
          <div v-if="preferences.notifications.enabled" class="space-y-3 ml-4 border-l-2 border-gray-200 dark:border-gray-600 pl-4">
            <div class="flex items-center justify-between">
              <div>
                <span class="text-sm text-gray-700 dark:text-gray-300">{{ $t('user.fastingReminders') }}</span>
                <p class="text-xs text-gray-500 dark:text-gray-400">Get reminded when to start/stop fasting</p>
              </div>
              <toggle-switch 
                :value="preferences.notifications.fastingReminders"
                @change="updateNotifications('fastingReminders', $event)"
              />
            </div>
            
            <div class="flex items-center justify-between">
              <div>
                <span class="text-sm text-gray-700 dark:text-gray-300">{{ $t('user.mealReminders') }}</span>
                <p class="text-xs text-gray-500 dark:text-gray-400">Get reminded when your eating window opens</p>
              </div>
              <toggle-switch 
                :value="preferences.notifications.mealReminders"
                @change="updateNotifications('mealReminders', $event)"
              />
            </div>
            
            <div class="flex items-center justify-between">
              <div>
                <span class="text-sm text-gray-700 dark:text-gray-300">{{ $t('user.progressUpdates') }}</span>
                <p class="text-xs text-gray-500 dark:text-gray-400">Weekly progress summaries</p>
              </div>
              <toggle-switch 
                :value="preferences.notifications.progressUpdates"
                @change="updateNotifications('progressUpdates', $event)"
              />
            </div>
            
            <div class="flex items-center justify-between">
              <div>
                <span class="text-sm text-gray-700 dark:text-gray-300">Goal Achievements</span>
                <p class="text-xs text-gray-500 dark:text-gray-400">Celebrate when you reach your goals</p>
              </div>
              <toggle-switch 
                :value="preferences.notifications.goalAchievements"
                @change="updateNotifications('goalAchievements', $event)"
              />
            </div>
            
            <div class="flex items-center justify-between">
              <div>
                <span class="text-sm text-gray-700 dark:text-gray-300">Weekly Reports</span>
                <p class="text-xs text-gray-500 dark:text-gray-400">Summary of your weekly fasting activity</p>
              </div>
              <toggle-switch 
                :value="preferences.notifications.weeklyReports"
                @change="updateNotifications('weeklyReports', $event)"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Fasting Defaults -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Fasting Preferences
        </label>
        <div class="space-y-4">
          <!-- Default Goal Hours -->
          <div>
            <label class="block text-sm text-gray-700 dark:text-gray-300 mb-2">
              Default Fasting Goal (hours)
            </label>
            <select 
              v-model="preferences.fastingDefaults.defaultGoalHours"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="12">12 hours</option>
              <option value="14">14 hours</option>
              <option value="16">16 hours (16:8)</option>
              <option value="18">18 hours</option>
              <option value="20">20 hours (20:4)</option>
              <option value="24">24 hours (OMAD)</option>
              <option value="36">36 hours</option>
              <option value="48">48 hours</option>
            </select>
          </div>
          
          <!-- Preferred Fasting Type -->
          <div>
            <label class="block text-sm text-gray-700 dark:text-gray-300 mb-2">
              Preferred Fasting Type
            </label>
            <div class="grid grid-cols-3 gap-2">
              <button
                @click="preferences.fastingDefaults.preferredFastingType = '16:8'"
                :class="[
                  'p-3 text-sm border-2 rounded-lg transition-all',
                  preferences.fastingDefaults.preferredFastingType === '16:8'
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                ]"
              >
                16:8
              </button>
              <button
                @click="preferences.fastingDefaults.preferredFastingType = '18:6'"
                :class="[
                  'p-3 text-sm border-2 rounded-lg transition-all',
                  preferences.fastingDefaults.preferredFastingType === '18:6'
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                ]"
              >
                18:6
              </button>
              <button
                @click="preferences.fastingDefaults.preferredFastingType = '24h'"
                :class="[
                  'p-3 text-sm border-2 rounded-lg transition-all',
                  preferences.fastingDefaults.preferredFastingType === '24h'
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                ]"
              >
                24h
              </button>
            </div>
          </div>
          
          <!-- Auto Start Next Fast -->
          <div class="flex items-center justify-between">
            <div>
              <span class="text-sm text-gray-700 dark:text-gray-300">Auto-start next fast</span>
              <p class="text-xs text-gray-500 dark:text-gray-400">Automatically begin a new fast after completing one</p>
            </div>
            <toggle-switch 
              :value="preferences.fastingDefaults.autoStartNextFast"
              @change="preferences.fastingDefaults.autoStartNextFast = $event"
            />
          </div>
        </div>
      </div>

      <!-- Save Button -->
      <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
        <!-- Success/Error Message -->
        <div v-if="saveMessage" class="mb-4 p-3 rounded-lg" :class="saveMessageClass">
          <div class="flex items-center">
            <svg v-if="saveStatus === 'success'" class="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            <svg v-else-if="saveStatus === 'error'" class="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
            <span class="text-sm font-medium">{{ saveMessage }}</span>
          </div>
        </div>
        
        <button
          @click="savePreferences"
          :disabled="saving"
          class="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 
                 text-white font-medium py-3 px-4 rounded-lg transition-colors
                 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 
                 disabled:cursor-not-allowed"
        >
          <span v-if="saving" class="flex items-center justify-center">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ $t('common.saving') }}
          </span>
          <span v-else>{{ $t('common.save') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { getCurrentUser, updateUserPreferences, changeUserLanguage } from '../api'
import type { User, UserPreferences } from '../types/user'
import ToggleSwitch from './ToggleSwitch.vue'

// Emits
const emits = defineEmits<{
  close: []
  updated: [user: User]
}>()

// Composables
const { locale } = useI18n()

// Reactive Data
const currentUser = ref<User | null>(null)
const preferences = reactive<UserPreferences>({
  language: 'en',
  theme: 'system',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  notifications: {
    enabled: true,
    fastingReminders: true,
    mealReminders: true,
    progressUpdates: false,
    goalAchievements: true,
    weeklyReports: false
  },
  fastingDefaults: {
    defaultGoalHours: 16,
    preferredFastingType: '16:8',
    autoStartNextFast: false
  }
})
const saving = ref(false)
const saveMessage = ref('')
const saveStatus = ref<'success' | 'error' | null>(null)

// Computed
const saveMessageClass = computed(() => {
  if (saveStatus.value === 'success') {
    return 'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200'
  } else if (saveStatus.value === 'error') {
    return 'bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'
  }
  return ''
})

// Methods
const closeModal = () => {
  emits('close')
}

const changeLanguage = async (language: 'en' | 'de') => {
  try {
    preferences.language = language
    locale.value = language
    
    if (currentUser.value) {
      await changeUserLanguage(language)
    }
  } catch (error) {
    console.error('Failed to change language:', error)
  }
}

const changeTheme = (theme: 'light' | 'dark' | 'system') => {
  preferences.theme = theme
  // Apply theme immediately
  applyTheme(theme)
}

const updateNotifications = (key: keyof UserPreferences['notifications'], value: boolean) => {
  preferences.notifications[key] = value
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

const savePreferences = async () => {
  if (!currentUser.value) {
    saveStatus.value = 'error'
    saveMessage.value = 'No user logged in'
    return
  }

  saving.value = true
  saveMessage.value = ''
  saveStatus.value = null
  
  try {
    const updatedUser = await updateUserPreferences(preferences)
    currentUser.value = updatedUser
    emits('updated', updatedUser)
    
    saveStatus.value = 'success'
    saveMessage.value = 'Settings saved successfully!'
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      saveMessage.value = ''
      saveStatus.value = null
    }, 3000)
    
  } catch (error) {
    console.error('Failed to save preferences:', error)
    saveStatus.value = 'error'
    saveMessage.value = error instanceof Error ? error.message : 'Failed to save settings'
    
    // Hide error message after 5 seconds
    setTimeout(() => {
      saveMessage.value = ''
      saveStatus.value = null
    }, 5000)
  } finally {
    saving.value = false
  }
}

// Lifecycle
onMounted(async () => {
  try {
    const user = await getCurrentUser()
    if (user) {
      currentUser.value = user
      Object.assign(preferences, user.preferences)
      locale.value = user.preferences.language
      applyTheme(user.preferences.theme)
    }
  } catch (error) {
    console.error('Failed to load user data:', error)
  }
})
</script>
