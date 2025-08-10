/**
 * Mock Data für FastingInfoModal
 * Erweitert das Test-System um Status-Phasen Simulation
 */

import type { FastStatus } from '../types/api';

export interface MockPhaseData {
  hours: number;
  minutes: number;
  goalHours: number;
  description: string;
  expectedPhases: {
    phase1: boolean; // 0-3h
    phase2: boolean; // 3-8h  
    phase3: boolean; // 8-12h
    phase4: boolean; // 12-16h
    phase5: boolean; // 16h+
  };
}

export const MOCK_PHASE_SCENARIOS: MockPhaseData[] = [
  {
    hours: 1,
    minutes: 30,
    goalHours: 16,
    description: "Frühe Aufwärmphase - 1h 30min",
    expectedPhases: {
      phase1: false, // noch in progress
      phase2: false,
      phase3: false,
      phase4: false,
      phase5: false
    }
  },
  {
    hours: 4,
    minutes: 0,
    goalHours: 16,
    description: "Mittlere Phase - 4h (Insulin stabilisiert)",
    expectedPhases: {
      phase1: true, // abgeschlossen
      phase2: false, // in progress
      phase3: false,
      phase4: false,
      phase5: false
    }
  },
  {
    hours: 10,
    minutes: 30,
    goalHours: 16,
    description: "Fettverbrennung aktiv - 10h 30min",
    expectedPhases: {
      phase1: true,
      phase2: true,
      phase3: false, // in progress
      phase4: false,
      phase5: false
    }
  },
  {
    hours: 14,
    minutes: 0,
    goalHours: 16,
    description: "Ketose beginnt - 14h",
    expectedPhases: {
      phase1: true,
      phase2: true,
      phase3: true,
      phase4: false, // in progress
      phase5: false
    }
  },
  {
    hours: 18,
    minutes: 30,
    goalHours: 16,
    description: "Autophagie aktiv - 18h 30min",
    expectedPhases: {
      phase1: true,
      phase2: true,
      phase3: true,
      phase4: true,
      phase5: false // in progress
    }
  },
  {
    hours: 25,
    minutes: 0,
    goalHours: 24,
    description: "Erweiterte Autophagie - 25h",
    expectedPhases: {
      phase1: true,
      phase2: true,
      phase3: true,
      phase4: true,
      phase5: true // abgeschlossen
    }
  }
];

/**
 * Konvertiert Mock-Phase-Daten zu FastStatus
 */
export function createMockStatus(scenario: MockPhaseData): FastStatus {
  const startTime = new Date();
  startTime.setHours(startTime.getHours() - scenario.hours);
  startTime.setMinutes(startTime.getMinutes() - scenario.minutes);

  return {
    active: true,
    hours: scenario.hours,
    minutes: scenario.minutes,
    since: startTime.toISOString(),
    goalHours: scenario.goalHours
  };
}

/**
 * Berechnet Phase-Progress für Mock-Daten
 */
export function getMockPhaseProgress(scenario: MockPhaseData, phaseStart: number, phaseEnd: number): number {
  const totalHours = scenario.hours + (scenario.minutes / 60);
  
  if (totalHours <= phaseStart) return 0;
  if (totalHours >= phaseEnd) return 100;
  
  const progress = ((totalHours - phaseStart) / (phaseEnd - phaseStart)) * 100;
  return Math.round(progress);
}
