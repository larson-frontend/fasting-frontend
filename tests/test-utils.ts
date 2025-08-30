import { mount } from '@vue/test-utils'
import { i18n } from '../src/i18n'

// Custom mount function with i18n support
export function mountWithI18n(component: any, options: any = {}) {
  // Set locale to German for consistent testing
  i18n.global.locale.value = 'de'
  
  return mount(component, {
    global: {
      plugins: [i18n],
      ...options.global
    },
    ...options
  })
}

// Export everything from @vue/test-utils for convenience
export * from '@vue/test-utils'
