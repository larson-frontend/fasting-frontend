<template>
  <button
    @click="toggle"
    :disabled="disabled"
    :class="[
      'relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2',
      disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
      value ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'
    ]"
    role="switch"
    :aria-checked="value"
  >
    <span
      :class="[
        'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
        value ? 'translate-x-5' : 'translate-x-0'
      ]"
    />
  </button>
</template>

<script setup lang="ts">
// Props
const props = defineProps<{
  value: boolean
  disabled?: boolean
}>()

// Emits
const emits = defineEmits<{
  change: [value: boolean]
}>()

// Methods
const toggle = () => {
  if (!props.disabled) {
    emits('change', !props.value)
  }
}
</script>
