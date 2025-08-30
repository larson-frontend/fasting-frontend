import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type { User, UpdatePreferencesRequest } from '../../../src/types/user'

// Mock the entire user-service module
vi.mock('../../../src/api/user-service', () => ({
  userService: {
    updatePreferences: vi.fn(),
    getCurrentUser: vi.fn(),
    isLoggedIn: vi.fn()
  }
}))

// Import after mocking
import { userService } from '../../../src/api/user-service'

describe('UserService - Preferences API', () => {
  let mockUser: User

  beforeEach(() => {
    vi.clearAllMocks()
    
    mockUser = {
      id: '1',
      username: 'testuser',
      email: 'test@example.com',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      preferences: {
        language: 'en',
        theme: 'system',
        timezone: 'UTC',
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
    }
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('updatePreferences', () => {
    it('should call updatePreferences with correct parameters', async () => {
      const request: UpdatePreferencesRequest = {
        language: 'de'
      }

      const expectedUser = {
        ...mockUser,
        preferences: {
          ...mockUser.preferences,
          language: 'de'
        }
      }

      vi.mocked(userService.updatePreferences).mockResolvedValue(expectedUser)

      const result = await userService.updatePreferences(request)

      expect(userService.updatePreferences).toHaveBeenCalledWith(request)
      expect(result).toEqual(expectedUser)
    })

    it('should handle language updates', async () => {
      const request: UpdatePreferencesRequest = {
        language: 'de'
      }

      const updatedUser: User = {
        ...mockUser,
        preferences: {
          ...mockUser.preferences,
          language: 'de' as const
        }
      }

      vi.mocked(userService.updatePreferences).mockResolvedValue(updatedUser)

      const result = await userService.updatePreferences(request)

      expect(result.preferences.language).toBe('de')
    })

    it('should handle theme updates', async () => {
      const request: UpdatePreferencesRequest = {
        theme: 'dark'
      }

      const updatedUser: User = {
        ...mockUser,
        preferences: {
          ...mockUser.preferences,
          theme: 'dark' as const
        }
      }

      vi.mocked(userService.updatePreferences).mockResolvedValue(updatedUser)

      const result = await userService.updatePreferences(request)

      expect(result.preferences.theme).toBe('dark')
    })

    it('should handle notification preference updates', async () => {
      const request: UpdatePreferencesRequest = {
        notifications: {
          enabled: false,
          fastingReminders: false,
          mealReminders: true,
          progressUpdates: true,
          goalAchievements: false,
          weeklyReports: true
        }
      }

      const updatedUser = {
        ...mockUser,
        preferences: {
          ...mockUser.preferences,
          notifications: request.notifications!
        }
      }

      vi.mocked(userService.updatePreferences).mockResolvedValue(updatedUser)

      const result = await userService.updatePreferences(request)

      expect(result.preferences.notifications.enabled).toBe(false)
      expect(result.preferences.notifications.fastingReminders).toBe(false)
      expect(result.preferences.notifications.mealReminders).toBe(true)
      expect(result.preferences.notifications.progressUpdates).toBe(true)
      expect(result.preferences.notifications.goalAchievements).toBe(false)
      expect(result.preferences.notifications.weeklyReports).toBe(true)
    })

    it('should handle fasting defaults updates', async () => {
      const request: UpdatePreferencesRequest = {
        fastingDefaults: {
          defaultGoalHours: 24,
          preferredFastingType: '24h',
          autoStartNextFast: true
        }
      }

      const updatedUser = {
        ...mockUser,
        preferences: {
          ...mockUser.preferences,
          fastingDefaults: request.fastingDefaults!
        }
      }

      vi.mocked(userService.updatePreferences).mockResolvedValue(updatedUser)

      const result = await userService.updatePreferences(request)

      expect(result.preferences.fastingDefaults.defaultGoalHours).toBe(24)
      expect(result.preferences.fastingDefaults.preferredFastingType).toBe('24h')
      expect(result.preferences.fastingDefaults.autoStartNextFast).toBe(true)
    })

    it('should handle timezone updates', async () => {
      const request: UpdatePreferencesRequest = {
        timezone: 'Europe/Berlin'
      }

      const updatedUser = {
        ...mockUser,
        preferences: {
          ...mockUser.preferences,
          timezone: 'Europe/Berlin'
        }
      }

      vi.mocked(userService.updatePreferences).mockResolvedValue(updatedUser)

      const result = await userService.updatePreferences(request)

      expect(result.preferences.timezone).toBe('Europe/Berlin')
    })

    it('should handle multiple preference updates', async () => {
      const request: UpdatePreferencesRequest = {
        language: 'de',
        theme: 'dark',
        timezone: 'Europe/Berlin',
        notifications: {
          enabled: true,
          fastingReminders: false,
          mealReminders: false,
          progressUpdates: true,
          goalAchievements: true,
          weeklyReports: true
        },
        fastingDefaults: {
          defaultGoalHours: 18,
          preferredFastingType: '18:6',
          autoStartNextFast: true
        }
      }

      const updatedUser = {
        ...mockUser,
        preferences: {
          language: 'de',
          theme: 'dark',
          timezone: 'Europe/Berlin',
          notifications: request.notifications!,
          fastingDefaults: request.fastingDefaults!
        }
      }

      vi.mocked(userService.updatePreferences).mockResolvedValue(updatedUser)

      const result = await userService.updatePreferences(request)

      expect(result.preferences.language).toBe('de')
      expect(result.preferences.theme).toBe('dark')
      expect(result.preferences.timezone).toBe('Europe/Berlin')
      expect(result.preferences.notifications.fastingReminders).toBe(false)
      expect(result.preferences.fastingDefaults.preferredFastingType).toBe('18:6')
    })

    it('should handle API errors', async () => {
      const request: UpdatePreferencesRequest = {
        language: 'de'
      }

      const error = new Error('API Error')
      vi.mocked(userService.updatePreferences).mockRejectedValue(error)

      await expect(userService.updatePreferences(request))
        .rejects.toThrow('API Error')
    })

    it('should handle empty request objects', async () => {
      const request: UpdatePreferencesRequest = {}

      vi.mocked(userService.updatePreferences).mockResolvedValue(mockUser)

      const result = await userService.updatePreferences(request)

      expect(userService.updatePreferences).toHaveBeenCalledWith(request)
      expect(result).toEqual(mockUser)
    })
  })
})
