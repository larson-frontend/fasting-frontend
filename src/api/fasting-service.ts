/**
 * Fasting API Service
 * Updated for backend integration with user-specific endpoints and JWT authentication
 */

import type { FastSession, FastStatus, HealthCheckResponse, StartFastRequest, BackendFastSession, BackendFastStatus } from '../types/api';
import { httpClient } from './http-client';
import { config } from './config';

export class FastingApiService {
  private baseUrl = config.apiBase;

  /**
   * Get authentication headers for JWT authentication
   */
  private getAuthHeaders(): Record<string, string> {
    const authToken = localStorage.getItem('fasting_auth_token');
    const headers: Record<string, string> = {};
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    return headers;
  }

  // Global fasting endpoints (for backwards compatibility)
  async startFast(goalHours?: number): Promise<FastSession> {
    const body: StartFastRequest | undefined = goalHours ? { goalHours } : undefined;
    return httpClient.post<FastSession>('/fast/start', body);
  }

  async stopFast(): Promise<FastSession> {
    return httpClient.post<FastSession>('/fast/stop');
  }

  async getStatus(): Promise<FastStatus> {
    return httpClient.get<FastStatus>('/fast/status');
  }

  async getHistory(): Promise<FastSession[]> {
    return httpClient.get<FastSession[]>('/fast/history');
  }

  // User-specific fasting endpoints (with JWT authentication)
  async startUserFast(userIdentifier: string, goalHours: number = 16): Promise<BackendFastSession> {
    const response = await httpClient.post<BackendFastSession>(
      `/fast/user/${encodeURIComponent(userIdentifier)}/start`,
      { goalHours },
      { headers: this.getAuthHeaders() }
    );
    return response;
  }

  async stopUserFast(userIdentifier: string): Promise<BackendFastSession> {
    const response = await httpClient.post<BackendFastSession>(
      `/fast/user/${encodeURIComponent(userIdentifier)}/stop`,
      undefined,
      { headers: this.getAuthHeaders() }
    );
    return response;
  }

  async getUserStatus(userIdentifier: string): Promise<BackendFastStatus> {
    const response = await httpClient.get<BackendFastStatus>(
      `/fast/user/${encodeURIComponent(userIdentifier)}/status`,
      { headers: this.getAuthHeaders() }
    );
    return response;
  }

  async getUserHistory(userIdentifier: string): Promise<BackendFastSession[]> {
    const response = await httpClient.get<BackendFastSession[]>(
      `/fast/user/${encodeURIComponent(userIdentifier)}/history`,
      { headers: this.getAuthHeaders() }
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
