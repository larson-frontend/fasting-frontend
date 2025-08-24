/**
 * Vitest Setup
 * Globale Test-Konfiguration und Mocks
 */

import { beforeEach, vi } from 'vitest'

// Global setup before each test
beforeEach(() => {
  // Reset all mocks
  vi.clearAllMocks()
  
  // Reset DOM
  document.body.innerHTML = ''
  
  // Reset navigator.onLine
  Object.defineProperty(navigator, 'onLine', {
    writable: true,
    value: true
  })

  // Mock window.location.reload
  Object.defineProperty(window, 'location', {
    value: {
      reload: vi.fn(),
      href: 'http://localhost:3000'
    },
    writable: true
  })

  // Mock console methods to avoid spam in tests
  vi.spyOn(console, 'log').mockImplementation(() => {})
  vi.spyOn(console, 'warn').mockImplementation(() => {})
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

// Global fetch mock
global.fetch = vi.fn()

// Mock import.meta.env
vi.stubGlobal('import.meta', {
  env: {
    DEV: false,
    PROD: true,
    VITE_API_BASE: 'http://localhost:8080/api/fast',
    VITE_USE_MOCK_DATA: 'false'
  }
})
