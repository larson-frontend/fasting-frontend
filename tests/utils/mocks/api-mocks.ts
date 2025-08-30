import { vi } from 'vitest'
import { mockUser } from '../fixtures/user-data'

// Mock API Functions
export const mockApi = {
  getCurrentUser: vi.fn(),
  updateUserPreferences: vi.fn(),
  changeUserLanguage: vi.fn(),
  loginOrCreateUser: vi.fn(),
  checkUsernameAvailability: vi.fn(),
  getStoredLanguage: vi.fn(),
  getStoredTheme: vi.fn(),
  applyLanguage: vi.fn(),
  applyTheme: vi.fn(),
}

// API Mock Setup Helper
export const setupApiMocks = () => {
  vi.mock('../../../src/api', () => mockApi)
  return mockApi
}

// Reset all mocks
export const resetApiMocks = () => {
  vi.clearAllMocks()
  Object.values(mockApi).forEach(mock => mock.mockReset())
}

// Common mock implementations
export const mockImplementations = {
  // Successful responses
  getCurrentUserSuccess: () => mockApi.getCurrentUser.mockResolvedValue(mockUser),
  updatePreferencesSuccess: () => mockApi.updateUserPreferences.mockResolvedValue(mockUser),
  languageChangeSuccess: () => mockApi.changeUserLanguage.mockResolvedValue(true),
  
  // Error responses
  getCurrentUserError: () => mockApi.getCurrentUser.mockRejectedValue(new Error('User not found')),
  updatePreferencesError: () => mockApi.updateUserPreferences.mockRejectedValue(new Error('Update failed')),
  networkError: () => {
    Object.values(mockApi).forEach(mock => {
      if (typeof mock.mockRejectedValue === 'function') {
        mock.mockRejectedValue(new Error('Network error'))
      }
    })
  }
}
