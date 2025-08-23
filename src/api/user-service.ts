/**
 * User Service
 class UserService {
  private currentUser: User | null = null;
  private authToken: string | null = null;
  private readonly STORAGE_KEY = 'fasting_user';
  private readonly TOKEN_KEY = 'fasting_auth_token';
  private readonly LANGUAGE_KEY = 'fasting_language';

  constructor() {
    this.loadUserFromStorage();
    this.loadTokenFromStorage();
  }tet Benutzer, Authentifizierung und Einstellungen
 */

import type { 
  User, 
  CreateUserRequest, 
  UpdateUserRequest, 
  UpdatePreferencesRequest,
  UserPreferences,
  LoginRequest,
  AuthResponse,
  UserApiResponse,
  PreferencesApiResponse
} from '../types/user';
import { HttpClient } from './http-client';

// Create dedicated HTTP client for user endpoints
const userHttpClient = new HttpClient('http://localhost:8080/api');

class UserService {
  private currentUser: User | null = null;
  private authToken: string | null = null;
  private readonly STORAGE_KEY = 'fasting_user';
  private readonly TOKEN_KEY = 'fasting_auth_token';
  private readonly LANGUAGE_KEY = 'fasting_language';

  constructor() {
    this.loadUserFromStorage();
    this.loadTokenFromStorage();
  }

  /**
   * Benutzer erstellen oder einloggen (Simplified Mode)
   */
  async loginOrCreate(request: LoginRequest): Promise<AuthResponse> {
    try {
      // Erst versuchen einzuloggen
      const loginResponse = await this.login(request);
      return loginResponse;
    } catch (error) {
      // Falls Login fehlschlägt, neuen Benutzer erstellen
      console.log('User not found, creating new user:', request.username || request.email);
      const createRequest: CreateUserRequest = {
        username: request.username || request.email?.split('@')[0] || 'user',
        email: request.email,
        preferences: {
          language: this.getStoredLanguage(),
          theme: 'auto',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          notifications: {
            enabled: true,
            fastingReminders: true,
            goalAchievements: true,
            weeklyReports: false
          },
          fastingDefaults: {
            defaultGoalHours: 16,
            preferredFastingType: 'intermittent',
            autoStartNextFast: false
          }
        }
      };
      return this.createUser(createRequest);
    }
  }

  /**
   * Benutzer einloggen
   */
  async login(request: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await userHttpClient.post<AuthResponse>('/users/login-or-create', request);
      this.currentUser = response.user;
      this.authToken = response.token;
      this.saveUserToStorage(response.user);
      this.saveTokenToStorage(response.token);
      return response;
    } catch (error) {
      throw new Error(`Login failed: ${error}`);
    }
  }

  /**
   * Neuen Benutzer erstellen
   */
  async createUser(request: CreateUserRequest): Promise<AuthResponse> {
    try {
      const response = await userHttpClient.post<AuthResponse>('/users', request);
      this.currentUser = response.user;
      this.authToken = response.token;
      this.saveUserToStorage(response.user);
      this.saveTokenToStorage(response.token);
      return response;
    } catch (error) {
      throw new Error(`User creation failed: ${error}`);
    }
  }

  /**
   * Benutzer-Einstellungen aktualisieren
   */
  async updatePreferences(request: UpdatePreferencesRequest): Promise<User> {
    if (!this.currentUser || !this.authToken) {
      throw new Error('No user logged in');
    }

    try {
      const response = await userHttpClient.patch<PreferencesApiResponse>(
        `/users/${this.currentUser.id}/preferences`, 
        request,
        { headers: { Authorization: `Bearer ${this.authToken}` } }
      );
      
      // Update lokale User-Daten
      const updatedUser = { ...this.currentUser, preferences: response.preferences };
      this.currentUser = updatedUser;
      this.saveUserToStorage(updatedUser);
      
      return updatedUser;
    } catch (error) {
      throw new Error(`Failed to update preferences: ${error}`);
    }
  }

  /**
   * Sprache ändern und persistent speichern
   */
  async changeLanguage(language: 'en' | 'de'): Promise<void> {
    // Sofort lokal speichern für bessere UX
    this.saveLanguageToStorage(language);
    
    if (this.currentUser) {
      try {
        await this.updatePreferences({ language });
      } catch (error) {
        console.error('Failed to sync language to server:', error);
        // Language bleibt trotzdem lokal gespeichert
      }
    }
  }

  /**
   * Aktuellen Benutzer abrufen (mit Backend-Validierung)
   */
  async getCurrentUser(): Promise<User | null> {
    // Wenn kein Token vorhanden, direkt null zurückgeben
    if (!this.authToken) {
      return null;
    }

    // Wenn bereits ein User geladen ist, versuche Backend-Validierung
    try {
      const user = await userHttpClient.get<User>('/users/me', {
        headers: { Authorization: `Bearer ${this.authToken}` }
      });
      
      // Update lokale Daten mit Backend-Daten
      this.currentUser = user;
      this.saveUserToStorage(user);
      return user;
      
    } catch (error) {
      console.log('Session expired or invalid, clearing auth data');
      // Token ungültig, lokale Daten löschen
      this.logout();
      return null;
    }
  }

  /**
   * Synchroner Zugriff auf aktuellen User (ohne Backend-Validierung)
   */
  getCurrentUserSync(): User | null {
    return this.currentUser;
  }

  /**
   * Prüfen ob Benutzer eingeloggt ist
   */
  isLoggedIn(): boolean {
    return this.currentUser !== null;
  }

  /**
   * Benutzer ausloggen
   */
  logout(): void {
    this.currentUser = null;
    this.authToken = null;
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
  }

  /**
   * Gespeicherte Sprache abrufen
   */
  getStoredLanguage(): 'en' | 'de' {
    // 1. Prio: User preferences wenn eingeloggt
    if (this.currentUser?.preferences.language) {
      return this.currentUser.preferences.language;
    }
    
    // 2. Prio: Lokal gespeicherte Sprache
    const stored = localStorage.getItem(this.LANGUAGE_KEY) as 'en' | 'de';
    if (stored && ['en', 'de'].includes(stored)) {
      return stored;
    }
    
    // 3. Prio: Browser-Sprache
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('de')) {
      return 'de';
    }
    
    // 4. Fallback: Englisch
    return 'en';
  }

  /**
   * Benutzer in localStorage speichern
   */
  private saveUserToStorage(user: User): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
  }

  /**
   * Sprache in localStorage speichern
   */
  private saveLanguageToStorage(language: 'en' | 'de'): void {
    localStorage.setItem(this.LANGUAGE_KEY, language);
  }

  /**
   * Benutzer aus localStorage laden
   */
  private loadUserFromStorage(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        this.currentUser = JSON.parse(stored);
      } catch (error) {
        console.error('Failed to load user from storage:', error);
        localStorage.removeItem(this.STORAGE_KEY);
      }
    }
  }

  /**
   * Token aus localStorage laden
   */
  private loadTokenFromStorage(): void {
    const stored = localStorage.getItem(this.TOKEN_KEY);
    if (stored) {
      this.authToken = stored;
    }
  }

  /**
   * Token in localStorage speichern
   */
  private saveTokenToStorage(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }
}

// Singleton Instance
export const userService = new UserService();
