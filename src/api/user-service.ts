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
  private readonly USERNAME_KEY = 'fasting_logged_username';

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
          theme: 'system',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          notifications: {
            enabled: true,
            fastingReminders: true,
            mealReminders: true,
            progressUpdates: false,
            goalAchievements: true,
            weeklyReports: false
          },
          fastingDefaults: {
            defaultGoalHours: 16,
            preferredFastingType: '16:8',
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
      this.saveLoggedUsernameToStorage(response.user.username);
      
      // Sync user data after successful login
      await this.syncUserDataAfterLogin();
      
      return response;
    } catch (error) {
      throw new Error(`Login failed: ${error}`);
    }
  }

  /**
   * Check if username is available (updated for backend API)
   */
  async checkUsernameAvailability(username: string): Promise<boolean> {
    try {
      const response = await userHttpClient.get<{usernameAvailable: boolean, emailAvailable: boolean}>(
        `/api/users/check-availability?username=${encodeURIComponent(username)}`
      );
      return response.usernameAvailable;
    } catch (error) {
      console.error('Error checking username availability:', error);
      return false;
    }
  }

  /**
   * Check if email is available (new method for backend API)
   */
  async checkEmailAvailability(email: string): Promise<boolean> {
    try {
      const response = await userHttpClient.get<{usernameAvailable: boolean, emailAvailable: boolean}>(
        `/api/users/check-availability?email=${encodeURIComponent(email)}`
      );
      return response.emailAvailable;
    } catch (error) {
      console.error('Error checking email availability:', error);
      return false;
    }
  }

  /**
   * Check both username and email availability
   */
  async checkUserAvailability(username: string, email: string): Promise<{usernameAvailable: boolean, emailAvailable: boolean}> {
    try {
      const response = await userHttpClient.get<{usernameAvailable: boolean, emailAvailable: boolean}>(
        `/api/users/check-availability?username=${encodeURIComponent(username)}&email=${encodeURIComponent(email)}`
      );
      return response;
    } catch (error) {
      console.error('Error checking user availability:', error);
      return { usernameAvailable: false, emailAvailable: false };
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
      this.saveLoggedUsernameToStorage(response.user.username);
      
      // For new users, there likely won't be existing data, but sync anyway
      await this.syncUserDataAfterLogin();
      
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
      const response = await userHttpClient.patch<UserApiResponse>(
        `/users/preferences?userId=${this.currentUser.id}`, 
        request,
        { headers: { Authorization: `Bearer ${this.authToken}` } }
      );
      
      // Update lokale User-Daten with the full user object from response
      const updatedUser = response.user;
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
   * Get authenticated headers for API calls
   */
  private getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {};
    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }
    return headers;
  }

  /**
   * Fetch user-specific fasting status from backend (with JWT authentication)
   */
  async fetchUserFastingStatus(): Promise<any> {
    try {
      if (!this.currentUser) {
        throw new Error('User not authenticated');
      }
      
      if (!this.authToken) {
        throw new Error('No authentication token available');
      }
      
      // Use the user-specific endpoint with username/email and JWT authentication
      const userIdentifier = this.currentUser.username || this.currentUser.email;
      const response = await userHttpClient.get<any>(
        `/api/fast/user/${encodeURIComponent(userIdentifier!)}/status`,
        { headers: this.getAuthHeaders() }
      );
      return response;
    } catch (error) {
      console.error('Failed to fetch user fasting status:', error);
      
      // Handle JWT-specific errors
      if (error instanceof Error && error.message.includes('401')) {
        console.log('Authentication failed, clearing session');
        this.logout();
      }
      
      return null;
    }
  }

  /**
   * Fetch user-specific fasting history from backend (with JWT authentication)
   */
  async fetchUserFastingHistory(): Promise<any[]> {
    try {
      if (!this.currentUser) {
        throw new Error('User not authenticated');
      }
      
      if (!this.authToken) {
        throw new Error('No authentication token available');
      }
      
      // Use the user-specific endpoint with username/email and JWT authentication
      const userIdentifier = this.currentUser.username || this.currentUser.email;
      const response = await userHttpClient.get<any[]>(
        `/api/fast/user/${encodeURIComponent(userIdentifier!)}/history`,
        { headers: this.getAuthHeaders() }
      );
      return response;
    } catch (error) {
      console.error('Failed to fetch user fasting history:', error);
      
      // Handle JWT-specific errors
      if (error instanceof Error && error.message.includes('401')) {
        console.log('Authentication failed, clearing session');
        this.logout();
      }
      
      return [];
    }
  }

  /**
   * Sync user data after login (fetch fasting state and history)
   */
  async syncUserDataAfterLogin(): Promise<{ status: any; history: any[] }> {
    try {
      const [status, history] = await Promise.all([
        this.fetchUserFastingStatus(),
        this.fetchUserFastingHistory()
      ]);
      
      console.log('User data synced:', { status, history });
      return { status, history };
    } catch (error) {
      console.error('Failed to sync user data:', error);
      return { status: null, history: [] };
    }
  }

  /**
   * Benutzer ausloggen
   */
  logout(): void {
    this.currentUser = null;
    this.authToken = null;
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
    this.clearLoggedUsername();
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
   * Eingeloggten Benutzernamen in localStorage speichern
   */
  private saveLoggedUsernameToStorage(username: string): void {
    localStorage.setItem(this.USERNAME_KEY, username);
  }

  /**
   * Eingeloggten Benutzernamen aus localStorage laden
   */
  getLoggedUsername(): string | null {
    return localStorage.getItem(this.USERNAME_KEY);
  }

  /**
   * Eingeloggten Benutzernamen aus localStorage entfernen
   */
  private clearLoggedUsername(): void {
    localStorage.removeItem(this.USERNAME_KEY);
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
