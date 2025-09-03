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

      <!-- Theme Selection (only if feature flag is enabled) -->
      <div v-if="isFeatureEnabled('themeSelection')">
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
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('user.notifications_master.title') }}</span>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                {{ isFeatureEnabled('detailedNotifications') 
                   ? $t('user.notifications_master.desc_detailed')
                   : $t('user.notifications_master.desc_simple') }}
              </p>
            </div>
            <toggle-switch 
              :value="preferences.notifications.enabled"
              @change="updateNotifications('enabled', $event)"
            />
          </div>
          
          <!-- Individual Notification Settings (only if enabled AND feature flag is on) -->
          <div v-if="preferences.notifications.enabled && isFeatureEnabled('detailedNotifications')" 
               class="space-y-3 ml-4 border-l-2 border-gray-200 dark:border-gray-600 pl-4">
            <div class="flex items-center justify-between">
              <div>
                <span class="text-sm text-gray-700 dark:text-gray-300">{{ $t('user.fastingReminders') }}</span>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ $t('user.fastingReminders_desc') }}</p>
              </div>
              <toggle-switch 
                :value="preferences.notifications.fastingReminders"
                :disabled="!preferences.notifications.enabled"
                @change="updateNotifications('fastingReminders', $event)"
              />
            </div>
            
            <div class="flex items-center justify-between">
              <div>
                <span class="text-sm text-gray-700 dark:text-gray-300">{{ $t('user.mealReminders') }}</span>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ $t('user.mealReminders_desc') }}</p>
              </div>
              <toggle-switch 
                :value="preferences.notifications.mealReminders"
                :disabled="!preferences.notifications.enabled"
                @change="updateNotifications('mealReminders', $event)"
              />
            </div>
            
            <div class="flex items-center justify-between">
              <div>
                <span class="text-sm text-gray-700 dark:text-gray-300">{{ $t('user.progressUpdates') }}</span>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ $t('user.progressUpdates_desc') }}</p>
              </div>
              <toggle-switch 
                :value="preferences.notifications.progressUpdates"
                :disabled="!preferences.notifications.enabled"
                @change="updateNotifications('progressUpdates', $event)"
              />
            </div>
            
            <div class="flex items-center justify-between">
              <div>
                <span class="text-sm text-gray-700 dark:text-gray-300">{{ $t('user.goalAchievements') }}</span>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ $t('user.goalAchievements_desc') }}</p>
              </div>
              <toggle-switch 
                :value="preferences.notifications.goalAchievements"
                :disabled="!preferences.notifications.enabled"
                @change="updateNotifications('goalAchievements', $event)"
              />
            </div>
            
            <div class="flex items-center justify-between">
              <div>
                <span class="text-sm text-gray-700 dark:text-gray-300">{{ $t('user.weeklyReports') }}</span>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ $t('user.weeklyReports_desc') }}</p>
              </div>
              <toggle-switch 
                :value="preferences.notifications.weeklyReports"
                :disabled="!preferences.notifications.enabled"
                @change="updateNotifications('weeklyReports', $event)"
              />
            </div>
          </div>
          
          <!-- Future Features Coming Soon Message (when feature flag is off) -->
          <div v-if="preferences.notifications.enabled && !isFeatureEnabled('detailedNotifications')" 
               class="mt-3 p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div class="flex items-center">
              <svg class="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span class="text-sm text-blue-800 dark:text-blue-200">
        {{ $t('user.notifications_coming_soon') }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Fasting Defaults (only if advanced fasting feature flag is enabled) -->
      <div v-if="isFeatureEnabled('advancedFasting')">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
      {{ $t('user.fastingPreferences.title') }}
        </label>
        <div class="space-y-4">
          <!-- Default Goal Hours -->
          <div>
            <label class="block text-sm text-gray-700 dark:text-gray-300 mb-2">
        {{ $t('user.fastingPreferences.defaultGoalHours') }}
            </label>
            <select 
              v-model="preferences.fastingDefaults.defaultGoalHours"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
        <option value="12">{{ $t('user.fastingPreferences.options.12') }}</option>
        <option value="14">{{ $t('user.fastingPreferences.options.14') }}</option>
        <option value="16">{{ $t('user.fastingPreferences.options.16') }}</option>
        <option value="18">{{ $t('user.fastingPreferences.options.18') }}</option>
        <option value="20">{{ $t('user.fastingPreferences.options.20') }}</option>
        <option value="24">{{ $t('user.fastingPreferences.options.24') }}</option>
        <option value="36">{{ $t('user.fastingPreferences.options.36') }}</option>
        <option value="48">{{ $t('user.fastingPreferences.options.48') }}</option>
            </select>
          </div>
          
          <!-- Preferred Fasting Type -->
          <div>
            <label class="block text-sm text-gray-700 dark:text-gray-300 mb-2">
        {{ $t('user.fastingPreferences.preferredFastingType') }}
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
        <span class="text-sm text-gray-700 dark:text-gray-300">{{ $t('user.fastingPreferences.autoStartNextFast') }}</span>
        <p class="text-xs text-gray-500 dark:text-gray-400">{{ $t('user.fastingPreferences.autoStartNextFast_desc') }}</p>
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
import { isFeatureEnabled } from '../config/features'

// Emits
const emits = defineEmits<{
  close: []
  updated: [user: User]
}>()

// Composables
const { locale, t } = useI18n()

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
  
  // If detailed notifications are disabled, only handle the main enabled toggle
  if (!isFeatureEnabled('detailedNotifications')) {
    // For simplified mode, just toggle the main enabled state
    // Keep other notification settings as defaults but don't show them in UI
    return
  }
  
  // Full logic only when detailed notifications are enabled
  // If disabling the master notifications switch, disable all child notifications
  if (key === 'enabled' && !value) {
    preferences.notifications.fastingReminders = false
    preferences.notifications.mealReminders = false
    preferences.notifications.progressUpdates = false
    preferences.notifications.goalAchievements = false
    preferences.notifications.weeklyReports = false
  }
  
  // If enabling the master notifications switch, enable some sensible defaults
  if (key === 'enabled' && value) {
    preferences.notifications.fastingReminders = true
    preferences.notifications.mealReminders = true
    preferences.notifications.goalAchievements = true
    // Keep progressUpdates and weeklyReports as they were (user preference)
  }
  
  // If enabling any child notification, ensure master is enabled
  if (key !== 'enabled' && value && !preferences.notifications.enabled) {
    preferences.notifications.enabled = true
  }
  
  // If all child notifications are disabled, disable master switch
  if (key !== 'enabled') {
    const allChildrenDisabled = !preferences.notifications.fastingReminders &&
                               !preferences.notifications.mealReminders &&
                               !preferences.notifications.progressUpdates &&
                               !preferences.notifications.goalAchievements &&
                               !preferences.notifications.weeklyReports
    
    if (allChildrenDisabled) {
      preferences.notifications.enabled = false
    }
  }
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
  console.log('savePreferences called, currentUser:', currentUser.value);
  console.log('preferences to save:', preferences);
  
  // Prevent multiple simultaneous saves
  if (saving.value) {
    console.log('Save already in progress, ignoring');
    return;
  }
  
  saving.value = true
  saveMessage.value = ''
  saveStatus.value = null
  
  try {
    // Validate preferences object before sending
    if (!preferences || typeof preferences !== 'object') {
      throw new Error('Invalid preferences object');
    }
    
    // Convert preferences to the correct format for UpdatePreferencesRequest
    const updateRequest = {
      language: preferences.language || 'en',
      theme: preferences.theme || 'system',
      timezone: preferences.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
      notifications: preferences.notifications || {
        enabled: true,
        fastingReminders: true,
        mealReminders: true,
        progressUpdates: false,
        goalAchievements: true,
        weeklyReports: false
      },
      fastingDefaults: preferences.fastingDefaults || {
        defaultGoalHours: 16,
        preferredFastingType: '16:8',
        autoStartNextFast: false
      }
    }
    
    console.log('updateRequest to send:', updateRequest);
    const updatedUser = await updateUserPreferences(updateRequest)
    
    if (updatedUser && updatedUser.preferences) {
      // Update the current user
      currentUser.value = updatedUser
      
      // Clear and reload preferences from server response to ensure sync
      Object.keys(preferences).forEach(key => {
        delete preferences[key as keyof UserPreferences]
      })
      Object.assign(preferences, updatedUser.preferences)
      
      emits('updated', updatedUser)
      
  saveStatus.value = 'success'
  saveMessage.value = t('user.save_success')
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        saveMessage.value = ''
        saveStatus.value = null
      }, 3000)
    } else {
      throw new Error('Invalid response from server');
    }
    
  } catch (error) {
    console.error('Failed to save preferences:', error)
  saveStatus.value = 'error'
  saveMessage.value = error instanceof Error ? error.message : t('user.save_error')
    
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
  console.log('UserSettings mounted, loading user data...');
  try {
    // Always fetch fresh user data from server to ensure UI reflects current state
    const user = await getCurrentUser()
    console.log('getCurrentUser result:', user);
    if (user && user.preferences) {
      currentUser.value = user
      
      // Clear existing preferences and load fresh data from server
      Object.keys(preferences).forEach(key => {
        delete preferences[key as keyof UserPreferences]
      })
      Object.assign(preferences, user.preferences)
      
      locale.value = user.preferences.language
      applyTheme(user.preferences.theme)
      console.log('User data loaded successfully, preferences synced:', preferences);
    } else {
      console.log('No user returned from getCurrentUser or user has no preferences');
      // Set default preferences if user exists but has no preferences
      if (user) {
        currentUser.value = user
        console.log('User exists but no preferences, using defaults');
      }
    }
  } catch (error) {
    console.error('Failed to load user data:', error)
    // Don't crash the component, just use default preferences
  }
})
</script>
