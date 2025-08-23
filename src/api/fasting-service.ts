/**
 * Fasting API Service
 * Updated for backend integration with user-specific endpoints
 */

import type { FastSession, FastStatus, HealthCheckResponse, StartFastRequest, BackendFastSession, BackendFastStatus } from '../types/api';
import { httpClient } from './http-client';
import { config } from './config';

export class FastingApiService {
  private baseUrl = config.apiBase;

  // Global fasting endpoints (for backwards compatibility)
  async startFast(goalHours?: number): Promise<FastSession> {
    const body: StartFastRequest | undefined = goalHours ? { goalHours } : undefined;
    return httpClient.post<FastSession>('/api/fast/start', body);
  }

  async stopFast(): Promise<FastSession> {
    return httpClient.post<FastSession>('/api/fast/stop');
  }

  async getStatus(): Promise<FastStatus> {
    return httpClient.get<FastStatus>('/api/fast/status');
  }

  async getHistory(): Promise<FastSession[]> {
    return httpClient.get<FastSession[]>('/api/fast/history');
  }

  // User-specific fasting endpoints (new backend API)
  async startUserFast(userIdentifier: string, goalHours: number = 16): Promise<BackendFastSession> {
    const response = await httpClient.post<BackendFastSession>(
      `/api/fast/user/${encodeURIComponent(userIdentifier)}/start`,
      { goalHours }
    );
    return response;
  }

  async stopUserFast(userIdentifier: string): Promise<BackendFastSession> {
    const response = await httpClient.post<BackendFastSession>(
      `/api/fast/user/${encodeURIComponent(userIdentifier)}/stop`
    );
    return response;
  }

  async getUserStatus(userIdentifier: string): Promise<BackendFastStatus> {
    const response = await httpClient.get<BackendFastStatus>(
      `/api/fast/user/${encodeURIComponent(userIdentifier)}/status`
    );
    return response;
  }

  async getUserHistory(userIdentifier: string): Promise<BackendFastSession[]> {
    const response = await httpClient.get<BackendFastSession[]>(
      `/api/fast/user/${encodeURIComponent(userIdentifier)}/history`
    );
    return response;
  }

  async healthCheck(): Promise<HealthCheckResponse> {
    const response = await fetch(`${this.baseUrl}/actuator/health`);
    return response.json();
  }
}

// Singleton Instance
export const fastingApiService = new FastingApiService();
