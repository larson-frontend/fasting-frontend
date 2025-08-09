<template>
  <div class="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium shadow-sm border-2"
       :class="badgeColor">
    <div class="w-2 h-2 rounded-full mr-2" :class="dotColor"></div>
    {{ hours }}h {{ minutes }}m
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  hours: number
  minutes: number
}

const props = defineProps<Props>()

const badgeColor = computed(() => {
  const hours = props.hours
  
  if (hours < 10) {
    return 'bg-red-50 border-red-200 text-red-800'
  } else if (hours < 16) {
    return 'bg-orange-50 border-orange-200 text-orange-800'
  } else {
    return 'bg-emerald-50 border-emerald-200 text-emerald-800'
  }
})

const dotColor = computed(() => {
  const hours = props.hours
  
  if (hours < 10) {
    return 'bg-red-500'
  } else if (hours < 16) {
    return 'bg-orange-500'
  } else {
    return 'bg-emerald-500'
  }
})
</script>
