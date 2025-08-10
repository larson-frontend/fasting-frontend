/**
 * Environment Configuration
 * Zentrale Konfiguration für API und Environment
 */

// Extend ImportMeta to include 'env'
declare global {
  interface ImportMetaEnv {
    VITE_API_BASE?: string;
    VITE_USE_MOCK_DATA?: string;
    [key: string]: any;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

export const config = {
  apiBase: import.meta.env.VITE_API_BASE || 'http://localhost:8080/api/fast',
  useMockData: import.meta.env.VITE_USE_MOCK_DATA === 'true',
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
} as const;

export const endpoints = {
  fast: {
    start: '/start',
    stop: '/stop',
    status: '/status',
    history: '/history',
  },
  health: 'http://localhost:8080/actuator/health',
} as const;
