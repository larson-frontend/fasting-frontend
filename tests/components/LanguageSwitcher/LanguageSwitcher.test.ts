import { describe, it, expect } from 'vitest'
import LanguageSwitcher from '../../../src/components/LanguageSwitcher.vue'
import { mountWithI18n } from '../../utils/test-utils'

const findToggle = (wrapper:any) => wrapper.find('button')

describe('LanguageSwitcher', () => {
  it('opens and closes dropdown, changes language', async () => {
    const wrapper = mountWithI18n(LanguageSwitcher)

    // Open
    await findToggle(wrapper).trigger('click')
    expect(wrapper.findAll('div').some(d => /absolute top-full/.test(d.attributes('class') || ''))).toBe(true)

    // Click English option
    const options = wrapper.findAll('button')
    const en = options.find(b => b.text().includes('English'))
    if (!en) throw new Error('English option not found')
    await en.trigger('click')

    // Should close dropdown
    expect(wrapper.findAll('div').some(d => /absolute top-full/.test(d.attributes('class') || '')).valueOf()).toBe(false)
  })
})
