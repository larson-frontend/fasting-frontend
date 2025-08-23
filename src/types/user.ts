/**
 * User and Preferences Type Definitions
 * Erweiterte TypeScript Interfaces für Benutzer und Einstellungen
 */

import type { FastSession } from './api';

export interface User {
  id: string;
  username: string;
  email?: string;
  createdAt: string;
  updatedAt: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  language: 'en' | 'de';
  theme: 'light' | 'dark' | 'auto';
  timezone: string;
  notifications: NotificationSettings;
  fastingDefaults: FastingDefaults;
}

export interface NotificationSettings {
  enabled: boolean;
  fastingReminders: boolean;
  goalAchievements: boolean;
  weeklyReports: boolean;
}

export interface FastingDefaults {
  defaultGoalHours: number;
  preferredFastingType: 'intermittent' | 'extended' | 'custom';
  autoStartNextFast: boolean;
}

export interface CreateUserRequest {
  username: string;
  email?: string;
  preferences?: Partial<UserPreferences>;
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
  preferences?: Partial<UserPreferences>;
}

export interface UpdatePreferencesRequest {
  language?: 'en' | 'de';
  theme?: 'light' | 'dark' | 'auto';
  timezone?: string;
  notifications?: Partial<NotificationSettings>;
  fastingDefaults?: Partial<FastingDefaults>;
}

export interface LoginRequest {
  username?: string;
  email?: string;
  password?: string; // Optional für simplified mode
}

export interface AuthResponse {
  user: User;
  token: string;
  expiresAt: string;
}

// Enhanced Fast Session mit User-Referenz
export interface UserFastSession extends FastSession {
  userId: string;
  goalHours: number;
  notes?: string;
  achievements?: Achievement[];
}

export interface Achievement {
  id: string;
  type: 'duration' | 'consistency' | 'goal' | 'milestone';
  title: string;
  description: string;
  unlockedAt: string;
  icon?: string;
}

// API Response Types
export interface UserApiResponse {
  user: User;
  message?: string;
}

export interface PreferencesApiResponse {
  preferences: UserPreferences;
  message?: string;
}

export interface ErrorResponse {
  error: string;
  message: string;
}
