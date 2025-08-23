/**
 * Mock User Service
 * Simuliert User API für Entwicklung und Testing
 */

import type { 
  User, 
  CreateUserRequest, 
  LoginRequest,
  AuthResponse,
  UpdatePreferencesRequest,
  UserPreferences
} from '../types/user';

class MockUserService {
  private users: Map<string, User> = new Map();
  private idCounter = 1;
  private readonly USERNAME_KEY = 'fasting_logged_username';

  constructor() {
    // Erstelle Demo-Benutzer
    this.createDemoUsers();
  }

  /**
   * Benutzer einloggen (Mock)
   */
  async login(request: LoginRequest): Promise<AuthResponse> {
    await this.delay(300); // Simuliere API-Delay
    
    const user = Array.from(this.users.values())
      .find(u => u.username === request.username);
    
    if (!user) {
      throw new Error('User not found');
    }

    // Save logged username to localStorage
    localStorage.setItem(this.USERNAME_KEY, user.username);

    // Sync user data after login
    await this.syncUserDataAfterLogin();

    return {
      user,
      token: 'mock-jwt-token',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };
  }

  /**
   * Neuen Benutzer erstellen (Mock)
   */
  async createUser(request: CreateUserRequest): Promise<AuthResponse> {
    await this.delay(500); // Simuliere API-Delay
    
    // Prüfe ob Username bereits existiert
    const existing = Array.from(this.users.values())
      .find(u => u.username === request.username);
    
    if (existing) {
      throw new Error('Username already exists');
    }

    const now = new Date().toISOString();
    const userId = `mock-user-${this.idCounter++}`;
    
    const defaultPreferences: UserPreferences = {
      language: request.preferences?.language || 'en',
      theme: request.preferences?.theme || 'auto',
      timezone: request.preferences?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
      notifications: {
        enabled: true,
        fastingReminders: true,
        goalAchievements: true,
        weeklyReports: false,
        ...request.preferences?.notifications
      },
      fastingDefaults: {
        defaultGoalHours: 16,
        preferredFastingType: 'intermittent',
        autoStartNextFast: false,
        ...request.preferences?.fastingDefaults
      }
    };

    const user: User = {
      id: userId,
      username: request.username,
      email: request.email,
      createdAt: now,
      updatedAt: now,
      preferences: defaultPreferences
    };

    this.users.set(userId, user);

    // Save logged username to localStorage
    localStorage.setItem(this.USERNAME_KEY, user.username);

    // Sync user data (for new users, won't have existing data)
    await this.syncUserDataAfterLogin();

    return {
      user,
      token: 'mock-jwt-token',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };
  }

