import type { User } from '../../../src/types/user'

// Mock User Data for Tests
export const mockUser: User = {
  id: "test-user-1",
  username: "testuser",
  email: "test@example.com",
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  preferences: {
    language: "en",
    theme: "system",
    timezone: "UTC",
    notifications: {
      enabled: true,
      fastingReminders: true,
      mealReminders: true,
      progressUpdates: false,
      goalAchievements: true,
      weeklyReports: false,
    },
    fastingDefaults: {
      defaultGoalHours: 16,
      preferredFastingType: "16:8",
      autoStartNextFast: false,
    },
  },
}

export const mockUserGerman: User = {
  ...mockUser,
  id: "test-user-german",
  preferences: {
    ...mockUser.preferences,
    language: "de",
    theme: "dark",
  },
}

// API Response Fixtures
export const mockApiResponses = {
  userCreated: {
    success: true,
    user: mockUser,
    message: "User created successfully"
  },
  userUpdated: {
    success: true,
    user: mockUser,
    message: "User updated successfully"
  },
  preferencesUpdated: {
    success: true,
    preferences: mockUser.preferences,
    message: "Preferences updated successfully"
  },
  error: {
    success: false,
    error: "Something went wrong",
    message: "An error occurred"
  }
}

// Test Scenarios
export const testScenarios = {
  newUser: {
    username: "newuser",
    email: "newuser@example.com"
  },
  existingUser: {
    username: "existinguser",
    email: "existing@example.com"
  },
  invalidUser: {
    username: "",
    email: "invalid-email"
  }
}
