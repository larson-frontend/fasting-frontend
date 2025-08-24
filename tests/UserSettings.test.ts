import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { nextTick } from 'vue'
import UserSettings from '../src/components/UserSettings.vue'
import ToggleSwitch from '../src/components/ToggleSwitch.vue'
import type { User } from '../src/types/user'

// Mock the API functions
vi.mock('../src/api', () => ({
  getCurrentUser: vi.fn(),
  updateUserPreferences: vi.fn(),
  changeUserLanguage: vi.fn()
}))


// Minimal i18n setup for tests
const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {},
    de: {}
  }
})

const mockUser: User = {
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

describe('UserSettings.vue', () => {
  let wrapper: any

  beforeEach(() => {
    vi.clearAllMocks()
    wrapper = mount(UserSettings, {
      global: {
        plugins: [i18n],
        stubs: {
          ToggleSwitch: true
        }
      },
      props: {
        currentUser: mockUser
      }
    })
  })

  describe('Component Rendering', () => {
    it('renders the settings dialog', () => {
      expect(wrapper.find('[data-testid="user-settings-dialog"]').exists()).toBe(true)
    })

    it('displays all settings sections', () => {
      expect(wrapper.text()).toContain('settings.language')
      expect(wrapper.text()).toContain('settings.theme')
      expect(wrapper.text()).toContain('settings.notifications')
      expect(wrapper.text()).toContain('settings.fastingDefaults')
    })

    it('shows save button', () => {
      expect(wrapper.find('[data-testid="save-button"]').exists()).toBe(true)
    })

    it('shows close button', () => {
      expect(wrapper.find('[data-testid="close-button"]').exists()).toBe(true)
    })
  })

  describe('Language Settings', () => {
    it('displays current language selection', () => {
      const languageButtons = wrapper.findAll('[data-testid^="language-"]')
      expect(languageButtons.length).toBeGreaterThan(0)
    })

    it('allows language selection', async () => {
      const germanButton = wrapper.find('[data-testid="language-de"]')
      await germanButton.trigger('click')
      await nextTick()
      
      expect(wrapper.vm.preferences.language).toBe('de')
    })

    it('highlights selected language', () => {
      const englishButton = wrapper.find('[data-testid="language-en"]')
      expect(englishButton.classes()).toContain('bg-indigo-500')
    })
  })

  describe('Theme Settings', () => {
    it('displays theme options', () => {
      const themeButtons = wrapper.findAll('[data-testid^="theme-"]')
      expect(themeButtons.length).toBe(3) // light, dark, system
    })

    it('allows theme selection', async () => {
      const darkButton = wrapper.find('[data-testid="theme-dark"]')
      await darkButton.trigger('click')
      await nextTick()
      
      expect(wrapper.vm.preferences.theme).toBe('dark')
    })

    it('highlights selected theme', () => {
      const systemButton = wrapper.find('[data-testid="theme-system"]')
      expect(systemButton.classes()).toContain('bg-indigo-500')
    })
  })

  describe('Notification Settings', () => {
    it('displays all notification toggles', () => {
      expect(wrapper.text()).toContain('settings.notifications.enabled')
      expect(wrapper.text()).toContain('settings.notifications.fastingReminders')
      expect(wrapper.text()).toContain('settings.notifications.mealReminders')
      expect(wrapper.text()).toContain('settings.notifications.progressUpdates')
      expect(wrapper.text()).toContain('settings.notifications.goalAchievements')
      expect(wrapper.text()).toContain('settings.notifications.weeklyReports')
    })

    it('renders ToggleSwitch components', () => {
      const toggleSwitches = wrapper.findAllComponents(ToggleSwitch)
      expect(toggleSwitches.length).toBeGreaterThan(0)
    })

    it('binds notification preferences correctly', () => {
      expect(wrapper.vm.preferences.notifications.enabled).toBe(true)
      expect(wrapper.vm.preferences.notifications.fastingReminders).toBe(true)
      expect(wrapper.vm.preferences.notifications.mealReminders).toBe(true)
      expect(wrapper.vm.preferences.notifications.progressUpdates).toBe(false)
      expect(wrapper.vm.preferences.notifications.goalAchievements).toBe(true)
      expect(wrapper.vm.preferences.notifications.weeklyReports).toBe(false)
    })
  })

  describe('Fasting Defaults', () => {
    it('displays default goal hours input', () => {
      const goalHoursInput = wrapper.find('[data-testid="goal-hours-input"]')
      expect(goalHoursInput.exists()).toBe(true)
      expect(goalHoursInput.element.value).toBe('16')
    })

    it('allows goal hours modification', async () => {
      const goalHoursInput = wrapper.find('[data-testid="goal-hours-input"]')
      await goalHoursInput.setValue(18)
      await nextTick()
      
      expect(wrapper.vm.preferences.fastingDefaults.defaultGoalHours).toBe(18)
    })

    it('displays fasting type options', () => {
      const fastingTypeButtons = wrapper.findAll('[data-testid^="fasting-type-"]')
      expect(fastingTypeButtons.length).toBe(3) // 16:8, 18:6, 24h
    })

    it('allows fasting type selection', async () => {
      const type186Button = wrapper.find('[data-testid="fasting-type-18:6"]')
      await type186Button.trigger('click')
      await nextTick()
      
      expect(wrapper.vm.preferences.fastingDefaults.preferredFastingType).toBe('18:6')
    })

    it('displays auto start toggle', () => {
      expect(wrapper.text()).toContain('settings.fastingDefaults.autoStartNextFast')
    })
  })

  describe('Save Functionality', () => {
    it('calls updateUserPreferences when save is clicked', async () => {
      const { updateUserPreferences } = await import('../src/api')
      const mockUpdatePreferences = vi.mocked(updateUserPreferences)
      mockUpdatePreferences.mockResolvedValue(mockUser)

      const saveButton = wrapper.find('[data-testid="save-button"]')
      await saveButton.trigger('click')
      await nextTick()

      expect(mockUpdatePreferences).toHaveBeenCalledWith(wrapper.vm.preferences)
    })

    it('shows loading state while saving', async () => {
      const { updateUserPreferences } = await import('../src/api')
      const mockUpdatePreferences = vi.mocked(updateUserPreferences)
      
      let resolvePromise: (value: any) => void
      const savePromise = new Promise(resolve => {
        resolvePromise = resolve
      })
      mockUpdatePreferences.mockReturnValue(savePromise)

      const saveButton = wrapper.find('[data-testid="save-button"]')
      await saveButton.trigger('click')
      await nextTick()

      expect(wrapper.vm.saving).toBe(true)
      expect(saveButton.text()).toContain('common.saving')

      resolvePromise!(mockUser)
      await nextTick()
      await nextTick()

      expect(wrapper.vm.saving).toBe(false)
    })

    it('shows success message after successful save', async () => {
      const { updateUserPreferences } = await import('../src/api')
      const mockUpdatePreferences = vi.mocked(updateUserPreferences)
      mockUpdatePreferences.mockResolvedValue(mockUser)

      const saveButton = wrapper.find('[data-testid="save-button"]')
      await saveButton.trigger('click')
      await nextTick()
      await nextTick()

      expect(wrapper.vm.saveStatus).toBe('success')
      expect(wrapper.vm.saveMessage).toBe('Settings saved successfully!')
    })

    it('shows error message on save failure', async () => {
      const { updateUserPreferences } = await import('../src/api')
      const mockUpdatePreferences = vi.mocked(updateUserPreferences)
      mockUpdatePreferences.mockRejectedValue(new Error('Save failed'))

      const saveButton = wrapper.find('[data-testid="save-button"]')
      await saveButton.trigger('click')
      await nextTick()
      await nextTick()

      expect(wrapper.vm.saveStatus).toBe('error')
      expect(wrapper.vm.saveMessage).toBe('Save failed')
    })

    it('emits updated event on successful save', async () => {
      const { updateUserPreferences } = await import('../src/api')
      const mockUpdatePreferences = vi.mocked(updateUserPreferences)
      mockUpdatePreferences.mockResolvedValue(mockUser)

      const saveButton = wrapper.find('[data-testid="save-button"]')
      await saveButton.trigger('click')
      await nextTick()
      await nextTick()

      expect(wrapper.emitted('updated')).toBeTruthy()
      expect(wrapper.emitted('updated')?.[0]).toEqual([mockUser])
    })
  })

  describe('Close Functionality', () => {
    it('emits close event when close button is clicked', async () => {
      const closeButton = wrapper.find('[data-testid="close-button"]')
      await closeButton.trigger('click')

      expect(wrapper.emitted('close')).toBeTruthy()
    })

    it('emits close event when overlay is clicked', async () => {
      const overlay = wrapper.find('[data-testid="overlay"]')
      await overlay.trigger('click')

      expect(wrapper.emitted('close')).toBeTruthy()
    })
  })

  describe('Validation', () => {
    it('prevents saving when no user is logged in', async () => {
      wrapper = mount(UserSettings, {
        global: {
          // mocks: mockGlobalProperties, // removed, now using i18n plugin
          stubs: {
            ToggleSwitch: true
          }
        },
        props: {
          currentUser: null
        }
      })

      const saveButton = wrapper.find('[data-testid="save-button"]')
      await saveButton.trigger('click')
      await nextTick()

      expect(wrapper.vm.saveStatus).toBe('error')
      expect(wrapper.vm.saveMessage).toBe('No user logged in')
    })

    it('validates goal hours input range', async () => {
      const goalHoursInput = wrapper.find('[data-testid="goal-hours-input"]')
      
      // Test minimum value
      await goalHoursInput.setValue(0)
      expect(goalHoursInput.element.value).toBe('1') // Should enforce minimum

      // Test maximum value
      await goalHoursInput.setValue(50)
      expect(goalHoursInput.element.value).toBe('48') // Should enforce maximum
    })
  })

  describe('Reactivity', () => {
    it('updates preferences when currentUser prop changes', async () => {
      const updatedUser = {
        ...mockUser,
        preferences: {
          ...mockUser.preferences,
          language: 'de',
          theme: 'dark'
        }
      }

      await wrapper.setProps({ currentUser: updatedUser })
      await nextTick()

      expect(wrapper.vm.preferences.language).toBe('de')
      expect(wrapper.vm.preferences.theme).toBe('dark')
    })

    it('maintains local state when editing', async () => {
      const germanButton = wrapper.find('[data-testid="language-de"]')
      await germanButton.trigger('click')

      // Should update local preferences but not the prop
      expect(wrapper.vm.preferences.language).toBe('de')
      expect(wrapper.props('currentUser').preferences.language).toBe('en')
    })
  })
})
