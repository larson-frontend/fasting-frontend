import { describe, it, expect } from 'vitest'
import StatusCard from '../../../src/components/StatusCard.vue'
import { mountWithI18n } from '../../utils/test-utils'

const mountCard = (status: Partial<{ active: boolean; hours: number; minutes: number; since?: string; goalHours?: number }>) =>
  mountWithI18n(StatusCard, { props: { status } })

describe('StatusCard', () => {
  it('renders inactive state and enables start, disables stop', () => {
    const wrapper = mountCard({ active: false })
    const buttons = wrapper.findAll('button')
    const start = buttons[0]
    const stop = buttons[1]
    expect(wrapper.text()).toContain('Nicht am Fasten')
    expect(start.attributes('disabled')).toBeUndefined()
    expect(stop.attributes('disabled')).toBeDefined()
  })

  it('renders active state with TimeBadge and disables start, enables stop', () => {
    const wrapper = mountCard({ active: true, hours: 3, minutes: 30, since: new Date().toISOString(), goalHours: 16 })
    const buttons = wrapper.findAll('button')
    const start = buttons[0]
    const stop = buttons[1]
    expect(wrapper.text()).toContain('Aktives Fasten')
    expect(wrapper.text()).toMatch(/3h 30m/)
    expect(start.attributes('disabled')).toBeDefined()
    expect(stop.attributes('disabled')).toBeUndefined()
  })

  it('emits start/stop on button click', async () => {
    const inactive = mountCard({ active: false })
    await inactive.findAll('button')[0].trigger('click')
    expect(inactive.emitted('start')).toBeTruthy()

    const active = mountCard({ active: true, hours: 1, minutes: 0 })
    await active.findAll('button')[1].trigger('click')
    expect(active.emitted('stop')).toBeTruthy()
  })

  it('passes goalHours to ProgressBar when active', () => {
    const wrapper = mountCard({ active: true, hours: 5, minutes: 0, goalHours: 12 })
    // Should render ProgressBar with max label of goal 12
    expect(wrapper.text()).toContain('von 12h')
  })

  it('shows since timestamp when provided', () => {
    const since = new Date('2025-01-01T12:00:00Z').toISOString()
    const wrapper = mountCard({ active: true, hours: 1, minutes: 0, since })
    expect(wrapper.text()).toContain('seit')
  })
})
