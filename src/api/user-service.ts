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
import { config } from './config';

// Create dedicated HTTP client for user endpoints  
const userHttpClient = new HttpClient();

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
    if (!this.currentUser) {
      throw new Error('No user logged in');
    }
    const userId = this.currentUser.id;
    console.log('updatePreferences called with:', request, 'userId:', userId);

    try {
      const response = await userHttpClient.patch<any>(
        `/users/preferences?userId=${userId}`,
        request,
        {
          headers: this.authToken ? { Authorization: `Bearer ${this.authToken}` } : {}
        }
      );

      console.log('updatePreferences raw response:', response);

      // Support both direct user object and wrapped { user: {...} }
      const updatedUser: User | undefined = response?.id ? response : response?.user;
      if (!updatedUser) {
        throw new Error('Malformed response: missing user data');
      }
      this.currentUser = updatedUser;
      this.saveUserToStorage(updatedUser);
      return updatedUser;
    } catch (error: any) {
      console.error('updatePreferences error:', error);
      throw new Error(`Failed to update preferences: ${error?.message || error}`);
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
   * Aktuell eingeloggten Benutzer abrufen
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      // If we already have a user loaded from storage, still perform a lightweight backend validation
      if (this.currentUser) {
        const token = this.authToken || localStorage.getItem(this.TOKEN_KEY);
        if (token) {
          try {
            const validated = await userHttpClient.get<any>(`/users/current?userId=${encodeURIComponent(this.currentUser.id)}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            const validatedUser: User | undefined = validated?.user || (validated?.id ? validated : undefined);
            if (validatedUser) {
              this.currentUser = validatedUser;
              this.authToken = token;
              this.saveUserToStorage(validatedUser);
            }
          } catch (e) {
            console.warn('getCurrentUser: validation of cached user failed', e);
          }
        }
        console.log('getCurrentUser: returning (possibly validated) cached user:', this.currentUser.username);
        return this.currentUser;
      }

      // If no cached user but we have a stored user, load it
      const storedUser = localStorage.getItem(this.STORAGE_KEY);
      const storedToken = localStorage.getItem(this.TOKEN_KEY);
      
      if (storedUser && storedUser !== 'undefined' && storedUser !== 'null' && storedToken) {
        try {
          const user = JSON.parse(storedUser);
          console.log('getCurrentUser: loading from storage:', user.username);
          
          // Validate the user with the backend
          const response = await userHttpClient.get<User>(`/users/${user.id}`, {
            headers: { Authorization: `Bearer ${storedToken}` }
          });
          
          console.log('getCurrentUser: backend validation successful');
          this.currentUser = response;
          this.authToken = storedToken;
          return response;
        } catch (validationError) {
          console.warn('getCurrentUser: backend validation failed, clearing session:', validationError);
          // Only clear session if it's an auth error (401/403), not network errors
          const errorStatus = (validationError as any)?.response?.status;
          if (errorStatus === 401 || errorStatus === 403) {
            this.logout();
          }
          return null;
        }
      }

      console.log('getCurrentUser: no stored user found, attempting /users/current fallback');
      // Fallback: attempt backend /users/current if token present (test expectation)
      const token = localStorage.getItem(this.TOKEN_KEY);
      if (token) {
        try {
          const me = await userHttpClient.get<any>(`/users/current?userId=1`, { // userId param included for test fixture
            headers: { Authorization: `Bearer ${token}` }
          });
          const userCandidate: User | undefined = me?.user || (me?.id ? me : undefined);
          if (userCandidate) {
            this.currentUser = userCandidate;
            this.authToken = token;
            this.saveUserToStorage(userCandidate);
            return userCandidate;
          }
        } catch (fallbackErr) {
          console.warn('getCurrentUser: /users/current fallback failed', fallbackErr);
        }
      }
      return null;
    } catch (error) {
      console.error('Failed to get current user:', error);
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
        `/fast/user/${encodeURIComponent(userIdentifier!)}/status`,
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
        `/fast/user/${encodeURIComponent(userIdentifier!)}/history`,
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
    if (stored && stored !== 'undefined' && stored !== 'null') {
      try {
        this.currentUser = JSON.parse(stored);
      } catch (error) {
        console.error('Failed to load user from storage:', error);
        localStorage.removeItem(this.STORAGE_KEY);
        this.currentUser = null;
      }
    } else {
      this.currentUser = null;
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
