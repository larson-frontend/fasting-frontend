/**
 * API Type Definitions
 * Zentrale TypeScript Interfaces für die API
 */

// Frontend FastSession Model (our current implementation)
export interface FastSession {
  id: number;
  startAt: string;
  endAt: string | null;
  duration: string;
}

// Backend FastSession Model (from API documentation)
export interface BackendFastSession {
  id: number;
  user?: {
    id: number;
    username: string;
    email: string;
  };
  startAt: string;
  endAt?: string;
  goalHours: number;
  isActive: boolean;
  durationHours?: number;
}

// Backend Fast Status Response
export interface BackendFastStatus {
  hasActiveFast: boolean;
  currentFast?: BackendFastSession;
  message: string;
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
