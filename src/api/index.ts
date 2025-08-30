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
import type { BackendFastSession } from '../types/api';
import type { UpdatePreferencesRequest, User } from '../types/user';

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

// User-specific fasting functions with mock-aware fallbacks
export async function startUserFast(userIdentifier: string, goalHours?: number): Promise<BackendFastSession> {
  if (config.useMockData) {
    const session = await mockService.startFast();
    const status = await mockService.getStatus();
    return {
      id: session.id,
      startAt: session.startAt,
      endAt: session.endAt ?? undefined,
      goalHours: goalHours ?? status.goalHours ?? 16,
      isActive: true,
    };
  }
  return fastingApiService.startUserFast(userIdentifier, goalHours);
}

export async function stopUserFast(userIdentifier: string): Promise<BackendFastSession> {
  if (config.useMockData) {
    const session = await mockService.stopFast();
    const status = await mockService.getStatus();
    return {
      id: session.id,
      startAt: session.startAt,
      endAt: session.endAt ?? undefined,
      goalHours: status.goalHours ?? 16,
      isActive: false,
    };
  }
  return fastingApiService.stopUserFast(userIdentifier);
}

export const getUserFastingStatus = config.useMockData
  ? mockUserService.fetchUserFastingStatus.bind(mockUserService)
  : fastingApiService.getUserStatus.bind(fastingApiService);

export const getUserFastingHistory = config.useMockData
  ? mockUserService.fetchUserFastingHistory.bind(mockUserService)
  : fastingApiService.getUserHistory.bind(fastingApiService);

// User Service (with Mock support)
export const loginOrCreateUser = config.useMockData
  ? mockUserService.loginOrCreate.bind(mockUserService)
  : userService.loginOrCreate.bind(userService);

export async function updateUserPreferences(request: UpdatePreferencesRequest): Promise<User> {
  if (config.useMockData) {
    const username = mockUserService.getLoggedUsername();
    if (!username) throw new Error('No user logged in');
    // Assuming mock service can get by username; adapt as needed
    const user = await (mockUserService as any).getUserByUsername?.(username);
    if (!user) throw new Error('User not found');
    const updatedPrefs = await mockUserService.updatePreferences(user.id, request);
    return { ...user, preferences: updatedPrefs, updatedAt: new Date().toISOString() } as User;
  }
  return userService.updatePreferences(request);
}

export const changeUserLanguage = config.useMockData
  ? (() => Promise.resolve())
  : userService.changeLanguage.bind(userService);

export const getCurrentUser = config.useMockData
  ? (async () => {
      const username = mockUserService.getLoggedUsername();
      if (!username) return null as any;
      const user = await (mockUserService as any).getUserByUsername?.(username);
      return user ?? null;
    })
  : userService.getCurrentUser.bind(userService);

export const isUserLoggedIn = config.useMockData
  ? (() => !!mockUserService.getLoggedUsername())
  : userService.isLoggedIn.bind(userService);

export function getStoredLanguage(): 'en' | 'de' {
  const fromStorage = (localStorage.getItem('fasting_language') || localStorage.getItem('fasting-app-locale') || 'de').toLowerCase();
  return fromStorage === 'en' ? 'en' : 'de';
}

export const logoutUser = config.useMockData
  ? mockUserService.logout.bind(mockUserService)
  : userService.logout.bind(userService);

export const checkUsernameAvailability = config.useMockData
  ? mockUserService.checkUsernameAvailability.bind(mockUserService)
  : userService.checkUsernameAvailability.bind(userService);

export const checkEmailAvailability = config.useMockData
  ? (() => Promise.resolve({ available: true }))
  : userService.checkEmailAvailability.bind(userService);

export function checkUserAvailability(
  username: string,
  email: string
): Promise<{ usernameAvailable: boolean; emailAvailable: boolean }> {
  if (config.useMockData) {
    return Promise.resolve({ usernameAvailable: true, emailAvailable: true });
  }
  return userService.checkUserAvailability(username, email);
}

export const getLoggedUsername = config.useMockData
  ? mockUserService.getLoggedUsername.bind(mockUserService)
  : userService.getLoggedUsername.bind(userService);

export const syncUserDataAfterLogin = config.useMockData
  ? mockUserService.syncUserDataAfterLogin.bind(mockUserService)
  : userService.syncUserDataAfterLogin.bind(userService);

export const fetchUserFastingStatus = config.useMockData
  ? mockUserService.fetchUserFastingStatus.bind(mockUserService)
  : userService.fetchUserFastingStatus.bind(userService);

export const fetchUserFastingHistory = config.useMockData
  ? mockUserService.fetchUserFastingHistory.bind(mockUserService)
  : userService.fetchUserFastingHistory.bind(userService);

// Configuration Exports für Debug/Info
export const isMockMode = config.useMockData;
export const apiBase = config.apiBase;

// Development Exports
export { fallbackApiService } from './fallback-service';
export { config } from './config';
export { fastingApiService } from './fasting-service';
export { mockService } from '../mocks/service';
