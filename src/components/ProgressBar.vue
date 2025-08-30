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
      
      <!-- Subtile Trennlinien zwischen Farbzonen -->
      <div v-if="activeHours >= effectiveGoal" class="absolute inset-0 pointer-events-none">
        <!-- Linie zwischen Grün und Blau-Türkis (am Ziel-Punkt) -->
        <div class="absolute top-0 bottom-0 w-px bg-white/40 shadow-sm" 
             data-testid="goal-separation-line"
             :style="{ left: ((goalHours || 16) / maxHours * 100) + '%' }">
        </div>
        <!-- Linie zwischen Blau-Türkis und Hintergrund (am aktuellen Progress) -->
        <div class="absolute top-0 bottom-0 w-px bg-white/30" 
             :style="{ left: progressWidth + '%' }">
        </div>
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
            <div class="font-semibold text-sm" data-testid="progress-time" :class="textClass">
              {{ displayHours }}h {{ displayMinutes }}m
            </div>
            <div class="text-xs opacity-75" data-testid="progress-phase" :class="textClass">
              {{ currentPhaseName }}
            </div>
          </div>
        </div>
        
        <!-- Progress Prozent rechts -->
        <div class="text-right">
          <div class="font-bold text-lg" data-testid="progress-percentage" :class="textClass">
            {{ progressWidth.toFixed(0) }}%
          </div>
          <div class="text-xs opacity-75" data-testid="progress-max" :class="textClass">
            {{ $t('fasting.progress.of') }} {{ maxHours }}h
          </div>
        </div>
      </div>
      
      <!-- Konsolidierte GoalLine-Komponente für beide Ziel-Linien -->
      <GoalLine
        v-if="activeHours >= effectiveGoal"
        :position="effectiveGoal / maxHours * 100"
        color="emerald-600"
        :label="effectiveGoal + 'h'"
        :showMarker="true"
        :labelClass="'text-emerald-600'"
        :markerClass="'bg-emerald-600'"
      />
      <GoalLine
        :position="(goalHours || 16) / maxHours * 100"
        color="gray-400"
        :label="goalHours || 16"
        :showMarker="false"
        :labelClass="'text-gray-700 bg-white px-2 py-1 rounded shadow-sm border'"
        :markerClass="''"
      />
      
      <!-- Milestone Markierungen (subtil) -->
      <div class="absolute inset-0 flex items-center pointer-events-none">
        <template v-for="milestone in milestones" :key="milestone">
          <div class="absolute h-full w-px bg-white/30" :style="{ left: (milestone / maxHours * 100) + '%' }"></div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { getTestData, isTestModeActive } from '../utils/testScenarios'

interface Props {
  hours: number
  minutes: number
  goalHours?: number // Benutzerdefiniertes Ziel (Standard: 16h)
}

const props = defineProps<Props>()
const { t } = useI18n()

// Verwende Test-Daten falls Test-Modus aktiv, sonst echte Props-Daten
// Ensure we always work with safe numeric values (avoid NaN UI)
const activeHours = computed(() => {
  const testData = getTestData()
  const raw = testData ? testData.hours : props.hours
  const n = Number(raw)
  return Number.isFinite(n) && n >= 0 ? n : 0
})

const activeMinutes = computed(() => {
  const testData = getTestData()
  const raw = testData ? testData.minutes : props.minutes
  const n = Number(raw)
  return Number.isFinite(n) && n >= 0 ? n : 0
})

const totalMinutes = computed(() => (activeHours.value * 60) + activeMinutes.value)

// Effektives Ziel: Benutzerdefiniert oder Standard 16h (coerced to number > 0)
const effectiveGoal = computed(() => {
  const raw = props.goalHours ?? 16
  const n = Number(raw)
  return Number.isFinite(n) && n > 0 ? n : 16
})

// Zeige aktive Werte in der Anzeige
const displayHours = computed(() => activeHours.value)
const displayMinutes = computed(() => activeMinutes.value)

// Maximale Stunden basierend auf aktueller Phase und Ziel
const maxHours = computed(() => {
  const goal = effectiveGoal.value
  // Guard: goal must be a positive number
  if (!Number.isFinite(goal) || goal <= 0) return 16
  return activeHours.value < goal ? goal : Math.max(goal + 8, 24) // +8h Bonus oder mindestens 24h
})

// Progress basiert auf Ziel oder Ziel+Bonus je nach Status
const progressWidth = computed(() => {
  const hours = activeHours.value
  const goal = effectiveGoal.value
  
  if (!Number.isFinite(hours) || !Number.isFinite(goal) || goal <= 0) {
    return 0
  }

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

// Milestone-Markierungen für subtile Orientierung
const milestones = computed(() => {
  const max = maxHours.value
  const goal = effectiveGoal.value
  return [4, 8, 12, 16, 20, 24].filter(h => h < max && h !== goal)
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
  
  if (hours < 3) return t('fasting.progress.phases.early')
  if (hours < 8) return t('fasting.progress.phases.warming')
  if (hours < 12) return t('fasting.progress.phases.burning')
  if (hours < goal) return t('fasting.progress.phases.ketosis')
  if (hours >= goal) return t('fasting.progress.phases.goal_reached', { goal })
  return t('fasting.progress.phases.bonus')
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
    const lightCyanColor = 'rgba(34, 211, 238, 0.4)' // cyan-400 mit 40% opacity (leichtes Blau-Türkis)
    const remainingColor = 'rgba(224, 247, 250, 0.3)' // cyan-50 mit 30% opacity
    
    if (progress <= goalProgress) {
      // Noch unter Ziel (sollte nicht passieren, aber sicherheitshalber)
      return `linear-gradient(to right, ${lightGreenColor} 0%, ${lightGreenColor} ${progress}%, ${remainingColor} ${progress}%, ${remainingColor} 100%)`
    } else {
      // Über Ziel: Helles Grün bis Ziel, dann leichtes Blau-Türkis ohne Verlauf
      return `linear-gradient(to right, ${lightGreenColor} 0%, ${lightGreenColor} ${goalProgress}%, ${lightCyanColor} ${goalProgress}%, ${lightCyanColor} ${progress}%, ${remainingColor} ${progress}%, ${remainingColor} 100%)`
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
import { ref } from 'vue'
const lastNotifiedHour = ref(0)

const sendNotification = (hours: number, message: string) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(t('fasting.notifications.milestone_title'), {
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
watch(activeHours, (newHours, oldHours) => {
  // Nur bei Erhöhung der Stunden und wenn es ein neuer Meilenstein ist
  if (newHours > oldHours && newHours > lastNotifiedHour.value) {
    if (newHours >= 3 && lastNotifiedHour.value < 3) {
      sendNotification(3, t('fasting.notifications.warming_phase'))
      lastNotifiedHour.value = 3
    } else if (newHours >= 8 && lastNotifiedHour.value < 8) {
      sendNotification(8, t('fasting.notifications.burning_phase'))
      lastNotifiedHour.value = 8
    } else if (newHours >= 12 && lastNotifiedHour.value < 12) {
      sendNotification(12, t('fasting.notifications.ketosis_phase'))
      lastNotifiedHour.value = 12
    } else if (newHours >= 16 && lastNotifiedHour.value < 16) {
      sendNotification(16, t('fasting.notifications.autophagy_phase'))
      lastNotifiedHour.value = 16
    }
  }
}, { immediate: false })

// Request notification permission on component mount
requestNotificationPermission()
</script>
