/**
 * API Index
 * Zentrale API-Schnittstelle mit intelligentem Fallback-System
 */

import { config } from './config';
import { fastingApiService } from './fasting-service';
import { mockService } from '../mocks/service';
import { fallbackApiService } from './fallback-service';

// Export Types
export type * from '../types/api';

// Service Selection mit intelligentem Fallback
const service = config.isDevelopment ? fallbackApiService : 
                config.useMockData ? mockService : fastingApiService;

/**
 * Öffentliche API-Funktionen
 * Mit automatischem Fallback zu Mock-Daten wenn API nicht erreichbar
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
export { fallbackApiService } from './fallback-service';
export { config } from './config';
export { fastingApiService } from './fasting-service';
export { mockService } from '../mocks/service';
