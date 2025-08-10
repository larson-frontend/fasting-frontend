/**
 * Comprehensive Test Suite for Fasting Tracker Goal System
 * 
 * Tests für das erweiterte Ziel-System mit benutzerdefinierten Fasten-Zielen
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ProgressBar from '../src/components/ProgressBar.vue'
import GoalSelectionDialog from '../src/components/GoalSelectionDialog.vue'
import { activateTestMode, deactivateTestMode } from '../src/utils/testScenarios'

describe('Goal System Integration Tests', () => {
  beforeEach(() => {
    deactivateTestMode()
  })

  describe('ProgressBar with Custom Goals', () => {
    it('should display correct progress for 12h goal at 8h', () => {
      const wrapper = mount(ProgressBar, {
        props: {
          hours: 8,
          minutes: 30,
          goalHours: 12
        }
      })

      // Bei 8.5h von 12h Ziel = 70.83% Progress
      const progressElement = wrapper.find('[data-testid="progress-width"]')
      expect(progressElement.text()).toContain('71%')
      
      // Sollte noch orange sein (unter Ziel)
      expect(wrapper.find('[data-testid="phase-name"]').text()).toContain('Fettverbrennung')
    })

    it('should switch to extended scale when goal is reached', () => {
      const wrapper = mount(ProgressBar, {
        props: {
          hours: 13,
          minutes: 0,
          goalHours: 12
        }
      })

      // Nach 12h Ziel erreicht -> Umstellung auf 20h Skala (12+8)
      // 13h von 20h = 65% Progress
      const progressElement = wrapper.find('[data-testid="progress-width"]')
      expect(progressElement.text()).toContain('65%')
      
      // Sollte "Bonus-Zeit" Phase sein
      expect(wrapper.find('[data-testid="phase-name"]').text()).toContain('Bonus-Zeit')
      
      // Sollte grün/violett Farben haben
      expect(wrapper.find('[data-testid="border-class"]').classes()).toContain('border-emerald-200')
    })

    it('should show goal separation line when goal is exceeded', () => {
      const wrapper = mount(ProgressBar, {
        props: {
          hours: 19,
          minutes: 0,
          goalHours: 18
        }
      })

      // Trennlinie sollte sichtbar sein
      const separationLine = wrapper.find('[data-testid="goal-separation-line"]')
      expect(separationLine.exists()).toBe(true)
      
      // Position sollte bei 18h von 26h = ~69% sein
      const lineStyle = separationLine.attributes('style')
      expect(lineStyle).toContain('left: 69')
      
      // Label sollte "18h" zeigen
      expect(separationLine.find('[data-testid="goal-label"]').text()).toBe('18h')
    })

    it('should handle extreme goals correctly', () => {
      // Test 10h Ziel
      const wrapper10h = mount(ProgressBar, {
        props: {
          hours: 11,
          minutes: 30,
          goalHours: 10
        }
      })
      
      // 11.5h bei 10h Ziel -> erweiterte Skala 18h (10+8)
      expect(wrapper10h.find('[data-testid="max-hours"]').text()).toContain('18h')
      
      // Test 24h Ziel
      const wrapper24h = mount(ProgressBar, {
        props: {
          hours: 25,
          minutes: 0,
          goalHours: 24
        }
      })
      
      // 25h bei 24h Ziel -> erweiterte Skala 32h (24+8)
      expect(wrapper24h.find('[data-testid="max-hours"]').text()).toContain('32h')
    })
  })

  describe('Goal Selection Dialog', () => {
    it('should render all goal options', () => {
      const wrapper = mount(GoalSelectionDialog, {
        props: { show: true }
      })

      const goalButtons = wrapper.findAll('[data-testid="goal-option"]')
      expect(goalButtons).toHaveLength(6)
      
      // Prüfe alle Ziel-Optionen
      const expectedGoals = [10, 12, 16, 18, 20, 24]
      goalButtons.forEach((button, index) => {
        expect(button.text()).toContain(`${expectedGoals[index]} Stunden`)
      })
    })

    it('should select and confirm goal', async () => {
      const wrapper = mount(GoalSelectionDialog, {
        props: { show: true }
      })

      // 18h Ziel auswählen
      const goal18Button = wrapper.find('[data-testid="goal-18"]')
      await goal18Button.trigger('click')
      
      // Bestätigen Button sollte aktiviert sein
      const confirmButton = wrapper.find('[data-testid="confirm-button"]')
      expect(confirmButton.attributes('disabled')).toBeFalsy()
      
      // Bestätigen
      await confirmButton.trigger('click')
      
      // Event sollte emittiert werden
      expect(wrapper.emitted('confirm')).toBeTruthy()
      expect(wrapper.emitted('confirm')[0]).toEqual([18])
    })

    it('should prevent confirmation without selection', () => {
      const wrapper = mount(GoalSelectionDialog, {
        props: { show: true }
      })

      const confirmButton = wrapper.find('[data-testid="confirm-button"]')
      expect(confirmButton.attributes('disabled')).toBeTruthy()
    })
  })

  describe('Color System Tests', () => {
    it('should use orange colors before goal', () => {
      const wrapper = mount(ProgressBar, {
        props: {
          hours: 14,
          minutes: 0,
          goalHours: 16
        }
      })

      expect(wrapper.find('[data-testid="border-class"]').classes()).toContain('border-orange-200')
      expect(wrapper.find('[data-testid="icon-bg-class"]').classes()).toContain('bg-orange-100')
      expect(wrapper.find('[data-testid="text-class"]').classes()).toContain('text-orange-900')
    })

    it('should use green/emerald colors after goal', () => {
      const wrapper = mount(ProgressBar, {
        props: {
          hours: 17,
          minutes: 0,
          goalHours: 16
        }
      })

      expect(wrapper.find('[data-testid="border-class"]').classes()).toContain('border-emerald-200')
      expect(wrapper.find('[data-testid="icon-bg-class"]').classes()).toContain('bg-emerald-100')
      expect(wrapper.find('[data-testid="text-class"]').classes()).toContain('text-emerald-900')
    })

    it('should show correct gradient colors', () => {
      // Test Orange Phase
      const wrapperOrange = mount(ProgressBar, {
        props: {
          hours: 8,
          minutes: 0,
          goalHours: 12
        }
      })
      
      const gradientOrange = wrapperOrange.find('[data-testid="progress-gradient"]')
      expect(gradientOrange.attributes('style')).toContain('rgba(251, 146, 60, 0.4)')
      
      // Test Green/Purple Phase
      const wrapperGreenPurple = mount(ProgressBar, {
        props: {
          hours: 14,
          minutes: 0,
          goalHours: 12
        }
      })
      
      const gradientGreenPurple = wrapperGreenPurple.find('[data-testid="progress-gradient"]')
      expect(gradientGreenPurple.attributes('style')).toContain('rgba(52, 211, 153, 0.4)')
      expect(gradientGreenPurple.attributes('style')).toContain('rgba(168, 85, 247, 0.4)')
    })
  })

  describe('Phase Name Tests', () => {
    it('should show correct phase names for different goals', () => {
      // Test verschiedene Phasen
      const testCases = [
        { hours: 2, goalHours: 16, expected: 'Anfangsphase' },
        { hours: 5, goalHours: 16, expected: 'Aufwärmphase' },
        { hours: 10, goalHours: 16, expected: 'Fettverbrennung' },
        { hours: 14, goalHours: 16, expected: 'Ketose' },
        { hours: 16, goalHours: 16, expected: '16h Ziel erreicht!' },
        { hours: 18, goalHours: 16, expected: 'Bonus-Zeit' },
        { hours: 12, goalHours: 12, expected: '12h Ziel erreicht!' },
        { hours: 15, goalHours: 12, expected: 'Bonus-Zeit' }
      ]

      testCases.forEach(({ hours, goalHours, expected }) => {
        const wrapper = mount(ProgressBar, {
          props: { hours, minutes: 0, goalHours }
        })
        
        expect(wrapper.find('[data-testid="phase-name"]').text()).toContain(expected)
      })
    })
  })

  describe('Edge Cases', () => {
    it('should handle missing goalHours prop', () => {
      const wrapper = mount(ProgressBar, {
        props: {
          hours: 17,
          minutes: 30
          // goalHours nicht gesetzt -> sollte 16 als Standard verwenden
        }
      })

      // Sollte 16h als Standard-Ziel verwenden
      expect(wrapper.find('[data-testid="effective-goal"]').text()).toContain('16')
    })

    it('should handle zero hours correctly', () => {
      const wrapper = mount(ProgressBar, {
        props: {
          hours: 0,
          minutes: 15,
          goalHours: 12
        }
      })

      expect(wrapper.find('[data-testid="progress-width"]').text()).toContain('2%') // 15min von 12h = 2.08%
      expect(wrapper.find('[data-testid="phase-name"]').text()).toContain('Anfangsphase')
    })

    it('should handle very high hours', () => {
      const wrapper = mount(ProgressBar, {
        props: {
          hours: 48,
          minutes: 0,
          goalHours: 24
        }
      })

      // 48h bei 24h Ziel -> erweiterte Skala 32h
      // 48h > 32h -> sollte 100% Progress zeigen
      expect(wrapper.find('[data-testid="progress-width"]').text()).toContain('100%')
    })
  })

  describe('Test Scenarios Integration', () => {
    it('should override props when test mode is active', () => {
      // Test-Modus aktivieren
      activateTestMode(17, 30, 16)
      
      const wrapper = mount(ProgressBar, {
        props: {
          hours: 5, // Wird überschrieben
          minutes: 0, // Wird überschrieben
          goalHours: 12 // Wird überschrieben
        }
      })

      // Sollte Test-Daten verwenden
      expect(wrapper.find('[data-testid="display-hours"]').text()).toContain('17')
      expect(wrapper.find('[data-testid="display-minutes"]').text()).toContain('30')
    })

    it('should use props when test mode is inactive', () => {
      deactivateTestMode()
      
      const wrapper = mount(ProgressBar, {
        props: {
          hours: 5,
          minutes: 15,
          goalHours: 12
        }
      })

      // Sollte echte Props verwenden
      expect(wrapper.find('[data-testid="display-hours"]').text()).toContain('5')
      expect(wrapper.find('[data-testid="display-minutes"]').text()).toContain('15')
    })
  })
})

describe('API Integration Tests', () => {
  // Mock für API-Calls
  const mockFetch = vi.fn()
  global.fetch = mockFetch

  beforeEach(() => {
    mockFetch.mockClear()
  })

  it('should send goalHours in start request', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 1, startAt: '2025-01-09T10:00:00' })
    })

    const { startFast } = await import('../src/api')
    await startFast(18)

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/start'),
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goalHours: 18 })
      })
    )
  })

  it('should handle start request without goal', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 1, startAt: '2025-01-09T10:00:00' })
    })

    const { startFast } = await import('../src/api')
    await startFast()

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/start'),
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: undefined
      })
    )
  })

  it('should handle status response with goalHours', async () => {
    const mockStatus = {
      active: true,
      hours: 15,
      minutes: 30,
      since: '2025-01-09T10:00:00',
      goalHours: 18
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockStatus
    })

    const { statusFast } = await import('../src/api')
    const result = await statusFast()

    expect(result).toEqual(mockStatus)
    expect(result.goalHours).toBe(18)
  })
})
