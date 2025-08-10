/**
 * Mock Data Store
 * Simuliert Backend-Funktionalität für lokale Entwicklung
 */

import type { FastSession, FastStatus, HealthCheckResponse } from '../types/api';

const DEFAULT_GOAL_HOURS = 16;

export class MockDataStore {
  private currentSession: FastSession | null = null;
  private sessions: FastSession[] = [
    {
      id: 1,
      startAt: '2025-08-08T18:00:00Z',
      endAt: '2025-08-09T10:30:00Z',
      duration: '16h 30m'
    },
    {
      id: 2,
      startAt: '2025-08-07T20:00:00Z',
      endAt: '2025-08-08T14:00:00Z',
      duration: '18h 0m'
    },
    {
      id: 3,
      startAt: '2025-08-06T19:30:00Z',
      endAt: '2025-08-07T12:45:00Z',
      duration: '17h 15m'
    },
    {
      id: 4,
      startAt: '2025-08-05T21:00:00Z',
      endAt: '2025-08-06T15:30:00Z',
      duration: '18h 30m'
    },
    {
      id: 5,
      startAt: '2025-08-04T18:45:00Z',
      endAt: '2025-08-05T11:15:00Z',
      duration: '16h 30m'
    }
  ];
  private nextId = 6;
  private goalHours = DEFAULT_GOAL_HOURS;

  /**
   * Startet eine neue Fasten-Session
   */
  startFast(goalHours?: number): FastSession {
    if (this.currentSession) {
      throw new Error('Es läuft bereits ein Fasten');
    }
    
    this.goalHours = goalHours || 16;
    this.currentSession = {
      id: this.nextId++,
      startAt: new Date().toISOString(),
      endAt: null,
      duration: '0h 0m'
    };
    
    return { ...this.currentSession };
  }

  /**
   * Beendet die aktuelle Fasten-Session
   */
  stopFast(): FastSession {
    if (!this.currentSession) {
      throw new Error('Kein aktives Fasten gefunden');
    }
    
    const endTime = new Date();
    const startTime = new Date(this.currentSession.startAt);
    const durationMs = endTime.getTime() - startTime.getTime();
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    
    const completedSession = {
      ...this.currentSession,
      endAt: endTime.toISOString(),
      duration: `${hours}h ${minutes}m`
    };
    
    this.sessions.unshift(completedSession);
    this.currentSession = null;
    
    return completedSession;
  }

  /**
   * Gibt den aktuellen Fasten-Status zurück
   */
  getStatus(): FastStatus {
    if (!this.currentSession) {
      return { active: false };
    }
    
    const now = new Date();
    const startTime = new Date(this.currentSession.startAt);
    const durationMs = now.getTime() - startTime.getTime();
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return {
      active: true,
      hours,
      minutes,
      since: this.currentSession.startAt,
      goalHours: this.goalHours
    };
  }

  /**
   * Gibt die Historie aller Fasten-Sessions zurück
   */
  getHistory(): FastSession[] {
    return [...this.sessions];
  }

  /**
   * Simuliert Health Check Response
   */
  getHealthCheck(): HealthCheckResponse {
    return {
      status: 'UP',
      components: {
        db: { status: 'UP' },
        diskSpace: { status: 'UP' }
      }
    };
  }
}

// Singleton Instance
export const mockStore = new MockDataStore();
