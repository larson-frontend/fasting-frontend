# Error Scenario Testing Guide

Dieses Dokument beschreibt, wie verschiedene Error-Szenarien getestet werden können.

## 🧪 Automatische Tests (Vitest)

```bash
npm run test tests/error-scenarios.test.ts
```

**Abgedeckte Szenarien:**
- ✅ Error-Klassifizierung (HTTP 500, 404, Timeout, Network, Unknown)
- ✅ Online/Offline-Erkennung
- ✅ ErrorPage Component-Funktionalität
- ✅ Error-Message-Generierung

## 🖱️ Manuelle Tests (Browser Console)

### Setup
1. Öffne die App im Browser
2. Öffne Developer Tools (F12)
3. Gehe zum Console-Tab
4. Verfügbare Tests: `errorTests.help()`

### Test-Kommandos

#### 1. **Network Error Tests**
```javascript
// Netzwerk-Fehler simulieren
errorTests.simulateNetworkError()
// → Jetzt TestPanel verwenden oder App-Buttons klicken

// Timeout simulieren  
errorTests.simulateTimeout(5000)
// → 5 Sekunden Timeout

// CORS-Fehler simulieren
errorTests.simulateCORSError()

// Offline-Modus simulieren
errorTests.simulateOffline()
```

#### 2. **API Error Tests**
```javascript
// Server Error 500
errorTests.simulateServerError(500)

// Not Found 404
errorTests.simulateServerError(404)

// Defekte JSON Response
errorTests.simulateMalformedJSON()
```

#### 3. **Environment-spezifische Tests**
```javascript
// Development Fallback testen
errorTests.testDevelopmentFallback()
// → Erwarte: Toast + Mock-Daten

// Production Error Page testen
errorTests.triggerProductionError()
// → Erwarte: Error-Seite (nur in Production)
```

#### 4. **Reset & Cleanup**
```javascript
// Fetch zurücksetzen
errorTests.resetFetch()

// Online-Modus wiederherstellen
errorTests.simulateOnline()

// Alles zurücksetzen
errorTests.resetAll()
```

#### 5. **Automatische Test-Suite**
```javascript
// Alle Tests nacheinander ausführen
errorTests.runTestSuite()
```

## 📱 TestPanel Integration

Das **TestPanel** (nur Development) ermöglicht:
- ✅ Verschiedene Fasten-Phasen simulieren
- ✅ API-Calls triggern
- ✅ Test-Modus ein/ausschalten
- ✅ Debug-Informationen anzeigen

### TestPanel + Error Tests Kombination:
1. Error simulieren: `errorTests.simulateNetworkError()`
2. TestPanel öffnen (Button unten rechts)
3. Test-Button klicken (z.B. "16h")
4. Beobachten: Toast-Benachrichtigung + Fallback

## 🔍 Was zu testen ist

### **Development Mode** (`npm run dev`)
```bash
# Expected Behavior:
✅ API Error → Toast-Benachrichtigung
✅ Automatischer Fallback zu Mock-Daten  
✅ App funktioniert weiter
✅ TestPanel verfügbar
✅ Debug-Info im Console
```

### **Production Mode** (`npm run build && npm run preview`)
```bash
# Expected Behavior:
✅ API Error → Vollständige Error-Seite
✅ Retry-Button funktioniert
✅ Refresh-Button funktioniert
✅ Kein TestPanel
✅ Keine Mock-Fallbacks
```

## 🎯 Wichtige Test-Szenarien

### **1. Klassifizierung testen**
```javascript
errorTests.simulateServerError(500)
// → Erwarte: "HTTP 500" in Error-Seite

errorTests.simulateTimeout()
// → Erwarte: "TIMEOUT" in Error-Seite

errorTests.simulateNetworkError()
// → Erwarte: "NETWORK_ERROR" in Error-Seite
```

### **2. Network-Zustand testen**
```javascript
errorTests.simulateOffline()
// → Erwarte: "Offline" in Error-Seite
// → Erwarte: "Keine Internetverbindung" Message

errorTests.simulateOnline()  
// → Erwarte: "Service nicht erreichbar" Message
```

### **3. Production vs Development**
```javascript
// Development:
errorTests.testDevelopmentFallback()
// → Toast + Weiterarbeit mit Mock-Daten

// Production (manuell wechseln):
errorTests.triggerProductionError()
// → Error-Seite + Retry-Möglichkeiten
```

### **4. Recovery testen**
```javascript
// 1. Error simulieren
errorTests.simulateNetworkError()

// 2. App verwenden (Error-Zustand)

// 3. Error beheben
errorTests.resetFetch()

// 4. Retry-Button klicken
// → Erwarte: Error-Seite verschwindet, App funktioniert
```

## 🚨 Troubleshooting

### Tests funktionieren nicht?
```javascript
// 1. Alles zurücksetzen
errorTests.resetAll()

// 2. Console-Fehler prüfen
// 3. Seite neu laden
// 4. Tests erneut versuchen
```

### TestPanel nicht sichtbar?
- ✅ Development Mode aktiv? (`npm run dev`)
- ✅ Button unten rechts vorhanden?
- ✅ Console-Fehler?

### Error-Seite erscheint nicht in Production?
- ✅ Production Build? (`npm run build`)
- ✅ Error wirklich simuliert?
- ✅ Browser-Cache geleert?

## 📊 Test-Checkliste

### Development Tests
- [ ] Network Error → Toast + Mock-Fallback
- [ ] Server Error → Toast + Mock-Fallback  
- [ ] Timeout → Toast + Mock-Fallback
- [ ] TestPanel funktioniert mit Error-Simulation
- [ ] API Recovery → Toast "API wieder erreichbar"

### Production Tests  
- [ ] Network Error → Error-Seite
- [ ] Server Error → Error-Seite
- [ ] Timeout → Error-Seite
- [ ] Error-Seite Retry-Button funktioniert
- [ ] Error-Seite Refresh-Button funktioniert
- [ ] Kein TestPanel sichtbar
- [ ] Kein Fallback zu Mock-Daten

### Error-Seite Details
- [ ] Korrekte Fehler-Klassifizierung
- [ ] Online/Offline-Erkennung
- [ ] Timestamp "Letzter Versuch"
- [ ] Help-Section mit Ursachen
- [ ] Support-Kontakt verfügbar
- [ ] Loading-State bei Retry

Das Error-Testing ist jetzt vollständig implementiert! 🚀
