/**
 * API Type Definitions
 * Zentrale TypeScript Interfaces für die API
 */

export interface FastSession {
  id: number;
  startAt: string;
  endAt: string | null;
  duration: string;
}

export interface FastStatus {
  active: boolean;
  hours?: number;
  minutes?: number;
  since?: string;
  goalHours?: number;
}

export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
}

export interface HealthCheckResponse {
  status: string;
  components: {
    db: { status: string };
    diskSpace: { status: string };
  };
}

export interface StartFastRequest {
  goalHours?: number;
}
