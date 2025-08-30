import { describe, it, expect, vi } from 'vitest'
import ErrorPage from '../../../src/components/ErrorPage.vue'
import { mountWithI18n } from '../../utils/test-utils'

const mountPage = (props?: Partial<{ error?: Error; retryCallback?: () => Promise<void> }>) =>
  mountWithI18n(ErrorPage, { props: { ...(props || {}) } })

describe('ErrorPage', () => {
  it('renders with undefined error and shows generic message', () => {
    const wrapper = mountPage()
    expect(wrapper.text()).toContain('Verbindungsfehler') // errors.connection_error
    // With online = true by default in setup, expect unexpected_error
    expect(wrapper.text()).toContain('Ein unerwarteter Fehler ist aufgetreten')
    // Buttons visible
    const buttons = wrapper.findAll('button')
    expect(buttons.length).toBe(2)
  })

  it('renders network error details and code when error mentions NetworkError', () => {
    const wrapper = mountPage({ error: new Error('NetworkError: failed to fetch') })
    expect(wrapper.text()).toContain('Service nicht erreichbar') // status badge text could vary with online/offline, assert code
    expect(wrapper.text()).toContain('NETWORK_ERROR')
  })

  it('emits retry when no retryCallback is provided', async () => {
    const wrapper = mountPage()
    const retryBtn = wrapper.findAll('button')[0]
    await retryBtn.trigger('click')
    expect(wrapper.emitted('retry')).toBeTruthy()
  })

  it('calls retryCallback and emits close on success', async () => {
    const cb = vi.fn(async () => Promise.resolve())
    const wrapper = mountPage({ retryCallback: cb })
    const retryBtn = wrapper.findAll('button')[0]
    await retryBtn.trigger('click')
    expect(cb).toHaveBeenCalledTimes(1)
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('does not emit close when retryCallback throws', async () => {
    const cb = vi.fn(async () => Promise.reject(new Error('boom')))
    const wrapper = mountPage({ retryCallback: cb })
    const retryBtn = wrapper.findAll('button')[0]
    await retryBtn.trigger('click')
    expect(cb).toHaveBeenCalledTimes(1)
    expect(wrapper.emitted('close')).toBeFalsy()
  })

  it('invokes window.location.reload on Refresh Page click', async () => {
    const reloadSpy = vi.spyOn(window.location, 'reload')
    const wrapper = mountPage()
    const refreshBtn = wrapper.findAll('button')[1]
    await refreshBtn.trigger('click')
    expect(reloadSpy).toHaveBeenCalled()
  })

  it('matches snapshot', () => {
    const wrapper = mountPage()
    expect(wrapper.html()).toMatchSnapshot()
  })
})
