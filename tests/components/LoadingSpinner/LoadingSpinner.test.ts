import { describe, it, expect } from 'vitest'
import LoadingSpinner from '../../../src/components/LoadingSpinner.vue'
import { mountWithI18n } from '../../utils/test-utils'

describe('LoadingSpinner', () => {
  it('does not render when show=false', () => {
    const wrapper = mountWithI18n(LoadingSpinner, { props: { show: false } })
    expect(wrapper.find('.min-h-screen').exists()).toBe(false)
  })

  it('renders skeleton and emoji when show=true', () => {
    const wrapper = mountWithI18n(LoadingSpinner, { props: { show: true } })
    expect(wrapper.find('.animate-leaf-float').exists()).toBe(true)
    expect(wrapper.text()).toContain('🍃')
  })
})