  /**
   * Benutzer-Einstellungen aktualisieren (Mock)
   */
  async updatePreferences(userId: string, request: UpdatePreferencesRequest): Promise<UserPreferences> {
    await this.delay(200); // Simuliere API-Delay
    
    const user = this.users.get(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Update preferences
    user.preferences = {
      ...user.preferences,
      ...request,
      notifications: request.notifications ? 
        { ...user.preferences.notifications, ...request.notifications } : 
        user.preferences.notifications,
      fastingDefaults: request.fastingDefaults ? 
        { ...user.preferences.fastingDefaults, ...request.fastingDefaults } : 
        user.preferences.fastingDefaults
    };
    
    user.updatedAt = new Date().toISOString();
    this.users.set(userId, user);

    return user.preferences;
  }

  /**
   * Benutzer abrufen (Mock)
   */
  async getUser(userId: string): Promise<User> {
    await this.delay(100);
    
    const user = this.users.get(userId);
    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  /**
   * Login or Create User (Mock) - matches backend API
   */
  async loginOrCreate(request: LoginRequest): Promise<AuthResponse> {
    await this.delay(300);
    
    try {
      // Try to login first
      return await this.login(request);
    } catch (error) {
      // If login fails, create new user
      console.log('User not found, creating new user:', request.username || request.email);
      
      const createRequest: CreateUserRequest = {
        username: request.username || request.email?.split('@')[0] || 'user',
        email: request.email,
        preferences: {
          language: 'en',
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
   * Check username availability (Mock)
   */
  async checkUsernameAvailability(username: string): Promise<boolean> {
    await this.delay(100);
    
    const exists = Array.from(this.users.values())
      .some(user => user.username === username || user.email === username);
    
    return !exists; // Return true if available (not exists)
  }

  /**
   * Demo-Benutzer erstellen
   */
  private createDemoUsers(): void {
    const demoUsers: CreateUserRequest[] = [
      {
        username: 'demo',
        email: 'demo@fastingtracker.app',
        preferences: {
          language: 'en',
          theme: 'light',
          timezone: 'Europe/Berlin',
          notifications: {
            enabled: true,
            fastingReminders: true,
            goalAchievements: true,
            weeklyReports: true
          },
          fastingDefaults: {
            defaultGoalHours: 16,
            preferredFastingType: 'intermittent',
            autoStartNextFast: false
          }
        }
      },
      {
        username: 'lars',
        email: 'lars@example.com',
        preferences: {
          language: 'de',
          theme: 'dark',
          timezone: 'Europe/Berlin',
          notifications: {
            enabled: true,
            fastingReminders: true,
            goalAchievements: true,
            weeklyReports: false
          },
          fastingDefaults: {
            defaultGoalHours: 18,
            preferredFastingType: 'intermittent',
            autoStartNextFast: true
          }
        }
      }
    ];

    // Synchron erstellen für Mock-Setup
    demoUsers.forEach(userRequest => {
      const now = new Date().toISOString();
      const userId = `demo-user-${this.idCounter++}`;
      
      const user: User = {
        id: userId,
        username: userRequest.username,
        email: userRequest.email,
        createdAt: now,
        updatedAt: now,
        preferences: userRequest.preferences as UserPreferences
      };

      this.users.set(userId, user);
    });
  }

  /**
   * Simuliere API-Delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get logged username from localStorage
   */
  getLoggedUsername(): string | null {
    return localStorage.getItem(this.USERNAME_KEY);
  }

  /**
   * Logout user (clear localStorage)
   */
  logout(): void {
    this.clearLoggedUsername();
  }

  /**
   * Clear logged username from localStorage
   */
  private clearLoggedUsername(): void {
    localStorage.removeItem(this.USERNAME_KEY);
  }

  /**
   * Mock: Fetch user-specific fasting status
   */
  async fetchUserFastingStatus(): Promise<any> {
    await this.delay(200);
    
    // Return mock fasting status
    return {
      active: false,
      hours: 0,
      minutes: 0,
      since: null,
      goalHours: 16
    };
  }

  /**
   * Mock: Fetch user-specific fasting history  
   */
  async fetchUserFastingHistory(): Promise<any[]> {
    await this.delay(300);
    
    // Return mock fasting history
    return [
      {
        id: 'mock-session-1',
        startTime: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        endTime: new Date(Date.now() - 86400000 + 16*3600000).toISOString(), // 16 hours later
        goalHours: 16,
        actualHours: 16,
        completed: true
      },
      {
        id: 'mock-session-2', 
        startTime: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        endTime: new Date(Date.now() - 172800000 + 18*3600000).toISOString(), // 18 hours later
        goalHours: 16,
        actualHours: 18,
        completed: true
      }
    ];
  }

  /**
   * Mock: Sync user data after login
   */
  async syncUserDataAfterLogin(): Promise<{ status: any; history: any[] }> {
    await this.delay(100);
    
    const [status, history] = await Promise.all([
      this.fetchUserFastingStatus(),
      this.fetchUserFastingHistory()
    ]);
    
    console.log('Mock user data synced:', { status, history });
    return { status, history };
  }
}

// Singleton Instance
export const mockUserService = new MockUserService();
