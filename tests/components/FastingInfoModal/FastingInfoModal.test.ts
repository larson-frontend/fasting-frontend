import { describe, it, expect } from 'vitest'
import FastingInfoModal from '../../../src/components/FastingInfoModal.vue'
import { mountWithI18n } from '../../utils/test-utils'

const baseStatus = { active: true, hours: 10, minutes: 0 }

const mountModal = (props?: Partial<{ show: boolean; status?: any }>) =>
  mountWithI18n(FastingInfoModal, { props: { show: true, status: baseStatus, ...(props || {}) } })

describe('FastingInfoModal', () => {
  it('renders when show=true and contains i18n titles', () => {
    const wrapper = mountModal()
    expect(wrapper.text()).toContain('Fasten-Phasen Info')
    expect(wrapper.text()).toContain('0-3 Stunden')
    expect(wrapper.text()).toContain('3-8 Stunden')
    expect(wrapper.text()).toContain('8-12 Stunden')
    expect(wrapper.text()).toContain('12-16 Stunden')
    expect(wrapper.text()).toContain('16+ Stunden')
  })

  it('is hidden when show=false', () => {
    const wrapper = mountModal({ show: false })
    expect(wrapper.find('h3').exists()).toBe(false)
    expect(wrapper.text()).toBe('')
  })

  it('emits close when close button clicked', async () => {
    const wrapper = mountModal()
    const closeBtn = wrapper.find('button')
    await closeBtn.trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('phase status labels respond to status (progress/completed/not reached)', async () => {
    // Active with 10h should complete phases 1 & 2 and progress in phase 3
    const wrapper = mountModal({ status: { active: true, hours: 10, minutes: 0 } })
    const text = wrapper.text()
  // Check a known phase description is present (phase 3)
  expect(text).toContain('Primäre Energiequelle wechselt zu Fett')
  // Completed indicator appears for early phases
  expect(text).toMatch(/✓ \(abgeschlossen\)/)
    // Progress appears for phase 3
    expect(text).toMatch(/\([0-9]{1,3}% erreicht\)/)
  })

  // Future behavior: clicking the backdrop should emit close
  it.todo('emits close when clicking the backdrop (outside modal)')
  // Future behavior: pressing Escape should emit close
  it.todo('emits close when Escape key is pressed')
})
