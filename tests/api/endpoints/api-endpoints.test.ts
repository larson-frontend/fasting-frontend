/**
 * API Endpoint Integration Tests
 * Tests real API calls to verify URL construction and authentication
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { fastingApiService } from '../../../src/api/fasting-service'
import { userService } from '../../../src/api/user-service'

// Mock fetch for endpoint testing
let mockFetch: ReturnType<typeof vi.fn>

describe('API Endpoint Integration Tests', () => {
  beforeEach(() => {
    // Reset localStorage
    localStorage.clear()
    
    // Mock fetch
    mockFetch = vi.fn()
    window.fetch = mockFetch
    
    // Set up mock authentication
    localStorage.setItem('fasting_auth_token', 'mock-jwt-token')
    localStorage.setItem('fasting_user', JSON.stringify({
      id: '1',
      username: 'testuser',
      email: 'test@example.com'
    }))
  })

  afterEach(() => {
    vi.restoreAllMocks()
    localStorage.clear()
  })

  describe('Fasting Service Endpoints', () => {
    it('should call correct URL for global fasting endpoints', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ active: false })
      })

      await fastingApiService.getStatus()

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/fast/status',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          })
        })
      )
    })

    it('should call correct URL for start fasting', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ id: 1, startAt: new Date().toISOString() })
      })

      await fastingApiService.startFast(16)

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/fast/start',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          }),
          body: JSON.stringify({ goalHours: 16 })
        })
      )
    })

    it('should call correct URL for user-specific status with auth headers', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ active: false })
      })

      await fastingApiService.getUserStatus('testuser')

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/fast/user/testuser/status',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer mock-jwt-token'
          })
        })
      )
    })

    it('should call correct URL for user-specific history with auth headers', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([])
      })

      await fastingApiService.getUserHistory('testuser')

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/fast/user/testuser/history',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer mock-jwt-token'
          })
        })
      )
    })

    it('should handle URL encoding for user identifiers', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ active: false })
      })

      const userWithSpecialChars = 'user@domain.com'
      await fastingApiService.getUserStatus(userWithSpecialChars)

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/fast/user/user%40domain.com/status',
        expect.any(Object)
      )
    })
  })

  describe('User Service Endpoints', () => {
    it('should call correct URL for user login', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          user: { id: '1', username: 'testuser' },
          token: 'jwt-token'
        })
      })

      try {
        await userService.login({ username: 'testuser', email: 'test@example.com' })
      } catch (e) {
        // Expected to fail since we're mocking, but we want to check the URL
      }

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/users/login-or-create',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          })
        })
      )
    })

    it('should call correct URL for /users/current with auth headers', async () => {
      // Set up userService with auth token
      // @ts-ignore - accessing private property for testing
      userService.authToken = 'mock-jwt-token'
      
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ user: { id: '1', username: 'testuser' } })
      })

      await userService.getCurrentUser()

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/users/current?userId=1',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer mock-jwt-token'
          })
        })
      )
    })

    it('should call correct URL for preferences update with auth headers', async () => {
      // Set up userService with auth token and user
      // @ts-ignore - accessing private property for testing
      userService.authToken = 'mock-jwt-token'
      // @ts-ignore - accessing private property for testing
      userService.currentUser = { id: '1', username: 'testuser', email: 'test@example.com' }
      
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          user: { id: '1', username: 'testuser', preferences: { language: 'de' } }
        })
      })

      await userService.updatePreferences({ language: 'de' })

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/users/preferences?userId=1',
        expect.objectContaining({
          method: 'PATCH',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer mock-jwt-token'
          }),
          body: JSON.stringify({ language: 'de' })
        })
      )
    })

    it('should call correct URL for user fasting status from userService', async () => {
      // Set up userService with auth token and user
      // @ts-ignore - accessing private property for testing
      userService.authToken = 'mock-jwt-token'
      // @ts-ignore - accessing private property for testing
      userService.currentUser = { id: '1', username: 'testuser', email: 'test@example.com' }
      
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ active: false })
      })

      await userService.fetchUserFastingStatus()

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/fast/user/testuser/status',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer mock-jwt-token'
          })
        })
      )
    })
  })

  describe('URL Construction Validation', () => {
    it('should not have double /api/ in any endpoint', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({})
      })

      // Test various endpoints
      const testCalls = [
        () => fastingApiService.getStatus(),
        () => fastingApiService.getHistory(),
        () => fastingApiService.startFast(),
        () => fastingApiService.getUserStatus('testuser'),
        () => fastingApiService.getUserHistory('testuser'),
        () => userService.getCurrentUser(),
      ]

      // Execute all test calls
      for (const testCall of testCalls) {
        try {
          await testCall()
        } catch (e) {
          // Ignore errors, we just want to check URLs
        }
      }

      // Verify no URLs contain /api/api/
      const allCalls = mockFetch.mock.calls
      for (const call of allCalls) {
        const url = call[0] as string
        expect(url).not.toContain('/api/api/')
        expect(url).toMatch(/^http:\/\/localhost:8080\/api\//)
      }
    })

    it('should properly encode special characters in user identifiers', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({})
      })

      const specialUsers = [
        'user@domain.com',
        'user with spaces',
        'user+special',
        'user%encoded'
      ]

      for (const user of specialUsers) {
        await fastingApiService.getUserStatus(user)
      }

      const calls = mockFetch.mock.calls
      const urls = calls.map(call => call[0] as string)
      
      // Check that special characters are properly encoded
      expect(urls.some(url => url.includes('user%40domain.com'))).toBe(true)
      expect(urls.some(url => url.includes('user%20with%20spaces'))).toBe(true)
      expect(urls.some(url => url.includes('user%2Bspecial'))).toBe(true)
    })
  })

  describe('Authentication Header Tests', () => {
    it('should include Authorization header when token is present', async () => {
      localStorage.setItem('fasting_auth_token', 'test-token-123')
      
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({})
      })

      await fastingApiService.getUserStatus('testuser')

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-token-123'
          })
        })
      )
    })

    it('should not include Authorization header when token is missing', async () => {
      localStorage.removeItem('fasting_auth_token')
      
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({})
      })

      await fastingApiService.getUserStatus('testuser')

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.not.objectContaining({
            'Authorization': expect.any(String)
          })
        })
      )
    })
  })
})
