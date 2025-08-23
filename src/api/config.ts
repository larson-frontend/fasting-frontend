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

/**
 * Automatische Mock-Data Erkennung
 * Erkennt automatisch wann Mock-Daten verwendet werden sollen
 */
function shouldUseMockData(): boolean {
  // 1. Explizit gesetzt via Environment Variable
  if (import.meta.env.VITE_USE_MOCK_DATA !== undefined) {
    return import.meta.env.VITE_USE_MOCK_DATA === 'true';
  }
  
  // 2. Development Mode: Automatisch Mock verwenden
  if (import.meta.env.DEV) {
    return true;
  }
  
  // 3. Production: Immer echte API verwenden
  return false;
}

export const config = {
  apiBase: import.meta.env.VITE_API_BASE || 'http://localhost:8080',
  useMockData: shouldUseMockData(), // ✅ Automatische Erkennung!
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
} as const;

export const endpoints = {
  users: {
    base: '/api/users',
    checkAvailability: '/api/users/check-availability',
    find: '/api/users/find',
  },
  fast: {
    base: '/api/fast',
    start: '/api/fast/start',
    stop: '/api/fast/stop',
    status: '/api/fast/status',
    history: '/api/fast/history',
    userStatus: '/api/fast/user',
    userHistory: '/api/fast/user',
    userStart: '/api/fast/user',
    userStop: '/api/fast/user',
  },
  health: '/actuator/health',
} as const;
