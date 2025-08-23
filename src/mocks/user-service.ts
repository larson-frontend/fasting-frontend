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
}

// Singleton Instance
export const mockUserService = new MockUserService();
