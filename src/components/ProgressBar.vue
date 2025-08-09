<template>
  <div class="w-full">
    <!-- Progress Kachel im gleichen Stil wie Info-Modal -->
    <div class="relative rounded-lg overflow-hidden border-2 h-16" :class="borderClass">
      <!-- Progress Hintergrund mit Gradient (wie Info-Kacheln) -->
      <div class="absolute inset-0"
           :style="{ 
             background: progressGradient
           }">
      </div>
      
      <!-- Content Overlay -->
      <div class="relative h-full flex items-center justify-between px-4 bg-white/10 backdrop-blur-sm">
        <!-- Zeit-Anzeige links -->
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full flex items-center justify-center" :class="iconBackgroundClass">
            <svg class="w-5 h-5" :class="iconColorClass" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div>
            <div class="font-semibold text-sm" :class="textClass">
              {{ displayHours }}h {{ displayMinutes }}m
            </div>
            <div class="text-xs opacity-75" :class="textClass">
              {{ currentPhaseName }}
            </div>
          </div>
        </div>
        
        <!-- Progress Prozent rechts -->
        <div class="text-right">
          <div class="font-bold text-lg" :class="textClass">
            {{ progressWidth.toFixed(0) }}%
          </div>
          <div class="text-xs opacity-75" :class="textClass">
            von 16h
          </div>
        </div>
      </div>
      
      <!-- 16h Linie mit Label -->
      <div class="absolute right-0 top-0 h-full w-px bg-gray-400 z-10">
        <div class="absolute -top-6 right-0 text-xs font-bold text-gray-700 bg-white px-2 py-1 rounded shadow-sm border">
          16 std
        </div>
      </div>
      
      <!-- Milestone Markierungen (subtil) -->
      <div class="absolute inset-0 flex items-center pointer-events-none">
        <!-- 4h Markierung -->
        <div class="absolute h-full w-px bg-white/30" :style="{ left: (4/16*100) + '%' }"></div>
        <!-- 8h Markierung -->
        <div class="absolute h-full w-px bg-white/30" :style="{ left: (8/16*100) + '%' }"></div>
        <!-- 12h Markierung -->
        <div class="absolute h-full w-px bg-white/30" :style="{ left: (12/16*100) + '%' }"></div>
      </div>
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

// TEST: Überschreibung für 17 Stunden Demo
const testHours = 17
const testMinutes = 30

const totalMinutes = computed(() => testHours * 60 + testMinutes)

// Zeige Test-Werte in der Anzeige
const displayHours = testHours
const displayMinutes = testMinutes

// Progress basiert auf 16h als 100%
const progressWidth = computed(() => {
  const maxMinutes = 16 * 60 // 16 Stunden = 100%
  return Math.min((totalMinutes.value / maxMinutes) * 100, 100)
})

// Bestimme aktuelle Phase basierend auf Test-Stunden
const currentPhase = computed(() => {
  const hours = testHours
  
  if (hours < 3) return 'early'
  if (hours < 8) return 'warming'
  if (hours < 12) return 'burning'
  if (hours < 16) return 'ketosis'
  return 'deep'
})

// Phasen-Name
const currentPhaseName = computed(() => {
  const phaseNames = {
    early: 'Anfangsphase',
    warming: 'Aufwärmphase', 
    burning: 'Fettverbrennung',
    ketosis: 'Ketose',
    deep: 'Tiefe Ketose'
  }
  return phaseNames[currentPhase.value]
})

// Progress Gradient (Sanfteres Orange bis 16h, dann komplett Grün ab 16h)
const progressGradient = computed(() => {
  const hours = testHours
  
  if (hours < 16) {
    // Sanfteres Orange mit mehr Opacity bis 16h
    const progress = progressWidth.value
    const baseColor = 'rgba(251, 146, 60, 0.6)' // orange-300 mit 60% opacity
    const lightColor = 'rgba(255, 237, 213, 0.8)' // orange-50 mit 80% opacity
    return `linear-gradient(to right, ${baseColor} 0%, ${baseColor} ${progress}%, ${lightColor} ${progress}%, ${lightColor} 100%)`
  } else {
    // Ab 16h: Komplett grüne Kachel - kein Gradient mehr nötig
    const baseColor = 'rgb(52 211 153)' // emerald-300
    return `linear-gradient(to right, ${baseColor} 0%, ${baseColor} 100%)`
  }
})

// Border-Klassen (Orange bis 16h, dann Grün)
const borderClass = computed(() => {
  return testHours < 16 ? 'border-orange-200' : 'border-emerald-200'
})

// Icon-Hintergrund-Klassen (Orange bis 16h, dann Grün)
const iconBackgroundClass = computed(() => {
  return testHours < 16 ? 'bg-orange-100' : 'bg-emerald-100'
})

// Icon-Farb-Klassen (Orange bis 16h, dann Grün)
const iconColorClass = computed(() => {
  return testHours < 16 ? 'text-orange-600' : 'text-emerald-600'
})

// Text-Farb-Klassen (Orange bis 16h, dann Grün)
const textClass = computed(() => {
  return testHours < 16 ? 'text-orange-900' : 'text-emerald-900'
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
    if (newHours >= 3 && lastNotifiedHour < 3) {
      sendNotification(3, '🚀 Aufwärmphase erreicht! 3 Stunden geschafft.')
      lastNotifiedHour = 3
    } else if (newHours >= 8 && lastNotifiedHour < 8) {
      sendNotification(8, '🔥 Fettverbrennung startet! 8 Stunden erreicht.')
      lastNotifiedHour = 8
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
