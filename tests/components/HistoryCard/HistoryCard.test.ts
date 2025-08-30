import { describe, it, expect, vi } from 'vitest'
import HistoryCard from '../../../src/components/HistoryCard.vue'
import { mountWithI18n } from '../../utils/test-utils'

function makeSession(id: number, startOffsetHours: number, durationHours?: number) {
  const start = new Date(Date.now() - startOffsetHours * 3600_000)
  const end = durationHours === undefined ? null : new Date(start.getTime() + durationHours * 3600_000)
  return { id, startAt: start.toISOString(), endAt: end ? end.toISOString() : null }
}

describe('HistoryCard', () => {
  it('renders title and refresh button', () => {
    const wrapper = mountWithI18n(HistoryCard, { props: { items: [], loading: false } })
    expect(wrapper.text()).toContain('Fasten-Historie')
    expect(wrapper.text()).toContain('Aktualisieren')
  })

  it('emits refresh when clicking refresh', async () => {
    const wrapper = mountWithI18n(HistoryCard, { props: { items: [], loading: false } })
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('refresh')).toBeTruthy()
  })

  it('shows empty state when no items', () => {
    const wrapper = mountWithI18n(HistoryCard, { props: { items: [], loading: false } })
    expect(wrapper.text()).toContain('Noch keine Fasten-Sessions')
  })

  it('renders active and completed sessions with correct labels and duration formatting', () => {
    const active = makeSession(1, 2) // 2h active
    const done = makeSession(2, 26, 2) // 2h completed

    const wrapper = mountWithI18n(HistoryCard, { props: { items: [active, done], loading: false } })

    // Duration formatting like "2h 0m"
    expect(wrapper.text()).toMatch(/2h\s+0m/)
    expect(wrapper.text()).toContain('aktiv')
    expect(wrapper.text()).toContain('beendet')

    // Started timestamps are rendered
    expect(wrapper.text()).toContain('Gestartet:')
  })

  it('disables refresh button and shows spinner when loading', () => {
    const wrapper = mountWithI18n(HistoryCard, { props: { items: [], loading: true } })
    const btn = wrapper.find('button')
    expect(btn.attributes('disabled')).toBeDefined()
    // InlineSpinner is conditionally rendered
    expect(wrapper.findComponent({ name: 'InlineSpinner' }).exists()).toBe(true)
  })
})
