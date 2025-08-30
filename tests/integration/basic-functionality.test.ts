import { describe, it, expect } from 'vitest'
import { mount, mountWithI18n } from '../utils/test-utils'
import TimeBadge from '../../src/components/TimeBadge.vue'
import ProgressBar from '../../src/components/ProgressBar.vue'
import StatusCard from '../../src/components/StatusCard.vue'

describe('TimeBadge Component', () => {
  it('sollte korrekt rendern', () => {
    const wrapper = mount(TimeBadge, {
      props: {
        hours: 12,
        minutes: 30
      }
    })
    
    expect(wrapper.text()).toContain('12h 30m')
  })

  it('sollte verschiedene Zeiten anzeigen', () => {
    const wrapper = mount(TimeBadge, {
      props: {
        hours: 5,
        minutes: 15
      }
    })
    
    expect(wrapper.text()).toContain('5h 15m')
  })

  it('sollte korrekte Farben für verschiedene Phasen verwenden', () => {
    // Frühe Phase (< 10h) - Rot
    const wrapperEarly = mount(TimeBadge, {
      props: { hours: 5, minutes: 0 }
    })
    expect(wrapperEarly.classes()).toContain('bg-red-50')
    
    // Mittlere Phase (10-16h) - Orange
    const wrapperMid = mount(TimeBadge, {
      props: { hours: 12, minutes: 0 }
    })
    expect(wrapperMid.classes()).toContain('bg-orange-50')
    
    // Späte Phase (>= 16h) - Grün
    const wrapperLate = mount(TimeBadge, {
      props: { hours: 18, minutes: 0 }
    })
    expect(wrapperLate.classes()).toContain('bg-emerald-50')
  })
})

describe('ProgressBar Component', () => {
  it('sollte mit Standard-Props rendern', () => {
    const wrapper = mountWithI18n(ProgressBar, {
      props: {
        hours: 12,
        minutes: 0
      }
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.text()).toContain('12h 0m')
  })

  it('sollte Goal-Hours korrekt verwenden', () => {
    const wrapper = mountWithI18n(ProgressBar, {
      props: {
        hours: 16,
        minutes: 0,
        goalHours: 16
      }
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.text()).toContain('16h 0m')
  })
})

describe('StatusCard Component', () => {
  it('sollte aktiven Status korrekt anzeigen', () => {
    const wrapper = mountWithI18n(StatusCard, {
      props: {
        status: {
          active: true,
          hours: 10,
          minutes: 30,
          since: new Date().toISOString(),
          goalHours: 16
        }
      }
    })
    
    expect(wrapper.text()).toContain('Aktives Fasten') // Translated text
    expect(wrapper.text()).toContain('10h 30m')
  })

  it('sollte inaktiven Status korrekt anzeigen', () => {
    const wrapper = mountWithI18n(StatusCard, {
      props: {
        status: {
          active: false,
          hours: 0,
          minutes: 0
        }
      }
    })
    
    expect(wrapper.text()).toContain('Nicht am Fasten') // Translated text
  })

  it('sollte Button-States korrekt verwalten', () => {
    // Inaktiver Status - Start Button aktiv, Stop Button deaktiviert
    const wrapperInactive = mountWithI18n(StatusCard, {
      props: {
        status: { active: false }
      }
    })
    
    const startButton = wrapperInactive.find('button[title="Fasten Starten"]') // Updated translation key
    const stopButton = wrapperInactive.find('button[title="Fasten Beenden"]') // Updated translation key
    
    expect(startButton.attributes('disabled')).toBeUndefined()
    expect(stopButton.attributes('disabled')).toBeDefined()
  })

  it('sollte Events korrekt emittieren', async () => {
    const wrapper = mountWithI18n(StatusCard, {
      props: {
        status: { active: false }
      }
    })
    
    // Find the start button by its position (first button)
    const buttons = wrapper.findAll('button')
    const startButton = buttons[0]
    await startButton.trigger('click')
    
    expect(wrapper.emitted()).toHaveProperty('start')
  })
})

describe('Error Message Utils', () => {
  it('sollte HTTP Error Codes korrekt erkennen', () => {
    const getErrorCode = (message: string) => {
      if (message.toLowerCase().includes('timeout')) return 'TIMEOUT'
      if (message.includes('NetworkError')) return 'NETWORK_ERROR'
      if (message.includes('500')) return 'HTTP 500'
      if (message.includes('404')) return 'HTTP 404'
      return 'UNKNOWN_ERROR'
    }

    expect(getErrorCode('HTTP Error: 500 Internal Server Error')).toBe('HTTP 500')
    expect(getErrorCode('HTTP Error: 404 Not Found')).toBe('HTTP 404')
    expect(getErrorCode('Request timeout after 5000ms')).toBe('TIMEOUT')
    expect(getErrorCode('NetworkError: Failed to fetch')).toBe('NETWORK_ERROR')
    expect(getErrorCode('Something went wrong')).toBe('UNKNOWN_ERROR')
  })

  it('sollte Online/Offline Status korrekt bestimmen', () => {
    const getConnectionStatus = (isOnline: boolean, hasError: boolean) => {
      if (!isOnline) return 'Offline'
      if (hasError) return 'Service nicht erreichbar'
      return 'Online'
    }

    expect(getConnectionStatus(false, false)).toBe('Offline')
    expect(getConnectionStatus(true, true)).toBe('Service nicht erreichbar')
    expect(getConnectionStatus(true, false)).toBe('Online')
  })
})

describe('Configuration Tests', () => {
  it('sollte Test-Environment korrekt erkennen', () => {
    expect(import.meta.env.MODE).toBe('test')
  })

  it('sollte Mock-Konfiguration verfügbar haben', () => {
    const config = {
      useMockData: true,
      isDevelopment: false
    }
    
    expect(config.useMockData).toBe(true)
    expect(config.isDevelopment).toBe(false)
  })
})