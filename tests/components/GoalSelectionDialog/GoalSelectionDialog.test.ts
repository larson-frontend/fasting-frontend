import { describe, it, expect } from 'vitest'
import GoalSelectionDialog from '../../../src/components/GoalSelectionDialog.vue'
import { mountWithI18n } from '../../utils/test-utils'

const mountDialog = (props?: Partial<{ show: boolean }>) =>
  mountWithI18n(GoalSelectionDialog, { props: { show: true, ...(props || {}) } })

describe('GoalSelectionDialog', () => {
  it('renders options and confirm disabled by default', () => {
    const wrapper = mountDialog()
    const options = wrapper.findAll('[data-testid="goal-option"]')
    expect(options.length).toBeGreaterThan(0)
    const confirmBtn = wrapper.find('[data-testid="confirm-goal-button"]')
    expect(confirmBtn.attributes('disabled')).toBeDefined()
  })

  it('selecting an option enables confirm', async () => {
    const wrapper = mountDialog()
    const first = wrapper.findAll('[data-testid="goal-option"]')[0]
    await first.trigger('click')
    const confirmBtn = wrapper.find('[data-testid="confirm-goal-button"]')
    expect(confirmBtn.attributes('disabled')).toBeUndefined()
  })

  it('emits confirm with selected goal', async () => {
    const wrapper = mountDialog()
    const option = wrapper.findAll('[data-testid="goal-option"]')[2] // e.g. 16h
    await option.trigger('click')
    const confirmBtn = wrapper.find('[data-testid="confirm-goal-button"]')
    await confirmBtn.trigger('click')
    const emits = wrapper.emitted('confirm')
    expect(emits).toBeTruthy()
    const [[goal]] = emits as any
    expect(typeof goal).toBe('number')
    expect(goal).toBeGreaterThanOrEqual(10)
  })

  it('emits cancel and resets selection state', async () => {
    const wrapper = mountDialog()
    // select first option
    await wrapper.findAll('[data-testid="goal-option"]')[0].trigger('click')
    const confirmBtn = wrapper.find('[data-testid="confirm-goal-button"]')
    expect(confirmBtn.attributes('disabled')).toBeUndefined()
    // cancel
    const cancelBtn = wrapper.findAll('button').find(b => b.text().includes('Abbrechen'))!
    await cancelBtn.trigger('click')
    expect(wrapper.emitted('cancel')).toBeTruthy()
    // selection should be reset -> confirm disabled again
    expect(wrapper.find('[data-testid="confirm-goal-button"]').attributes('disabled')).toBeDefined()
  })

  it('is hidden when show=false', () => {
    const wrapper = mountDialog({ show: false })
    expect(wrapper.text()).toBe('')
  })
})
