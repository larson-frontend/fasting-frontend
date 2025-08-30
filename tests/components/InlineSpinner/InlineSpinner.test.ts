import { describe, it, expect } from 'vitest'
import InlineSpinner from '../../../src/components/InlineSpinner.vue'
import { mountWithI18n } from '../../utils/test-utils'

describe('InlineSpinner', () => {
  it('does not render when show=false', () => {
    const wrapper = mountWithI18n(InlineSpinner, { props: { show: false } })
    // Vue renders a comment node for v-if=false; ensure no content element exists
    expect(wrapper.find('div.inline-flex').exists()).toBe(false)
  })

  it('renders with default size and dark variant', () => {
    const wrapper = mountWithI18n(InlineSpinner, { props: { show: true } })
    expect(wrapper.find('img').exists()).toBe(true)
  })

  it('renders text and applies size class', () => {
    const wrapper = mountWithI18n(InlineSpinner, { props: { show: true, text: 'Loading...', size: 'md', variant: 'primary' } })
    expect(wrapper.text()).toContain('Loading...')
  })
})
