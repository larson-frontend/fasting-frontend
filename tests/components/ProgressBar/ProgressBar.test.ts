import { describe, it, expect } from 'vitest'
import ProgressBar from '../../../src/components/ProgressBar.vue'
import { mountWithI18n } from '../../utils/test-utils'

const mountBar = (props: Partial<{ hours: number; minutes: number; goalHours?: number }>) =>
  mountWithI18n(ProgressBar, { props: { hours: 0, minutes: 0, ...props } })

describe('ProgressBar', () => {
  it('shows percent and "von 16h" before reaching goal', () => {
    const wrapper = mountBar({ hours: 8, minutes: 0, goalHours: 16 })
    const pct = wrapper.get('[data-testid="progress-percentage"]').text()
    const max = wrapper.get('[data-testid="progress-max"]').text()
    expect(pct).toBe('50%')
    expect(max).toContain('von 16h')
  })

  it('uses extended base after reaching goal (24h when goal=16)', () => {
    const wrapper = mountBar({ hours: 18, minutes: 0, goalHours: 16 })
    const pct = wrapper.get('[data-testid="progress-percentage"]').text()
    const max = wrapper.get('[data-testid="progress-max"]').text()
    expect(pct).toBe('75%') // 18/24
    expect(max).toContain('von 24h')
  })

  it('guards invalid values (no NaN): defaults to 0% and von 16h', () => {
    const wrapper = mountBar({ hours: Number.NaN, minutes: Number.NaN, goalHours: Number.NaN })
    const pct = wrapper.get('[data-testid="progress-percentage"]').text()
    const max = wrapper.get('[data-testid="progress-max"]').text()
    expect(pct).toBe('0%')
    expect(max).toContain('von 16h')
  })

  it('renders goal separation line only after reaching goal', () => {
    // Before goal -> no separation line
    const before = mountBar({ hours: 10, minutes: 0, goalHours: 16 })
    expect(before.find('[data-testid="goal-separation-line"]').exists()).toBe(false)
    // After goal -> separation line visible
    const after = mountBar({ hours: 17, minutes: 0, goalHours: 16 })
    expect(after.find('[data-testid="goal-separation-line"]').exists()).toBe(true)
  })

  it('shows correct phase labels by hours', () => {
    expect(mountBar({ hours: 2, minutes: 0, goalHours: 16 }).get('[data-testid="progress-phase"]').text())
      .toBe('Anfangsphase')
    expect(mountBar({ hours: 9, minutes: 0, goalHours: 16 }).get('[data-testid="progress-phase"]').text())
      .toBe('Fettverbrennung')
    expect(mountBar({ hours: 16, minutes: 0, goalHours: 16 }).get('[data-testid="progress-phase"]').text())
      .toBe('16h Ziel erreicht!')
  })
})
