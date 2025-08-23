<template>
  <div v-if="show" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 p-4">
    <div class="bg-white rounded-lg shadow-lg p-4 sm:p-6 w-full max-w-sm">
      <h3 class="text-lg font-semibold mb-3 sm:mb-4">
        {{ action === 'stop' ? $t('dialog.stop_fasting.title') : $t('dialog.confirm') }}
      </h3>
      <p class="mb-4 sm:mb-6 text-sm sm:text-base">
        {{ action === 'stop' ? $t('dialog.stop_fasting.message') : 
           `${$t('dialog.confirm')} ${action === 'start' ? $t('fasting.actions.start') : $t('fasting.actions.stop')}?` }}
      </p>
      <div class="flex flex-col sm:flex-row justify-end gap-2">
        <button @click="$emit('cancel')" class="px-4 py-3 sm:py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm font-medium">
          {{ $t('dialog.cancel') }}
        </button>
        <button 
          @click="$emit('confirm')" 
          :class="action === 'start' 
            ? 'px-4 py-3 sm:py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700 text-sm font-medium' 
            : 'px-4 py-3 sm:py-2 rounded bg-rose-600 text-white hover:bg-rose-700 text-sm font-medium'">
          {{ action === 'start' ? $t('fasting.actions.start') : $t('fasting.actions.stop') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  show: boolean
  action: 'start' | 'stop' | null
}

defineProps<Props>()

defineEmits<{
  confirm: []
  cancel: []
}>()
</script>
