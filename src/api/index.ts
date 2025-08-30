/**
 * API Index
 * Zentrale API-Schnittstelle mit intelligentem Fallback-System
 */

import { config } from './config';
import { fastingApiService } from './fasting-service';
import { mockService } from '../mocks/service';
import { fallbackApiService } from './fallback-service';
import { userService } from './user-service';
import { mockUserService } from '../mocks/user-service';

// Export Types
export type * from '../types/api';
export type * from '../types/user';

// Service Selection mit intelligenter Priorität
// 1. Mock-Service wenn explizit aktiviert (höchste Priorität)
// 2. Fallback-Service in Entwicklung (versucht API, fällt zurück auf Mock)
// 3. Direkte API-Service in Produktion
const service = config.useMockData ? mockService :
                config.isDevelopment ? fallbackApiService : 
                fastingApiService;

/**
 * Öffentliche API-Funktionen
 * Mit automatischem Fallback zu Mock-Daten wenn API nicht erreichbar
 */
export const startFast = service.startFast.bind(service);
export const stopFast = service.stopFast.bind(service);
export const statusFast = service.getStatus.bind(service);
export const historyFast = service.getHistory.bind(service);
export const healthCheck = service.healthCheck.bind(service);

// User-specific fasting functions (direkter Zugang zu Mock Service wenn aktiviert)
export const startUserFast = config.useMockData ? 
  mockService.startFast.bind(mockService) :
  fastingApiService.startUserFast.bind(fastingApiService);
export const stopUserFast = config.useMockData ?
  mockService.stopFast.bind(mockService) :
  fastingApiService.stopUserFast.bind(fastingApiService);
export const getUserFastingStatus = config.useMockData ?
  mockUserService.fetchUserFastingStatus.bind(mockUserService) :
  fastingApiService.getUserStatus.bind(fastingApiService);
export const getUserFastingHistory = config.useMockData ?
  mockUserService.fetchUserFastingHistory.bind(mockUserService) :
  fastingApiService.getUserHistory.bind(fastingApiService);

// User Service (mit Mock-Support, fehlende Methoden haben Fallbacks)
export const loginOrCreateUser = config.useMockData ? 
  mockUserService.loginOrCreate.bind(mockUserService) :
  userService.loginOrCreate.bind(userService);
export const updateUserPreferences = config.useMockData ?
  mockUserService.updatePreferences.bind(mockUserService) :
  userService.updatePreferences.bind(userService);
export const changeUserLanguage = config.useMockData ?
  (() => Promise.resolve()) :
  userService.changeLanguage.bind(userService);
export const getCurrentUser = config.useMockData ?
  (async () => {
    const username = mockUserService.getLoggedUsername();
    console.log('🧪 getCurrentUser: Mock mode, username from storage:', username);
    if (!username) return null;
    
    const user = await mockUserService.getUserByUsername(username);
    console.log('🧪 getCurrentUser: Found user:', user);
    return user;
  }) :
  userService.getCurrentUser.bind(userService);
export const isUserLoggedIn = config.useMockData ?
  (() => !!mockUserService.getLoggedUsername()) :
  userService.isLoggedIn.bind(userService);
export const getStoredLanguage = config.useMockData ?
  (() => 'de') :
  userService.getStoredLanguage.bind(userService);
export const logoutUser = config.useMockData ?
  mockUserService.logout.bind(mockUserService) :
  userService.logout.bind(userService);
export const checkUsernameAvailability = config.useMockData ?
  mockUserService.checkUsernameAvailability.bind(mockUserService) :
  userService.checkUsernameAvailability.bind(userService);
export const checkEmailAvailability = config.useMockData ?
  (() => Promise.resolve({ available: true })) :
  userService.checkEmailAvailability.bind(userService);
export const checkUserAvailability = config.useMockData ?
  (() => Promise.resolve({ available: true })) :
  userService.checkUserAvailability.bind(userService);
export const getLoggedUsername = config.useMockData ?
  mockUserService.getLoggedUsername.bind(mockUserService) :
  userService.getLoggedUsername.bind(userService);
export const syncUserDataAfterLogin = config.useMockData ?
  mockUserService.syncUserDataAfterLogin.bind(mockUserService) :
  userService.syncUserDataAfterLogin.bind(userService);
export const fetchUserFastingStatus = config.useMockData ?
  mockUserService.fetchUserFastingStatus.bind(mockUserService) :
  userService.fetchUserFastingStatus.bind(userService);
export const fetchUserFastingHistory = config.useMockData ?
  mockUserService.fetchUserFastingHistory.bind(mockUserService) :
  userService.fetchUserFastingHistory.bind(userService);

// Configuration Exports für Debug/Info
export const isMockMode = config.useMockData;
export const apiBase = config.apiBase;

// Development Exports
export { fallbackApiService } from './fallback-service';
export { config } from './config';
export { fastingApiService } from './fasting-service';
export { mockService } from '../mocks/service';
