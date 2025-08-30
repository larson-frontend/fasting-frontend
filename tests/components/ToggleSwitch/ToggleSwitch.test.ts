import { describe, it, expect } from 'vitest'
import ToggleSwitch from '../../../src/components/ToggleSwitch.vue'
import { mountWithI18n } from '../../utils/test-utils'

describe('ToggleSwitch', () => {
  it('renders and toggles value on click', async () => {
    const wrapper = mountWithI18n(ToggleSwitch, { props: { value: false } })
    const btn = wrapper.find('button')
    expect(btn.attributes('aria-checked')).toBe('false')
    await btn.trigger('click')
    const emitted = wrapper.emitted('change')
    expect(emitted).toBeTruthy()
    expect(emitted?.[0]?.[0]).toBe(true)
  })

  it('does not emit when disabled', async () => {
    const wrapper = mountWithI18n(ToggleSwitch, { props: { value: true, disabled: true } })
    const btn = wrapper.find('button')
    await btn.trigger('click')
    expect(wrapper.emitted('change')).toBeFalsy()
  })
})
