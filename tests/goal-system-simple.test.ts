import { describe, it, expect, beforeEach } from 'vitest'
import { mount, mountWithI18n } from './test-utils'
import ProgressBar from '../src/components/ProgressBar.vue'
import GoalSelectionDialog from '../src/components/GoalSelectionDialog.vue'

describe('Goal System - Simplified Tests', () => {
  
  describe('ProgressBar Component', () => {
    it('should render with basic props', () => {
      const wrapper = mountWithI18n(ProgressBar, {
        props: {
          hours: 8,
          minutes: 30,
          goalHours: 12
        }
      })
      
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.find('[data-testid="progress-time"]').exists()).toBe(true)
    })

    it('should display correct time', () => {
      const wrapper = mountWithI18n(ProgressBar, {
        props: {
          hours: 8,
          minutes: 30,
          goalHours: 12
        }
      })
      
      const timeDisplay = wrapper.find('[data-testid="progress-time"]')
      expect(timeDisplay.exists()).toBe(true)
      expect(timeDisplay.text()).toContain('8h')
      expect(timeDisplay.text()).toContain('30m')
    })

    it('should show correct progress percentage', () => {
      const wrapper = mountWithI18n(ProgressBar, {
        props: {
          hours: 8,
          minutes: 0,
          goalHours: 16
        }
      })
      
      const percentage = wrapper.find('[data-testid="progress-percentage"]')
      expect(percentage.exists()).toBe(true)
      expect(percentage.text()).toContain('50%') // 8 of 16 hours = 50%
    })
  })

  describe('GoalSelectionDialog Component', () => {
    it('should render when shown', () => {
      const wrapper = mountWithI18n(GoalSelectionDialog, {
        props: {
          show: true
        }
      })
      
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.isVisible()).toBe(true)
    })

    it('should display goal options', () => {
      const wrapper = mountWithI18n(GoalSelectionDialog, {
        props: {
          show: true
        }
      })
      
      const goalButtons = wrapper.findAll('[data-testid="goal-option"]')
      expect(goalButtons.length).toBeGreaterThan(0)
    })

    it('should have confirm button', () => {
      const wrapper = mountWithI18n(GoalSelectionDialog, {
        props: {
          show: true
        }
      })
      
      const confirmButton = wrapper.find('[data-testid="confirm-goal-button"]')
      expect(confirmButton.exists()).toBe(true)
    })
  })

  describe('Goal Integration', () => {
    it('should handle different goal values', () => {
      const testGoals = [10, 12, 16, 18, 20, 22, 24]
      
      testGoals.forEach(goal => {
        const wrapper = mountWithI18n(ProgressBar, {
          props: {
            hours: goal / 2,
            minutes: 0,
            goalHours: goal
          }
        })
        
        expect(wrapper.exists()).toBe(true)
        expect(wrapper.find('[data-testid="progress-time"]').exists()).toBe(true)
      })
    })
  })
})
