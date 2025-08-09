<template>
  <div class="w-full">
    <!-- Progress Bar mit Highlight-Markierungen -->
    <div class="relative w-full bg-gray-200 rounded-lg h-6 overflow-hidden shadow-inner">
      <!-- Highlight-Punkte im Hintergrund -->
      <div class="absolute inset-0 flex items-center">
        <!-- 10h Markierung -->
        <div class="absolute h-8 w-1 bg-gray-500 -translate-y-1 shadow-sm" :style="{ left: (10/24*100) + '%' }">
          <div class="absolute -top-8 left-1/2 -translate-x-1/2 text-sm font-bold text-gray-700 bg-white px-2 py-1 rounded shadow-sm border">10</div>
        </div>
        <!-- 12h Markierung -->
        <div class="absolute h-8 w-1 bg-gray-500 -translate-y-1 shadow-sm" :style="{ left: (12/24*100) + '%' }">
          <div class="absolute -top-8 left-1/2 -translate-x-1/2 text-sm font-bold text-gray-700 bg-white px-2 py-1 rounded shadow-sm border">12</div>
        </div>
        <!-- 16h Markierung -->
        <div class="absolute h-8 w-1 bg-gray-500 -translate-y-1 shadow-sm" :style="{ left: (16/24*100) + '%' }">
          <div class="absolute -top-8 left-1/2 -translate-x-1/2 text-sm font-bold text-gray-700 bg-white px-2 py-1 rounded shadow-sm border">16</div>
        </div>
      </div>
      
      <!-- Fortschrittsbalken -->
      <div 
        class="h-full rounded-lg transition-all duration-500 ease-out relative shadow-md"
        :class="progressBarColor"
        :style="{ width: progressWidth + '%' }">
        <div class="h-full bg-gradient-to-r from-white/30 to-transparent rounded-lg"></div>
        <!-- Glanz-Effekt -->
        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-lg"></div>
      </div>
    </div>
    
    <!-- Zeit-Labels -->
    <div class="flex justify-between text-sm text-gray-600 mt-10 font-medium">
      <span>0h</span>
      <span>24h</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'

interface Props {
  hours: number
  minutes: number
}

const props = defineProps<Props>()

const totalMinutes = computed(() => props.hours * 60 + props.minutes)
const currentHours = computed(() => props.hours)
const currentMinutes = computed(() => props.minutes)

// Progress basiert auf 24h Maximum (1440 Minuten)
const progressWidth = computed(() => {
  const maxMinutes = 24 * 60 // 24 Stunden
  return Math.min((totalMinutes.value / maxMinutes) * 100, 100)
})

const progressBarColor = computed(() => {
  const hours = props.hours
  
  if (hours < 10) {
    return 'bg-gradient-to-r from-red-500 to-red-600'
  } else if (hours < 12) {
    return 'bg-gradient-to-r from-orange-500 to-orange-600'
  } else {
    return 'bg-gradient-to-r from-emerald-500 to-emerald-600'
  }
})

// Notification system
let lastNotifiedHour = 0

const sendNotification = (hours: number, message: string) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('🎉 Fasten Meilenstein erreicht!', {
      body: message,
      icon: '/favicon.ico',
      tag: `fasting-${hours}h`
    })
  }
}

const requestNotificationPermission = () => {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission()
  }
}

// Überwache Stunden-Änderungen für Notifications
watch(() => props.hours, (newHours, oldHours) => {
  // Nur bei Erhöhung der Stunden und wenn es ein neuer Meilenstein ist
  if (newHours > oldHours && newHours > lastNotifiedHour) {
    if (newHours >= 10 && lastNotifiedHour < 10) {
      sendNotification(10, '🔥 Fettverbrennung aktiviert! Du hast 10 Stunden erreicht.')
      lastNotifiedHour = 10
    } else if (newHours >= 12 && lastNotifiedHour < 12) {
      sendNotification(12, '💚 Ketose beginnt! 12 Stunden Fasten geschafft.')
      lastNotifiedHour = 12
    } else if (newHours >= 16 && lastNotifiedHour < 16) {
      sendNotification(16, '🧠 Autophagie aktiviert! 16 Stunden - fantastisch!')
      lastNotifiedHour = 16
    }
  }
}, { immediate: false })

// Request notification permission on component mount
requestNotificationPermission()
</script>
