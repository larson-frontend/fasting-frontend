import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { userService } from '../../../src/api/user-service'
import type { UpdatePreferencesRequest, User } from '../../../src/types/user'


describe('UserService - Preferences Integration', () => {
  let originalFetch: typeof window.fetch
  let testUser: User

  beforeEach(() => {
    vi.clearAllMocks()
  originalFetch = window.fetch
    testUser = {
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
    // Set up userService with a logged-in user and token
    // @ts-ignore
    userService.currentUser = testUser
    // @ts-ignore
    userService.authToken = 'mock-token'
  })

  afterEach(() => {
  window.fetch = originalFetch
  })

  it('should call the correct API endpoint and send correct data for preferences update', async () => {
    const req: UpdatePreferencesRequest = { language: 'de', theme: 'dark' }
    const updatedUser = { ...testUser, preferences: { ...testUser.preferences, ...req } }
  window.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ user: updatedUser })
    })
    const result = await userService.updatePreferences(req)
  expect(window.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/users/preferences?userId=1'),
      expect.objectContaining({
        method: 'PATCH',
        headers: expect.objectContaining({ Authorization: 'Bearer mock-token' }),
        body: JSON.stringify(req)
      })
    )
    expect(result.preferences.language).toBe('de')
    expect(result.preferences.theme).toBe('dark')
  })

  it('should handle API error responses', async () => {
  window.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({ message: 'Internal Server Error' })
    })
    await expect(userService.updatePreferences({ language: 'de' })).rejects.toThrow()
  })

  it('should validate that user is logged in before updating preferences', async () => {
    // @ts-ignore
    userService.currentUser = null
    // @ts-ignore
    userService.authToken = null
    await expect(userService.updatePreferences({ language: 'de' })).rejects.toThrow('No user logged in')
  })

  it('should transform frontend data to API format and back', async () => {
    const req: UpdatePreferencesRequest = {
      language: 'de',
      notifications: {
        enabled: false,
        fastingReminders: false,
        mealReminders: false,
        progressUpdates: false,
        goalAchievements: false,
        weeklyReports: false
      },
      fastingDefaults: {
        defaultGoalHours: 20,
        preferredFastingType: '20:4',
        autoStartNextFast: true
      }
    }
    const updatedUser = {
      ...testUser,
      preferences: {
        ...testUser.preferences,
        ...req
      }
    }
  window.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ user: updatedUser })
    })
    const result = await userService.updatePreferences(req)
    expect(result.preferences.language).toBe('de')
    expect(result.preferences.fastingDefaults.defaultGoalHours).toBe(20)
    expect(result.preferences.notifications.enabled).toBe(false)
  })

  it('should persist language change locally and sync to backend', async () => {
  window.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ user: { ...testUser, preferences: { ...testUser.preferences, language: 'de' } } })
    })
  // @ts-ignore
  const spy = vi.spyOn(userService, 'saveLanguageToStorage')
    await userService.changeLanguage('de')
    expect(spy).toHaveBeenCalledWith('de')
  expect(window.fetch).toHaveBeenCalled()
  })
})
