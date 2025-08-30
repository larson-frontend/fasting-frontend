/**
 * Environment Configuration
 * Zentrale Konfiguration für API und Environment
 */

// Extend ImportMeta to include 'env'
declare global {
  interface ImportMetaEnv {
    VITE_API_BASE?: string;
    VITE_USE_MOCK_DATA?: string; // user intent override (ignored in prod if true)
    VITE_ENABLE_FEATURES?: string; // comma separated feature flags to enable
    VITE_LOG_LEVEL?: string; // debug|info|warn|error
    VITE_REQUEST_TIMEOUT_MS?: string; // number ms
    VITE_HTTP_MAX_RETRIES?: string; // number
    VITE_HTTP_RETRY_BACKOFF_FACTOR?: string; // number multiplier
    VITE_HTTP_RETRY_BACKOFF_MS?: string; // number ms initial delay
    [key: string]: any;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

/**
 * Automatische Mock-Data Erkennung
 * Erkennt automatisch wann Mock-Daten verwendet werden sollen
 */
function shouldUseMockData(): boolean {
  // Production safety: never allow mock data in production bundles
  if (import.meta.env.PROD) return false;

  // Explicit env override (dev/test only)
  if (import.meta.env.VITE_USE_MOCK_DATA !== undefined) {
    return import.meta.env.VITE_USE_MOCK_DATA === 'true';
  }

  // Development mode convenience
  if (import.meta.env.DEV) return true;

  return false;
}

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

function resolveLogLevel(): LogLevel {
  const raw = (import.meta.env.VITE_LOG_LEVEL || '').toLowerCase();
  const allowed: LogLevel[] = ['debug','info','warn','error'];
  if (allowed.includes(raw as LogLevel)) return raw as LogLevel;
  return import.meta.env.DEV ? 'debug' : 'info';
}

function numberFromEnv(key: keyof ImportMetaEnv, fallback: number): number {
  const raw = import.meta.env[key];
  if (!raw) return fallback;
  const n = parseInt(raw as string, 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

export const config = {
  apiBase: import.meta.env.VITE_API_BASE || 'http://localhost:8080/api',
  useMockData: shouldUseMockData(), // ✅ automatic detection with prod safety
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  logLevel: resolveLogLevel(),
  requestTimeoutMs: numberFromEnv('VITE_REQUEST_TIMEOUT_MS', 8000),
  httpMaxRetries: numberFromEnv('VITE_HTTP_MAX_RETRIES', 2),
  httpRetryBackoffFactor: numberFromEnv('VITE_HTTP_RETRY_BACKOFF_FACTOR', 2),
  httpRetryInitialDelayMs: numberFromEnv('VITE_HTTP_RETRY_BACKOFF_MS', 250),
} as const;

// Runtime feature enable list from env (applied later in feature module)
export function getEnabledFeaturesFromEnv(): string[] {
  const raw = import.meta.env.VITE_ENABLE_FEATURES;
  if (!raw) return [];
  return raw.split(',').map(f => f.trim()).filter(Boolean);
}

// Correlation / request id helper (simple UUID v4 polyfill if crypto.randomUUID unavailable)
export function generateRequestId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return (crypto as any).randomUUID();
  }
  // Fallback RFC4122-ish
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export const endpoints = {
  users: {
    base: '/users',
    checkAvailability: '/users/check-availability',
    find: '/users/find',
  },
  fast: {
    base: '/fast',
    start: '/fast/start',
    stop: '/fast/stop',
    status: '/fast/status',
    history: '/fast/history',
    userStatus: '/fast/user',
    userHistory: '/fast/user',
    userStart: '/fast/user',
    userStop: '/fast/user',
  },
  health: '/actuator/health',
} as const;
