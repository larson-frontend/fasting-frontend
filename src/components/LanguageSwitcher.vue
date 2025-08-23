<template>
  <div class="relative">
    <!-- Language Toggle Button -->
    <button
      @click="toggleDropdown"
      class="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md hover:bg-gray-100 transition-colors"
      :class="{ 'bg-gray-100': showDropdown }"
    >
      <span class="text-lg">{{ currentFlag }}</span>
      <span class="font-medium">{{ currentLang }}</span>
      <svg 
        class="w-4 h-4 transition-transform"
        :class="{ 'rotate-180': showDropdown }"
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 9-7 7-7-7" />
      </svg>
    </button>

    <!-- Dropdown Menu -->
    <div
      v-if="showDropdown"
      class="absolute top-full right-0 mt-1 w-40 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50"
    >
      <button
        v-for="locale in availableLocales"
        :key="locale.code"
        @click="changeLanguage(locale.code)"
        class="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-50 transition-colors"
        :class="{ 'bg-blue-50 text-blue-700': locale.code === currentLocale }"
      >
        <span class="text-lg">{{ locale.flag }}</span>
        <span class="font-medium">{{ locale.name }}</span>
        <svg 
          v-if="locale.code === currentLocale"
          class="w-4 h-4 ml-auto text-blue-600" 
          fill="currentColor" 
          viewBox="0 0 24 24"
        >
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
        </svg>
      </button>
    </div>

    <!-- Click Outside Overlay -->
    <div
      v-if="showDropdown"
      @click="closeDropdown"
      class="fixed inset-0 z-40"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { setLocale, getCurrentLocale, availableLocales, type MessageLanguages } from '../i18n'

const { locale } = useI18n()
const showDropdown = ref(false)

const currentLocale = computed(() => getCurrentLocale())

const currentFlag = computed(() => {
  const current = availableLocales.find(l => l.code === currentLocale.value)
  return current?.flag || '🇩🇪'
})

const currentLang = computed(() => {
  const current = availableLocales.find(l => l.code === currentLocale.value)
  return current?.name || 'Deutsch'
})

function toggleDropdown() {
  showDropdown.value = !showDropdown.value
}

function closeDropdown() {
  showDropdown.value = false
}

function changeLanguage(newLocale: MessageLanguages) {
  setLocale(newLocale)
  closeDropdown()
}

// Close dropdown on escape key
function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>
