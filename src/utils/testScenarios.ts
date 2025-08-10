/**
 * Test-Szenarien für Fasting Tracker
 * 
 * Diese Datei enthält verschiedene Test-Szenarien die beim Entwickeln 
 * und Testen der Fasten-App verwendet werden können.
 * 
 * Verwendung:
 * 1. Importiere die gewünschte Test-Funktion
 * 2. Rufe sie in der Komponente auf
 * 3. Die Test-Daten überschreiben temporär die echten Props
 */

export interface TestScenario {
  hours: number
  minutes: number
  goalHours?: number
  description: string
  expectedPhase: string
  expectedColor: string
}

// Vordefinierte Test-Szenarien
export const TEST_SCENARIOS: TestScenario[] = [
  {
    hours: 0,
    minutes: 30,
    goalHours: 16,
    description: "Start Phase - 30 Minuten (Ziel: 16h)",
    expectedPhase: "Aufwärmphase",
    expectedColor: "orange"
  },
  {
    hours: 8,
    minutes: 15,
    goalHours: 12,
    description: "Fettverbrennung - 8h 15min (Ziel: 12h)",
    expectedPhase: "Fettverbrennung",
    expectedColor: "orange"
  },
  {
    hours: 11,
    minutes: 0,
    goalHours: 10,
    description: "10h Ziel überschritten - 11h (Ziel: 10h)",
    expectedPhase: "Bonus-Zeit",
    expectedColor: "purple"
  },
  {
    hours: 13,
    minutes: 30,
    goalHours: 12,
    description: "12h Ziel überschritten - 13h 30min (Ziel: 12h)",
    expectedPhase: "Bonus-Zeit",
    expectedColor: "purple"
  },
  {
    hours: 16,
    minutes: 0,
    goalHours: 16,
    description: "16h Ziel erreicht - 16h exakt (Ziel: 16h)",
    expectedPhase: "16h Ziel erreicht!",
    expectedColor: "green"
  },
  {
    hours: 17,
    minutes: 30,
    goalHours: 16,
    description: "Über 16h Ziel - 17h 30min (Ziel: 16h)",
    expectedPhase: "Bonus-Zeit",
    expectedColor: "purple"
  },
  {
    hours: 19,
    minutes: 15,
    goalHours: 18,
    description: "18h Ziel überschritten - 19h 15min (Ziel: 18h)",
    expectedPhase: "Bonus-Zeit",
    expectedColor: "purple"
  },
  {
    hours: 24,
    minutes: 0,
    goalHours: 24,
    description: "24h Ziel erreicht - 24h (Ziel: 24h)",
    expectedPhase: "24h Ziel erreicht!",
    expectedColor: "green"
  }
]

// Aktueller Test-Modus
let currentTestMode = false
let currentTestData: TestScenario | null = null

/**
 * Aktiviert einen Test-Modus mit spezifischen Stunden/Minuten
 */
export function activateTestMode(hours: number, minutes: number = 0, goalHours: number = 16): void {
  currentTestMode = true
  currentTestData = {
    hours,
    minutes,
    goalHours,
    description: `Test: ${hours}h ${minutes}m (Ziel: ${goalHours}h)`,
    expectedPhase: getExpectedPhase(hours, goalHours),
    expectedColor: getExpectedColor(hours, goalHours)
  }
  
  console.log(`🧪 Test-Modus aktiviert: ${hours}h ${minutes}m (Ziel: ${goalHours}h)`)
  console.log(`📊 Erwartete Phase: ${currentTestData.expectedPhase}`)
  console.log(`🎨 Erwartete Farbe: ${currentTestData.expectedColor}`)
}

/**
 * Aktiviert ein vordefiniertes Test-Szenario
 */
export function activateTestScenario(scenarioName: string): void {
  const scenario = TEST_SCENARIOS.find(s => s.description.includes(scenarioName))
  if (scenario) {
    currentTestMode = true
    currentTestData = scenario
    console.log(`🧪 Test-Szenario aktiviert: ${scenario.description}`)
    console.log(`📊 Erwartete Phase: ${scenario.expectedPhase}`)
    console.log(`🎨 Erwartete Farbe: ${scenario.expectedColor}`)
  } else {
    console.error(`❌ Test-Szenario '${scenarioName}' nicht gefunden`)
  }
}

/**
 * Deaktiviert den Test-Modus (zurück zu echten Daten)
 */
export function deactivateTestMode(): void {
  currentTestMode = false
  currentTestData = null
  console.log(`✅ Test-Modus deaktiviert - verwende echte Daten`)
}

/**
 * Gibt die aktuellen Test-Daten zurück (falls Test-Modus aktiv)
 */
export function getTestData(): { hours: number; minutes: number; goalHours?: number } | null {
  if (currentTestMode && currentTestData) {
    return {
      hours: currentTestData.hours,
      minutes: currentTestData.minutes,
      goalHours: currentTestData.goalHours
    }
  }
  return null
}

/**
 * Prüft ob Test-Modus aktiv ist
 */
export function isTestModeActive(): boolean {
  return currentTestMode
}

/**
 * Zeigt alle verfügbaren Test-Szenarien in der Konsole
 */
export function listTestScenarios(): void {
  console.log("🧪 Verfügbare Test-Szenarien:")
  TEST_SCENARIOS.forEach((scenario, index) => {
    console.log(`${index + 1}. ${scenario.description} (${scenario.hours}h ${scenario.minutes}m)`)
  })
}

// Hilfsfunktionen
function getExpectedPhase(hours: number, goalHours: number = 16): string {
  if (hours < 3) return "Aufwärmphase"
  if (hours < 8) return "Aufwärmphase"
  if (hours < 12) return "Fettverbrennung"
  if (hours < goalHours) return "Ketose"
  if (hours === goalHours) return `${goalHours}h Ziel erreicht!`
  return "Bonus-Zeit"
}

function getExpectedColor(hours: number, goalHours: number = 16): string {
  if (hours < goalHours) return "orange"
  if (hours === goalHours) return "green"
  return "purple"
}

// Quick-Access Funktionen für häufige Tests
export const quickTests = {
  start: () => activateTestMode(0, 30, 16),
  early: () => activateTestMode(3, 0, 16),
  middle: () => activateTestMode(8, 15, 16),
  ketosis: () => activateTestMode(12, 30, 16),
  autophagy: () => activateTestMode(16, 0, 16),
  extended: () => activateTestMode(17, 30, 16),
  deep: () => activateTestMode(20, 45, 24),
  full: () => activateTestMode(24, 0, 24),
  // Test verschiedene Ziele
  goal10: () => activateTestMode(11, 0, 10), // Über 10h Ziel
  goal12: () => activateTestMode(13, 30, 12), // Über 12h Ziel
  goal18: () => activateTestMode(19, 15, 18), // Über 18h Ziel
  off: () => deactivateTestMode()
}

// Browser Console Integration (für einfache Nutzung in DevTools)
if (typeof globalThis.window !== 'undefined' && globalThis.window === globalThis) {
  (window as any).fastingTests = {
    ...quickTests,
    activate: activateTestMode,
    scenario: activateTestScenario,
    list: listTestScenarios,
    current: () => currentTestData
  }
  console.log("🧪 Fasting Tests verfügbar unter: window.fastingTests")
}
