# Test Suite für Fasting Tracker Goal System

Umfassendes Test-System für das neue benutzerdefinierte Ziel-Feature.

## 🧪 Test-Arten

### 1. **Manual Tests** (Browser Console)
**Datei:** `tests/manual-tests.js`

**Verwendung:**
```javascript
// 1. Hauptapp öffnen: http://localhost:5173
// 2. Browser DevTools öffnen (F12)
// 3. Tests ausführen:

window.fastingTests.help()           // Alle verfügbaren Befehle
window.fastingTests.runAllTests()    // Vollständige Test-Suite (1 Min)

// Quick Tests:
window.fastingTests.goal10()         // 11h bei 10h Ziel
window.fastingTests.goal12()         // 13.5h bei 12h Ziel  
window.fastingTests.extended()       // 17.5h bei 16h Ziel

// Custom Tests:
window.fastingTests.activate(19, 30, 18)  // 19h 30m bei 18h Ziel
window.fastingTests.off()            // Zurück zu Live-Daten
```

### 2. **Visual Tests** (Test-Seite)
**Datei:** `tests/visual-tests.html`

**Verwendung:**
1. Dev-Server starten: `npm run dev`
2. Test-Seite öffnen: `http://localhost:5173/tests/visual-tests.html`
3. Test-Buttons klicken für automatische Test-Durchläufe

**Features:**
- ✅ Visueller Test-Runner
- ✅ Erwartete Ergebnisse angezeigt  
- ✅ Test-Protokoll mit Zeitstempel
- ✅ Copy-Paste Console-Befehle

### 3. **Unit Tests** (Pure JavaScript)
**Datei:** `tests/unit-tests.js`

**Browser:**
```javascript
// In Browser Console nach Laden der Datei:
window.runGoalSystemUnitTests()
```

**Node.js:**
```bash
node tests/unit-tests.js
```

## 📋 Test-Szenarien

### Goal System Tests
| Test | Zeit | Ziel | Erwartung |
|------|------|------|-----------|
| Vor Ziel | 8h 30m | 12h | Orange, ~71% Progress |
| Ziel überschritten | 13h | 12h | Grün/Violett, Trennlinie bei 12h |
| Hohe Zeit | 19h 15m | 18h | Violett-Bereich, ~69% Trennlinie |
| Kleines Ziel | 11h 30m | 10h | 18h Skala, ~56% Trennlinie |

### Color System Tests
| Szenario | Erwartete Farben |
|----------|-----------------|
| Vor Ziel | Orange (border-orange-200, bg-orange-100, text-orange-900) |
| Ziel erreicht | Grün (border-emerald-200, bg-emerald-100, text-emerald-900) |
| Nach Ziel | Grün bis Ziel, dann Violett ohne Verlauf |

### Phase Tests
| Zeit | Ziel | Erwartete Phase |
|------|------|----------------|
| 2h | 16h | Anfangsphase |
| 5h | 16h | Aufwärmphase |
| 10h | 16h | Fettverbrennung |
| 14h | 16h | Ketose |
| 16h | 16h | 16h Ziel erreicht! |
| 18h | 16h | Bonus-Zeit |
| 12h | 12h | 12h Ziel erreicht! |

### Edge Cases
| Test | Erwartung |
|------|-----------|
| 0h 0m | Minimaler Progress, keine Fehler |
| 48h bei 24h Ziel | Max 100% Progress |
| Fehlende goalHours | Standard 16h verwenden |
| Exakt Ziel | "Xh Ziel erreicht!" Phase |

## 🎯 Spezifische Tests

### 1. **Progress Berechnung**
```javascript
// Test: 8h 30m bei 12h Ziel
// Erwartung: (8.5 / 12) * 100 = 70.83% ≈ 71%
window.fastingTests.activate(8, 30, 12)
```

### 2. **Skala-Umstellung**  
```javascript
// Test: 13h bei 12h Ziel
// Erwartung: Umstellung auf 20h Skala (12+8)
// Progress: (13 / 20) * 100 = 65%
window.fastingTests.activate(13, 0, 12)
```

### 3. **Trennlinie Position**
```javascript
// Test: 19h bei 18h Ziel  
// Erwartung: Linie bei (18 / 26) * 100 = 69.23%
window.fastingTests.activate(19, 0, 18)
```

### 4. **Verschiedene Ziele**
```javascript
// 10h Ziel Tests
window.fastingTests.activate(11, 0, 10)  // -> 18h Skala
window.fastingTests.activate(9, 30, 10)  // -> noch 10h Skala

// 24h Ziel Tests  
window.fastingTests.activate(25, 0, 24)  // -> 32h Skala
window.fastingTests.activate(23, 0, 24)  // -> noch 24h Skala
```

## 🔧 Development Tests

### Backend Integration Vorbereitung:
```javascript
// Teste API-Kompatibilität (wenn Backend ready):
// POST /api/fast/start mit {"goalHours": 12}
// GET /api/fast/status sollte goalHours enthalten
```

### Component Integration:
```javascript
// GoalSelectionDialog Test:
// 1. Start-Button klicken
// 2. Ziel auswählen (z.B. 18h)  
// 3. Bestätigen
// 4. ProgressBar sollte goalHours=18 erhalten
```

## 📊 Test-Checkliste

### ✅ Manual Tests
- [ ] Alle Quick Tests durchgeführt
- [ ] Custom Tests mit verschiedenen Zielen
- [ ] Farb-Übergänge visuell validiert
- [ ] Trennlinien-Position korrekt
- [ ] Phase-Namen stimmen überein

### ✅ Unit Tests  
- [ ] Progress-Berechnung mathematisch korrekt
- [ ] Phase-Logik für alle Ziele
- [ ] Max-Hours Berechnung
- [ ] Edge Cases abgedeckt
- [ ] Alle Tests bestehen (0 failed)

### ✅ Visual Tests
- [ ] Test-Seite lädt korrekt
- [ ] Alle Test-Buttons funktionieren  
- [ ] Erwartete Ergebnisse werden angezeigt
- [ ] Console-Befehle funktionieren

### ✅ Integration Tests
- [ ] GoalSelectionDialog → ProgressBar
- [ ] TestPanel Quick-Tests
- [ ] API-Schnittstelle vorbereitet
- [ ] TypeScript Interfaces aktualisiert

## 🚀 Schnellstart

1. **Sofort testen:**
   ```bash
   npm run dev
   # Browser: http://localhost:5173
   # Console: window.fastingTests.runAllTests()
   ```

2. **Visual Tests:**
   ```bash
   # Browser: http://localhost:5173/tests/visual-tests.html
   ```

3. **Unit Tests:**
   ```bash
   node tests/unit-tests.js
   ```

## 💡 Tipps

- **Performance:** Tests laufen automatisch mit Delays zwischen Szenarien
- **Debug:** Jeder Test zeigt erwartete vs. tatsächliche Werte in Console
- **Wiederholung:** Alle Tests sind wiederholbar und deterministisch
- **Isolation:** Tests beeinflussen sich nicht gegenseitig

---

**Alle Tests erfolgreich = Goal System ready für Production! 🎉**
