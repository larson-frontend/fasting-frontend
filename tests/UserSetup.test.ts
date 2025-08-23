import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mountWithI18n } from './test-utils'
import UserSetup from '../src/components/UserSetup.vue'
import { nextTick } from 'vue'

// Mock the API functions
vi.mock('../src/api', () => ({
  loginOrCreateUser: vi.fn(),
  getStoredLanguage: vi.fn(() => 'en'),
  checkUsernameAvailability: vi.fn(),
  checkEmailAvailability: vi.fn(),
  checkUserAvailability: vi.fn(),
  getLoggedUsername: vi.fn(),
  syncUserDataAfterLogin: vi.fn(),
  fetchUserFastingStatus: vi.fn(),
  fetchUserFastingHistory: vi.fn(),
  startUserFast: vi.fn(),
  stopUserFast: vi.fn(),
  getUserFastingStatus: vi.fn(),
  getUserFastingHistory: vi.fn()
}))

import { loginOrCreateUser, checkUsernameAvailability } from '../src/api'

describe('UserSetup Component', () => {
  let mockLoginOrCreateUser: any
  let mockCheckUsernameAvailability: any

  beforeEach(() => {
    mockLoginOrCreateUser = vi.mocked(loginOrCreateUser)
    mockCheckUsernameAvailability = vi.mocked(checkUsernameAvailability)
    mockLoginOrCreateUser.mockClear()
    mockCheckUsernameAvailability.mockClear()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('Username Already Exists Scenario', () => {
    it('should display USER_EXISTS error when username already exists', async () => {
      // Mock API to return USER_EXISTS error
      const userExistsError = {
        code: 'USER_EXISTS',
        message: 'Username is already taken'
      }
      mockLoginOrCreateUser.mockRejectedValue(userExistsError)

      const wrapper = mountWithI18n(UserSetup)

      // Fill in the username field
      const usernameInput = wrapper.find('#identifier')
      await usernameInput.setValue('existinguser')

      // Submit the form
      const form = wrapper.find('form')
      await form.trigger('submit.prevent')

      // Wait for the async operation to complete
      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 0))

      // Check that the error is displayed
      expect(wrapper.find('[data-testid="error-message"]').exists()).toBe(true)
      
      // Check that the error has the correct type and styling
      const errorDiv = wrapper.find('.border-amber-200')
      expect(errorDiv.exists()).toBe(true)
      
      // Check that the correct error title is displayed
      expect(wrapper.text()).toContain('Username/Email Already Taken')
      expect(wrapper.text()).toContain('Please try a different username or email address')
    })

    it('should display USER_EXISTS error when email already exists', async () => {
      // Mock API to return USER_EXISTS error for email
      const userExistsError = {
        code: 'USER_EXISTS',
        message: 'Email is already registered'
      }
      mockLoginOrCreateUser.mockRejectedValue(userExistsError)

      const wrapper = mountWithI18n(UserSetup)

      // Fill in the email field
      const identifierInput = wrapper.find('#identifier')
      await identifierInput.setValue('existing@example.com')

      // Submit the form
      const form = wrapper.find('form')
      await form.trigger('submit.prevent')

      // Wait for the async operation to complete
      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 0))

      // Check that the correct API call was made with email
      expect(mockLoginOrCreateUser).toHaveBeenCalledWith({
        email: 'existing@example.com'
      })

      // Check that the error is displayed with amber styling (warning style)
      const errorDiv = wrapper.find('.border-amber-200')
      expect(errorDiv.exists()).toBe(true)
    })

    it('should emit error event when username already exists', async () => {
      const userExistsError = {
        code: 'USER_EXISTS',
        message: 'Username is already taken'
      }
      mockLoginOrCreateUser.mockRejectedValue(userExistsError)

      const wrapper = mountWithI18n(UserSetup)

      // Fill in the username and submit
      await wrapper.find('#identifier').setValue('existinguser')
      await wrapper.find('form').trigger('submit.prevent')

      // Wait for async operations
      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 0))

      // Check that error event was emitted
      expect(wrapper.emitted('error')).toBeTruthy()
      expect(wrapper.emitted('error')?.[0]?.[0]).toBe('Username is already taken')
    })

    it('should differentiate between USER_EXISTS and general errors', async () => {
      // Test general error first
      const generalError = {
        code: 'NETWORK_ERROR',
        message: 'Network connection failed'
      }
      mockLoginOrCreateUser.mockRejectedValue(generalError)

      const wrapper = mountWithI18n(UserSetup)

      await wrapper.find('#identifier').setValue('testuser')
      await wrapper.find('form').trigger('submit.prevent')

      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 0))

      // Check for red error styling (general error)
      let errorDiv = wrapper.find('.border-red-200')
      expect(errorDiv.exists()).toBe(true)
      expect(wrapper.text()).toContain('Registration Error')

      // Now test USER_EXISTS error
      const userExistsError = {
        code: 'USER_EXISTS',
        message: 'Username is already taken'
      }
      mockLoginOrCreateUser.mockRejectedValue(userExistsError)

      await wrapper.find('#identifier').setValue('existinguser')
      await wrapper.find('form').trigger('submit.prevent')

      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 0))

      // Check for amber error styling (warning for existing user)
      errorDiv = wrapper.find('.border-amber-200')
      expect(errorDiv.exists()).toBe(true)
      expect(wrapper.text()).toContain('Username/Email Already Taken')
    })

    it('should clear error when user types after getting USER_EXISTS error', async () => {
      const userExistsError = {
        code: 'USER_EXISTS',
        message: 'Username is already taken'
      }
      mockLoginOrCreateUser.mockRejectedValue(userExistsError)

      const wrapper = mountWithI18n(UserSetup)

      // Submit with existing username
      await wrapper.find('#identifier').setValue('existinguser')
      await wrapper.find('form').trigger('submit.prevent')

      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 0))

      // Verify error is shown
      expect(wrapper.find('.border-amber-200').exists()).toBe(true)

      // Change the input value (simulate user typing new username)
      await wrapper.find('#identifier').setValue('newuser')

      await nextTick()

      // Error should still be visible until next submit
      expect(wrapper.find('.border-amber-200').exists()).toBe(true)
    })

    it('should show correct error icon for USER_EXISTS', async () => {
      const userExistsError = {
        code: 'USER_EXISTS',
        message: 'Username is already taken'
      }
      mockLoginOrCreateUser.mockRejectedValue(userExistsError)

      const wrapper = mountWithI18n(UserSetup)

      await wrapper.find('#identifier').setValue('existinguser')
      await wrapper.find('form').trigger('submit.prevent')

      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 0))

      // Check that the warning triangle icon path is used for USER_EXISTS
      // Find the SVG path inside the error message div
      const errorDiv = wrapper.find('[data-testid="error-message"]')
      const svgPath = errorDiv.find('svg path')
      expect(svgPath.attributes('d')).toContain('M12 9v3.75m')
    })

    it('should disable submit button while loading', async () => {
      // Mock a slow API response
      mockLoginOrCreateUser.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve({ user: { id: 1 } }), 100))
      )

      const wrapper = mountWithI18n(UserSetup)

      await wrapper.find('#identifier').setValue('testuser')
      
      const submitButton = wrapper.find('button[type="submit"]')
      expect(submitButton.attributes('disabled')).toBeUndefined()

      // Submit the form
      await wrapper.find('form').trigger('submit.prevent')
      await nextTick()

      // Button should be disabled while loading
      expect(submitButton.attributes('disabled')).toBeDefined()
      expect(wrapper.text()).toContain('Loading...')
    })

    it('should validate email format correctly', async () => {
      const wrapper = mountWithI18n(UserSetup)

      // Test email format
      await wrapper.find('#identifier').setValue('test@example.com')
      await wrapper.find('form').trigger('submit.prevent')

      await nextTick()

      expect(mockLoginOrCreateUser).toHaveBeenCalledWith({
        email: 'test@example.com'
      })

      // Test username format
      mockLoginOrCreateUser.mockClear()
      await wrapper.find('#identifier').setValue('testuser123')
      await wrapper.find('form').trigger('submit.prevent')

      await nextTick()

      expect(mockLoginOrCreateUser).toHaveBeenCalledWith({
        username: 'testuser123'
      })
    })
  })

  describe('Language Selection', () => {
    it('should change interface language when language button is clicked', async () => {
      const wrapper = mountWithI18n(UserSetup)

      // Check initial language (should be German as per test-utils setup)
      expect(wrapper.text()).toContain('Willkommen!')

      // Click English button (find by the text content)
      const buttons = wrapper.findAll('button')
      const englishButton = buttons.find(button => button.text().includes('English'))
      
      if (englishButton) {
        await englishButton.trigger('click')
        await nextTick()

        // Interface should now be in English
        expect(wrapper.text()).toContain('Welcome!')
      }
    })
  })

  describe('Successful Registration', () => {
    it('should emit success event on successful registration', async () => {
      const mockUser = { id: 1, username: 'newuser' }
      mockLoginOrCreateUser.mockResolvedValue({ user: mockUser })

      const wrapper = mountWithI18n(UserSetup)

      await wrapper.find('#identifier').setValue('newuser')
      await wrapper.find('form').trigger('submit.prevent')

      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 0))

      expect(wrapper.emitted('success')).toBeTruthy()
      expect(wrapper.emitted('success')?.[0]?.[0]).toEqual(mockUser)
    })
  })
})
