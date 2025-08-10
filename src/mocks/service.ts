/**
 * Mock Service
 * Simuliert API-Calls mit realistischen Delays
 */

import type { FastSession, FastStatus, HealthCheckResponse } from '../types/api';
import { mockStore } from '../mocks/data-store';

/**
 * Simuliert Network Delay für realistische API-Simulation
 */
const simulateDelay = (): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 200));

export class MockService {
  async startFast(goalHours?: number): Promise<FastSession> {
    await simulateDelay();
    return mockStore.startFast(goalHours);
  }

  async stopFast(): Promise<FastSession> {
    await simulateDelay();
    return mockStore.stopFast();
  }

  async getStatus(): Promise<FastStatus> {
    await simulateDelay();
    return mockStore.getStatus();
  }

  async getHistory(): Promise<FastSession[]> {
    await simulateDelay();
    return mockStore.getHistory();
  }

  async healthCheck(): Promise<HealthCheckResponse> {
    await simulateDelay();
    return mockStore.getHealthCheck();
  }
}

// Singleton Instance
export const mockService = new MockService();
