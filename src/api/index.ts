/**
 * API Index
 * Zentrale API-Schnittstelle mit automatischem Mock/Real-API Switching
 */

import { config } from './config';
import { fastingApiService } from './fasting-service';
import { mockService } from '../mocks/service';

// Export Types
export type * from '../types/api';

// Service Selection basierend auf Konfiguration
const service = config.useMockData ? mockService : fastingApiService;

/**
 * Öffentliche API-Funktionen
 * Automatisches Switching zwischen Mock und Real API
 */
export const startFast = service.startFast.bind(service);
export const stopFast = service.stopFast.bind(service);
export const statusFast = service.getStatus.bind(service);
export const historyFast = service.getHistory.bind(service);
export const healthCheck = service.healthCheck.bind(service);

// Configuration Exports für Debug/Info
export const isMockMode = config.useMockData;
export const apiBase = config.apiBase;

// Development Exports
export { config } from './config';
export { fastingApiService } from './fasting-service';
export { mockService } from '../mocks/service';
