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
            von {{ maxHours }}h
          </div>
        </div>
      </div>
      
      <!-- Visuelle Trennlinie bei Ziel für >Ziel Szenarien -->
      <div v-if="activeHours >= effectiveGoal" 
           class="absolute top-0 bottom-0 w-0.5 bg-emerald-600 z-10"
           :style="{ left: (effectiveGoal / maxHours * 100) + '%' }">
        <!-- Kleine Markierung oben -->
        <div class="absolute -top-1 -left-1 w-2 h-2 bg-emerald-600 rounded-full"></div>
        <!-- Zeitanzeige -->
        <div class="absolute -top-6 -left-4 text-xs font-bold text-emerald-600">
          {{ effectiveGoal }}h
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
import { getTestData, isTestModeActive } from '../utils/testScenarios'

interface Props {
  hours: number
  minutes: number
  goalHours?: number // Benutzerdefiniertes Ziel (Standard: 16h)
}

const props = defineProps<Props>()

// Verwende Test-Daten falls Test-Modus aktiv, sonst echte Props-Daten
const activeHours = computed(() => {
  const testData = getTestData()
  return testData ? testData.hours : props.hours
})

const activeMinutes = computed(() => {
  const testData = getTestData()
  return testData ? testData.minutes : props.minutes
})

const totalMinutes = computed(() => activeHours.value * 60 + activeMinutes.value)

// Effektives Ziel: Benutzerdefiniert oder Standard 16h
const effectiveGoal = computed(() => props.goalHours || 16)

// Zeige aktive Werte in der Anzeige
const displayHours = computed(() => activeHours.value)
const displayMinutes = computed(() => activeMinutes.value)

// Maximale Stunden basierend auf aktueller Phase und Ziel
const maxHours = computed(() => {
  const goal = effectiveGoal.value
  return activeHours.value < goal ? goal : Math.max(goal + 8, 24) // +8h Bonus oder mindestens 24h
})

// Progress basiert auf Ziel oder Ziel+Bonus je nach Status
const progressWidth = computed(() => {
  const hours = activeHours.value
  const goal = effectiveGoal.value
  
  if (hours < goal) {
    // Bis Ziel: normale Berechnung auf Ziel-Basis
    const maxMinutes = goal * 60 // Ziel-Stunden = 100%
    return Math.min((totalMinutes.value / maxMinutes) * 100, 100)
  } else {
    // Ab Ziel: Umstellung auf erweiterte Basis (Ziel + 8h oder mindestens 24h)
    const extendedMax = Math.max(goal + 8, 24)
    const maxMinutes = extendedMax * 60
    return Math.min((totalMinutes.value / maxMinutes) * 100, 100)
  }
})

// Bestimme aktuelle Phase basierend auf Stunden und Ziel
const currentPhase = computed(() => {
  const hours = activeHours.value
  const goal = effectiveGoal.value
  
  if (hours < 3) return 'early'
  if (hours < 8) return 'warming'
  if (hours < 12) return 'burning'
  if (hours < goal) return 'ketosis'
  if (hours >= goal) return 'goal-reached'
  return 'bonus'
})

// Phasen-Name basierend auf Ziel
const currentPhaseName = computed(() => {
  const hours = activeHours.value
  const goal = effectiveGoal.value
  
  const phaseNames = {
    early: 'Anfangsphase',
    warming: 'Aufwärmphase', 
    burning: 'Fettverbrennung',
    ketosis: 'Ketose',
    'goal-reached': `${goal}h Ziel erreicht!`,
    bonus: 'Bonus-Zeit'
  }
  return phaseNames[currentPhase.value]
})

// Progress Gradient mit festen Farbbereichen (kein Verlauf) - basierend auf Ziel
const progressGradient = computed(() => {
  const hours = activeHours.value
  const goal = effectiveGoal.value
  
  if (hours < goal) {
    // Bis Ziel: Orange ohne Verlauf
    const progress = progressWidth.value
    const achievedColor = 'rgba(251, 146, 60, 0.4)' // orange-300 mit 40% opacity (heller)
    const remainingColor = 'rgba(255, 237, 213, 0.3)' // orange-50 mit 30% opacity
    return `linear-gradient(to right, ${achievedColor} 0%, ${achievedColor} ${progress}%, ${remainingColor} ${progress}%, ${remainingColor} 100%)`
  } else {
    // Ab Ziel: Getrennte feste Farbbereiche
    const extendedMax = Math.max(goal + 8, 24)
    const progress = progressWidth.value // Progress auf erweiterte Basis
    const goalProgress = (goal / extendedMax) * 100 // Ziel-Position in %
    
    const lightGreenColor = 'rgba(52, 211, 153, 0.4)' // emerald-300 mit 40% opacity (heller)
    const lightPurpleColor = 'rgba(168, 85, 247, 0.4)' // purple-400 mit 40% opacity (heller)
    const remainingColor = 'rgba(243, 232, 255, 0.3)' // purple-50 mit 30% opacity
    
    if (progress <= goalProgress) {
      // Noch unter Ziel (sollte nicht passieren, aber sicherheitshalber)
      return `linear-gradient(to right, ${lightGreenColor} 0%, ${lightGreenColor} ${progress}%, ${remainingColor} ${progress}%, ${remainingColor} 100%)`
    } else {
      // Über Ziel: Helles Grün bis Ziel, dann helles Violett ohne Verlauf
      return `linear-gradient(to right, ${lightGreenColor} 0%, ${lightGreenColor} ${goalProgress}%, ${lightPurpleColor} ${goalProgress}%, ${lightPurpleColor} ${progress}%, ${remainingColor} ${progress}%, ${remainingColor} 100%)`
    }
  }
})

// Border-Klassen (Orange bis Ziel, dann Grün)
const borderClass = computed(() => {
  return activeHours.value < effectiveGoal.value ? 'border-orange-200' : 'border-emerald-200'
})

// Icon-Hintergrund-Klassen (Orange bis Ziel, dann Grün)
const iconBackgroundClass = computed(() => {
  return activeHours.value < effectiveGoal.value ? 'bg-orange-100' : 'bg-emerald-100'
})

// Icon-Farb-Klassen (Orange bis Ziel, dann Grün)
const iconColorClass = computed(() => {
  return activeHours.value < effectiveGoal.value ? 'text-orange-600' : 'text-emerald-600'
})

// Text-Farb-Klassen (Orange bis Ziel, dann Grün)
const textClass = computed(() => {
  return activeHours.value < effectiveGoal.value ? 'text-orange-900' : 'text-emerald-900'
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
