import { describe, it, expect, vi } from 'vitest'
import { mountWithI18n } from '../../utils/test-utils'
import { nextTick } from 'vue'
import UserManager from '../../../src/components/UserManager.vue'
import UserSetup from '../../../src/components/UserSetup.vue'

vi.mock('../../../src/api', () => ({
  getCurrentUser: vi.fn(),
  getStoredLanguage: vi.fn(() => 'de')
}))

import { getCurrentUser } from '../../../src/api'

describe('UserManager', () => {
  it('shows setup when no user and sets locale from storage', async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(null as any)
    const wrapper = mountWithI18n(UserManager)
  // Wait for async mounted initialize and DOM updates
  await Promise.resolve()
  await nextTick()
    // UserSetup component should be visible
  expect(wrapper.findComponent(UserSetup).exists()).toBe(true)
  })

  it('shows profile button when user exists', async () => {
    vi.mocked(getCurrentUser).mockResolvedValue({
      id: '1', username: 'tester', createdAt: '', updatedAt: '',
      preferences: {
        language: 'de', theme: 'light', timezone: 'UTC',
        notifications: { enabled: true, fastingReminders: true, mealReminders: true, progressUpdates: false, goalAchievements: true, weeklyReports: false },
        fastingDefaults: { defaultGoalHours: 16, preferredFastingType: '16:8', autoStartNextFast: false }
      }
    } as any)
    const wrapper = mountWithI18n(UserManager)
  await Promise.resolve()
  await nextTick()
    expect(wrapper.text()).toContain('tester')
  })
})
