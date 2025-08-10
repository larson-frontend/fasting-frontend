/**
 * Fasting API Service
 * Echte API-Kommunikation für Fasten-Funktionalität
 */

import type { FastSession, FastStatus, HealthCheckResponse, StartFastRequest } from '../types/api';
import { httpClient } from './http-client';
import { endpoints } from './config';

export class FastingApiService {
  async startFast(goalHours?: number): Promise<FastSession> {
    const body: StartFastRequest | undefined = goalHours ? { goalHours } : undefined;
    return httpClient.post<FastSession>(endpoints.fast.start, body);
  }

  async stopFast(): Promise<FastSession> {
    return httpClient.post<FastSession>(endpoints.fast.stop);
  }

  async getStatus(): Promise<FastStatus> {
    return httpClient.get<FastStatus>(endpoints.fast.status);
  }

  async getHistory(): Promise<FastSession[]> {
    return httpClient.get<FastSession[]>(endpoints.fast.history);
  }

  async healthCheck(): Promise<HealthCheckResponse> {
    const response = await fetch(endpoints.health);
    return response.json();
  }
}

// Singleton Instance
export const fastingApiService = new FastingApiService();
