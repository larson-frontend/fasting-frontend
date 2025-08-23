/**
 * Error Scenario Tests
 * Tests für verschiedene Fehlerfälle: Netzwerk, API, Klassifizierung
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, mountWithI18n } from './test-utils'
import ErrorPage from '../src/components/ErrorPage.vue'

describe('Error Classification Tests', () => {
  describe('1. Error Type Classification', () => {
    it('sollte HTTP 500 Server Error klassifizieren', async () => {
      const error = new Error('HTTP Error: 500 Internal Server Error')
      const wrapper = mountWithI18n(ErrorPage, {
        props: { error }
      })

      expect(wrapper.text()).toContain('Service nicht erreichbar')
      expect(wrapper.text()).toContain('HTTP 500')
    })

    it('sollte HTTP 404 Error klassifizieren', async () => {
      const error = new Error('HTTP Error: 404 Not Found')
      const wrapper = mountWithI18n(ErrorPage, {
        props: { error }
      })

      expect(wrapper.text()).toContain('HTTP 404')
    })

    it('sollte Timeout Error klassifizieren', () => {
      const wrapper = mountWithI18n(ErrorPage, {
        props: {
          error: new Error('Request timeout after 5000ms'),
          show: true
        }
      })

      expect(wrapper.text()).toContain('Verbindungsfehler')
    })

    it('sollte Network Error klassifizieren', async () => {
      const error = new Error('NetworkError: Failed to fetch')
      const wrapper = mountWithI18n(ErrorPage, {
        props: { error }
      })

      expect(wrapper.text()).toContain('NETWORK_ERROR')
      expect(wrapper.text()).toContain('Service ist momentan nicht erreichbar')
    })

    it('sollte Unknown Error klassifizieren', async () => {
      const error = new Error('Something went completely wrong')
      const wrapper = mountWithI18n(ErrorPage, {
        props: { error }
      })

      expect(wrapper.text()).toContain('UNKNOWN_ERROR')
      expect(wrapper.text()).toContain('unerwarteter Fehler')
    })
  })

  describe('2. Network Status Detection', () => {
    beforeEach(() => {
      // Reset navigator.onLine
      Object.defineProperty(navigator, 'onLine', {
        writable: true,
        value: true
      })
    })

    it('sollte Online-Zustand korrekt erkennen', async () => {
      Object.defineProperty(navigator, 'onLine', { value: true })
      
      const wrapper = mountWithI18n(ErrorPage, {
        props: { error: new Error('Network Error') }
      })

      expect(wrapper.text()).toContain('Service nicht erreichbar')
      expect(wrapper.text()).not.toContain('Offline')
    })

    it('sollte Offline-Zustand erkennen', async () => {
      Object.defineProperty(navigator, 'onLine', { value: false })
      
      const wrapper = mountWithI18n(ErrorPage, {
        props: { error: new Error('Network Error') }
      })

      expect(wrapper.text()).toContain('Offline')
      expect(wrapper.text()).toContain('Keine Internetverbindung verfügbar')
    })
  })

  describe('3. ErrorPage Component Functionality', () => {
    it('sollte Error-Details korrekt anzeigen', async () => {
      const error = new Error('Test Error Message')
      const wrapper = mountWithI18n(ErrorPage, {
        props: { error }
      })

      // Status anzeigen
      expect(wrapper.text()).toContain('Status:')
      
      // Letzter Versuch anzeigen
      expect(wrapper.text()).toContain('Letzter Versuch:')
      
      // Fehlercode anzeigen
      expect(wrapper.text()).toContain('Fehlercode:')
    })

    it('sollte Retry-Button anzeigen', async () => {
      const wrapper = mountWithI18n(ErrorPage, {
        props: { error: new Error('Test Error') }
      })

      const retryButton = wrapper.find('button:first-child')
      expect(retryButton.exists()).toBe(true)
      expect(retryButton.text()).toContain('Erneut versuchen')
    })

    it('sollte Refresh-Button anzeigen', async () => {
      const wrapper = mountWithI18n(ErrorPage, {
        props: { error: new Error('Test Error') }
      })

      const buttons = wrapper.findAll('button')
      const refreshButton = buttons.find(button => 
        button.text().includes('Seite neu laden')
      )
      
      expect(refreshButton?.exists()).toBe(true)
    })

    it('sollte Help-Section anzeigen', async () => {
      const wrapper = mountWithI18n(ErrorPage, {
        props: { error: new Error('Test Error') }
      })

      expect(wrapper.text()).toContain('Mögliche Ursachen:')
      expect(wrapper.text()).toContain('Keine Internetverbindung')
      expect(wrapper.text()).toContain('Server ist temporär nicht verfügbar')
      expect(wrapper.text()).toContain('Support kontaktieren')
    })
  })

  describe('4. Error Message Generation', () => {
    it('sollte korrekte Offline-Nachricht generieren', async () => {
      Object.defineProperty(navigator, 'onLine', { value: false })
      
      const wrapper = mountWithI18n(ErrorPage, {
        props: { error: new Error('Any Error') }
      })

      expect(wrapper.text()).toContain(
        'Keine Internetverbindung verfügbar. Bitte überprüfen Sie Ihre Netzwerkeinstellungen.'
      )
    })

    it('sollte korrekte API-Fehler-Nachricht generieren', async () => {
      Object.defineProperty(navigator, 'onLine', { value: true })
      
      const wrapper = mountWithI18n(ErrorPage, {
        props: { error: new Error('NetworkError: fetch failed') }
      })

      expect(wrapper.text()).toContain(
        'Der Fasting Tracker Service ist momentan nicht erreichbar'
      )
    })

    it('sollte generische Fehlernachricht für unbekannte Fehler generieren', async () => {
      Object.defineProperty(navigator, 'onLine', { value: true })
      
      const wrapper = mountWithI18n(ErrorPage, {
        props: { error: new Error('Unknown error type') }
      })

      expect(wrapper.text()).toContain(
        'Ein unerwarteter Fehler ist aufgetreten'
      )
    })
  })
})
