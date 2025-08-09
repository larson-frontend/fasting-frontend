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
  description: string
  expectedPhase: string
  expectedColor: string
}

// Vordefinierte Test-Szenarien
export const TEST_SCENARIOS: TestScenario[] = [
  {
    hours: 0,
    minutes: 30,
    description: "Start Phase - 30 Minuten",
    expectedPhase: "Aufwärmphase",
    expectedColor: "orange"
  },
  {
    hours: 3,
    minutes: 0,
    description: "Aufwärmphase erreicht - 3 Stunden",
    expectedPhase: "Aufwärmphase",
    expectedColor: "orange"
  },
  {
    hours: 8,
    minutes: 15,
    description: "Fettverbrennung - 8h 15min",
    expectedPhase: "Fettverbrennung",
    expectedColor: "orange"
  },
  {
    hours: 12,
    minutes: 30,
    description: "Ketose Phase - 12h 30min",
    expectedPhase: "Ketose",
    expectedColor: "orange"
  },
  {
    hours: 16,
    minutes: 0,
    description: "Autophagie erreicht - 16h exakt",
    expectedPhase: "Autophagie",
    expectedColor: "green"
  },
  {
    hours: 17,
    minutes: 30,
    description: "Erweiterte Autophagie - 17h 30min",
    expectedPhase: "Erweiterte Autophagie",
    expectedColor: "purple"
  },
  {
    hours: 20,
    minutes: 45,
    description: "Tiefe Autophagie - 20h 45min",
    expectedPhase: "Erweiterte Autophagie",
    expectedColor: "purple"
  },
  {
    hours: 24,
    minutes: 0,
    description: "Vollständige Regeneration - 24h",
    expectedPhase: "Erweiterte Autophagie",
    expectedColor: "purple"
  }
]

// Aktueller Test-Modus
let currentTestMode = false
let currentTestData: TestScenario | null = null

/**
 * Aktiviert einen Test-Modus mit spezifischen Stunden/Minuten
 */
export function activateTestMode(hours: number, minutes: number = 0): void {
  currentTestMode = true
  currentTestData = {
    hours,
    minutes,
    description: `Test: ${hours}h ${minutes}m`,
    expectedPhase: getExpectedPhase(hours),
    expectedColor: getExpectedColor(hours)
  }
  
  console.log(`🧪 Test-Modus aktiviert: ${hours}h ${minutes}m`)
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
export function getTestData(): { hours: number; minutes: number } | null {
  if (currentTestMode && currentTestData) {
    return {
      hours: currentTestData.hours,
      minutes: currentTestData.minutes
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
function getExpectedPhase(hours: number): string {
  if (hours < 3) return "Aufwärmphase"
  if (hours < 8) return "Aufwärmphase"
  if (hours < 12) return "Fettverbrennung"
  if (hours < 16) return "Ketose"
  if (hours === 16) return "Autophagie"
  return "Erweiterte Autophagie"
}

function getExpectedColor(hours: number): string {
  if (hours < 16) return "orange"
  if (hours === 16) return "green"
  return "purple"
}

// Quick-Access Funktionen für häufige Tests
export const quickTests = {
  start: () => activateTestMode(0, 30),
  early: () => activateTestMode(3, 0),
  middle: () => activateTestMode(8, 15),
  ketosis: () => activateTestMode(12, 30),
  autophagy: () => activateTestMode(16, 0),
  extended: () => activateTestMode(17, 30),
  deep: () => activateTestMode(20, 45),
  full: () => activateTestMode(24, 0),
  off: () => deactivateTestMode()
}

// Browser Console Integration (für einfache Nutzung in DevTools)
if (typeof window !== 'undefined') {
  (window as any).fastingTests = {
    ...quickTests,
    activate: activateTestMode,
    scenario: activateTestScenario,
    list: listTestScenarios,
    current: () => currentTestData
  }
  console.log("🧪 Fasting Tests verfügbar unter: window.fastingTests")
}
