/**
 * Manual Error Testing
 * Praktische Tests für verschiedene Error-Szenarien
 * 
 * Diese Tests können manuell über das TestPanel oder Browser-Console ausgeführt werden
 */

// Browser Console Commands für Error Testing
if (typeof window !== 'undefined') {
  const errorTests = {
    
    /**
     * 1. Network Error Tests
     */
    simulateNetworkError: () => {
      console.log('🔌 Simuliere Netzwerk-Fehler...')
      
      // Mock fetch to fail
      const originalFetch = window.fetch
      window.fetch = () => Promise.reject(new Error('NetworkError: Failed to fetch'))
      
      console.log('✅ Network Error simuliert - versuche API-Call über TestPanel')
      console.log('🔄 Zum Zurücksetzen: errorTests.resetFetch()')
      
      return { originalFetch }
    },

    /**
     * 2. API Server Error Tests  
     */
    simulateServerError: (statusCode = 500) => {
      console.log(`🚨 Simuliere Server Error ${statusCode}...`)
      
      const originalFetch = window.fetch
      window.fetch = () => Promise.resolve({
        ok: false,
        status: statusCode,
        statusText: statusCode === 500 ? 'Internal Server Error' : 'Not Found',
        json: () => Promise.resolve({ error: `Server Error ${statusCode}` })
      } as Response)
      
      console.log(`✅ Server Error ${statusCode} simuliert`)
      return { originalFetch }
    },

    /**
     * 3. Timeout Error Tests
     */
    simulateTimeout: (delay = 10000) => {
      console.log(`⏱️ Simuliere Timeout nach ${delay}ms...`)
      
      const originalFetch = window.fetch
      window.fetch = () => new Promise((_, reject) => 
        setTimeout(() => reject(new Error(`Request timeout after ${delay}ms`)), delay)
      )
      
      console.log('✅ Timeout simuliert')
      return { originalFetch }
    },

    /**
     * 4. CORS Error Tests
     */
    simulateCORSError: () => {
      console.log('🚫 Simuliere CORS-Fehler...')
      
      const originalFetch = window.fetch
      window.fetch = () => Promise.reject(
        new Error('CORS policy: No Access-Control-Allow-Origin header is present on the requested resource')
      )
      
      console.log('✅ CORS Error simuliert')
      return { originalFetch }
    },

    /**
     * 5. Malformed JSON Response
     */
    simulateMalformedJSON: () => {
      console.log('📄 Simuliere defekte JSON-Response...')
      
      const originalFetch = window.fetch
      window.fetch = () => Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.reject(new Error('Unexpected token < in JSON at position 0'))
      } as Response)
      
      console.log('✅ Malformed JSON simuliert')
      return { originalFetch }
    },

    /**
     * 6. Offline Simulation
     */
    simulateOffline: () => {
      console.log('📱 Simuliere Offline-Modus...')
      
      // Override navigator.onLine
      Object.defineProperty(navigator, 'onLine', {
        writable: true,
        value: false
      })
      
      // Dispatch offline event
      window.dispatchEvent(new Event('offline'))
      
      console.log('✅ Offline-Modus simuliert')
      console.log('🔄 Zum Zurücksetzen: errorTests.simulateOnline()')
    },

    /**
     * 7. Online Simulation (Reset)
     */
    simulateOnline: () => {
      console.log('🌐 Simuliere Online-Modus...')
      
      Object.defineProperty(navigator, 'onLine', {
        writable: true,
        value: true
      })
      
      window.dispatchEvent(new Event('online'))
      
      console.log('✅ Online-Modus wiederhergestellt')
    },

    /**
     * Reset Fetch (für alle Network Mocks)
     */
    resetFetch: () => {
      console.log('🔄 Setze fetch zurück...')
      
      // Restore original fetch
      if ('originalFetch' in window) {
        window.fetch = (window as any).originalFetch
        delete (window as any).originalFetch
      }
      
      console.log('✅ Fetch zurückgesetzt')
    },

    /**
     * Production Error Page Test
     */
    triggerProductionError: () => {
      console.log('🚨 Teste Production Error Page...')
      console.log('⚠️  Achtung: Funktioniert nur in Production Build!')
      
      // Simulate error in production
      errorTests.simulateNetworkError()
      
      // Try to trigger API call
      console.log('🔄 Rufe API auf um Error-Seite zu triggern...')
      
      // You would call your API here
      console.log('📝 Manueller Schritt: Klicke auf Start/Stop Button in der App')
    },

    /**
     * Development Fallback Test
     */
    testDevelopmentFallback: () => {
      console.log('🔧 Teste Development Fallback...')
      console.log('⚠️  Funktioniert nur in Development Mode!')
      
      errorTests.simulateNetworkError()
      
      console.log('📝 Manueller Schritt: Verwende TestPanel für API-Calls')
      console.log('🔍 Erwarte: Toast-Benachrichtigung und Fallback zu Mock-Daten')
    },

    /**
     * Alle Tests zurücksetzen
     */
    resetAll: () => {
      console.log('🔄 Setze alle Tests zurück...')
      
      errorTests.resetFetch()
      errorTests.simulateOnline()
      
      console.log('✅ Alle Tests zurückgesetzt')
    },

    /**
     * Test-Suite ausführen
     */
    runTestSuite: async () => {
      console.log('🧪 Starte Error Test Suite...')
      console.log('')
      
      const tests = [
        { name: 'Network Error', fn: errorTests.simulateNetworkError },
        { name: 'Server Error 500', fn: () => errorTests.simulateServerError(500) },
        { name: 'Server Error 404', fn: () => errorTests.simulateServerError(404) },
        { name: 'Timeout', fn: () => errorTests.simulateTimeout(3000) },
        { name: 'CORS Error', fn: errorTests.simulateCORSError },
        { name: 'Malformed JSON', fn: errorTests.simulateMalformedJSON },
        { name: 'Offline', fn: errorTests.simulateOffline }
      ]
      
      for (const test of tests) {
        console.log(`\n🔍 Test: ${test.name}`)
        test.fn()
        console.log('📝 Teste jetzt die App-Funktionalität...')
        
        // Wait for manual testing
        await new Promise(resolve => {
          console.log('⏸️  Drücke Enter zum nächsten Test...')
          // In real scenario, you'd wait for user input
          setTimeout(resolve, 2000) // Auto-continue for demo
        })
        
        errorTests.resetAll()
      }
      
      console.log('\n✅ Test Suite abgeschlossen!')
    },

    /**
     * Help - Zeige alle verfügbaren Tests
     */
    help: () => {
      console.log('🧪 Verfügbare Error Tests:')
      console.log('')
      console.log('=== Netzwerk Tests ===')
      console.log('• errorTests.simulateNetworkError() - Netzwerk-Fehler')
      console.log('• errorTests.simulateTimeout() - Request Timeout')
      console.log('• errorTests.simulateCORSError() - CORS-Fehler')
      console.log('• errorTests.simulateOffline() - Offline-Modus')
      console.log('• errorTests.simulateOnline() - Online-Modus')
      console.log('')
      console.log('=== API Tests ===')
      console.log('• errorTests.simulateServerError(500) - Server Error')
      console.log('• errorTests.simulateServerError(404) - Not Found')
      console.log('• errorTests.simulateMalformedJSON() - Defekte JSON Response')
      console.log('')
      console.log('=== Spezial Tests ===')
      console.log('• errorTests.triggerProductionError() - Production Error Page')
      console.log('• errorTests.testDevelopmentFallback() - Development Fallback')
      console.log('• errorTests.runTestSuite() - Alle Tests automatisch')
      console.log('')
      console.log('=== Reset ===')
      console.log('• errorTests.resetFetch() - Fetch zurücksetzen')
      console.log('• errorTests.resetAll() - Alles zurücksetzen')
      console.log('')
      console.log('📝 Nach jedem Test: Verwende TestPanel oder App-Buttons zum Testen')
    }
  }

  // Expose to window
  ;(window as any).errorTests = errorTests

  // Log availability
  console.log('🧪 Error Tests verfügbar unter: window.errorTests')
  console.log('💡 Hilfe: errorTests.help()')
}

export {};
