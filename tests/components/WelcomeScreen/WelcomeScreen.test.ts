import { describe, it, expect } from 'vitest'
import WelcomeScreen from '../../../src/components/WelcomeScreen.vue'
import { mountWithI18n } from '../../utils/test-utils'

describe('WelcomeScreen', () => {
  it('renders title and emits enter on click', async () => {
    const wrapper = mountWithI18n(WelcomeScreen)
    expect(wrapper.text()).toContain('Fasten Tracker')
    const clickable = wrapper.find('.cursor-pointer')
    await clickable.trigger('click')
    expect(wrapper.emitted('enter')).toBeTruthy()
  })
})
