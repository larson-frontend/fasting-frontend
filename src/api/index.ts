/**
 * API Index
 * Zentrale API-Schnittstelle mit intelligentem Fallback-System
 */

import { config } from './config';
import { fastingApiService } from './fasting-service';
import { mockService } from '../mocks/service';
import { fallbackApiService } from './fallback-service';
import { userService } from './user-service';

// Export Types
export type * from '../types/api';
export type * from '../types/user';

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

// User-specific fasting functions (new backend API)
export const startUserFast = fastingApiService.startUserFast.bind(fastingApiService);
export const stopUserFast = fastingApiService.stopUserFast.bind(fastingApiService);
export const getUserFastingStatus = fastingApiService.getUserStatus.bind(fastingApiService);
export const getUserFastingHistory = fastingApiService.getUserHistory.bind(fastingApiService);

// User Service (always available)
export const loginOrCreateUser = userService.loginOrCreate.bind(userService);
export const updateUserPreferences = userService.updatePreferences.bind(userService);
export const changeUserLanguage = userService.changeLanguage.bind(userService);
export const getCurrentUser = userService.getCurrentUser.bind(userService);
export const isUserLoggedIn = userService.isLoggedIn.bind(userService);
export const getStoredLanguage = userService.getStoredLanguage.bind(userService);
export const logoutUser = userService.logout.bind(userService);
export const checkUsernameAvailability = userService.checkUsernameAvailability.bind(userService);
export const checkEmailAvailability = userService.checkEmailAvailability.bind(userService);
export const checkUserAvailability = userService.checkUserAvailability.bind(userService);
export const getLoggedUsername = userService.getLoggedUsername.bind(userService);
export const syncUserDataAfterLogin = userService.syncUserDataAfterLogin.bind(userService);
export const fetchUserFastingStatus = userService.fetchUserFastingStatus.bind(userService);
export const fetchUserFastingHistory = userService.fetchUserFastingHistory.bind(userService);

// Configuration Exports für Debug/Info
export const isMockMode = config.useMockData;
export const apiBase = config.apiBase;

// Development Exports
export { fallbackApiService } from './fallback-service';
export { config } from './config';
export { fastingApiService } from './fasting-service';
export { mockService } from '../mocks/service';
