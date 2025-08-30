import { describe, it, expect } from 'vitest'
import TimeBadge from '../../../src/components/TimeBadge.vue'
import { mountWithI18n } from '../../utils/test-utils'

describe('TimeBadge', () => {
  it('renders hours and minutes', () => {
    const wrapper = mountWithI18n(TimeBadge, { props: { hours: 5, minutes: 7 } })
    expect(wrapper.text()).toContain('5h 7m')
  })

  it('applies red theme for <10h', () => {
    const wrapper = mountWithI18n(TimeBadge, { props: { hours: 3, minutes: 0 } })
    expect(wrapper.classes().join(' ')).toContain('border-red-200')
  })

  it('applies orange theme for 10-15h', () => {
    const wrapper = mountWithI18n(TimeBadge, { props: { hours: 12, minutes: 0 } })
    expect(wrapper.classes().join(' ')).toContain('border-orange-200')
  })

  it('applies emerald theme for >=16h', () => {
    const wrapper = mountWithI18n(TimeBadge, { props: { hours: 16, minutes: 0 } })
    expect(wrapper.classes().join(' ')).toContain('border-emerald-200')
  })
})
