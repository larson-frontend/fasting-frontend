import { describe, it, expect, vi } from 'vitest'
import ConfirmDialog from '../../../src/components/ConfirmDialog.vue'
import { mountWithI18n } from '../../utils/test-utils'

// Helper to mount with default props
const mountDialog = (props?: Partial<{ show: boolean; action: 'start'|'stop'|null }>) =>
  mountWithI18n(ConfirmDialog, {
    props: { show: true, action: 'start', ...(props || {}) }
  })

describe('ConfirmDialog', () => {
  it('renders start labels for action=start', () => {
    const wrapper = mountDialog({ action: 'start' })
    // Header and message
    expect(wrapper.text()).toContain('Bestätigen') // dialog.confirm
    expect(wrapper.text()).toContain('Fasten Starten') // fasting.actions.start
    // Buttons
    expect(wrapper.text()).toContain('Abbrechen')
  })

  it('renders stop labels for action=stop', () => {
    const wrapper = mountDialog({ action: 'stop' })
    // Title uses dialog.stop_fasting.title
    expect(wrapper.text()).toContain('Fasten Beenden?')
    // Message should contain a hint about ending/"beenden"
    expect(wrapper.text().toLowerCase()).toContain('beenden')
    // Confirm button label
    expect(wrapper.text()).toContain('Fasten Beenden')
  })

  it('emits confirm when confirm button is clicked', async () => {
    const wrapper = mountDialog({ action: 'start' })
    const btns = wrapper.findAll('button')
    // last button is confirm
    await btns[1].trigger('click')
    expect(wrapper.emitted('confirm')).toBeTruthy()
  })

  it('emits cancel when cancel button is clicked', async () => {
    const wrapper = mountDialog({ action: 'start' })
    const btns = wrapper.findAll('button')
    await btns[0].trigger('click')
    expect(wrapper.emitted('cancel')).toBeTruthy()
  })

  it('is hidden when show=false', () => {
    const wrapper = mountDialog({ show: false })
    // Vue renders a comment node for v-if=false, so assert no inner content exists
    expect(wrapper.find('h3').exists()).toBe(false)
    expect(wrapper.text()).toBe('')
  })

  // Future behavior (to be implemented): confirm disabled when action is null
  it.todo('disables confirm button when action is null')

  // Future behavior (to be implemented): Escape key should emit cancel
  it.todo('emits cancel when Escape is pressed')
})
