# Test-System für Fasting Tracker

Dieses Test-System ermöglicht es, verschiedene Fasten-Szenarien zu simulieren, ohne echte Zeit warten zu müssen.

## 🚀 Schnellstart

### 1. Test Panel (Visuell)
- Entwicklungsserver starten: `npm run dev`
- Test-Icon unten rechts klicken
- Quick-Test-Buttons verwenden oder custom Zeit eingeben

### 2. Browser Console (Programmatisch)
```javascript
// 17 Stunden 30 Minuten Test aktivieren
window.fastingTests.extended()

// Custom Test
window.fastingTests.activate(17, 30)

// Test deaktivieren (zurück zu echten Daten)
window.fastingTests.off()
```

## 📋 Verfügbare Quick Tests

| Button | Zeit | Beschreibung | Erwartete Phase |
|--------|------|--------------|-----------------|
| Start | 0h 30m | Gerade gestartet | Aufwärmphase |
| 8h | 8h 15m | Fettverbrennung | Fettverbrennung |
| 12h | 12h 30m | Ketose erreicht | Ketose |
| 16h | 16h 0m | Autophagie erreicht | Autophagie |
| 17h | 17h 30m | Erweiterte Autophagie | Erweiterte Autophagie |
| 24h | 24h 0m | Vollständig | Erweiterte Autophagie |
| Live | - | Echte Daten | - |

## 🎯 17 Stunden Test (Hauptanwendungsfall)

### Visual Test Panel:
1. Test-Icon unten rechts klicken
2. "17h" Button klicken
3. ProgressBar zeigt 17h 30m in Violett-Zone

### Browser Console:
```javascript
// Sofort 17h Test aktivieren
window.fastingTests.extended()

// Oder manuell
window.fastingTests.activate(17, 30)
```

### Erwartetes Verhalten bei 17h:
- ✅ ProgressBar wechselt auf 24h Skala
- ✅ Farbe: Violett (purple) für 16h+ Bereich  
- ✅ Grüner Bereich bis 16h
- ✅ Violette Trennlinie bei 16h Mark
- ✅ Text zeigt "Erweiterte Autophagie"

## 🔧 Programmatische Nutzung

### In Vue Komponenten:
```typescript
import { activateTestMode, deactivateTestMode } from '../utils/testScenarios'

// Test aktivieren
activateTestMode(17, 30)

// Test deaktivieren
deactivateTestMode()
```

### Custom Test Szenarien:
```typescript
import { TEST_SCENARIOS, activateTestScenario } from '../utils/testScenarios'

// Vordefiniertes Szenario
activateTestScenario("17h 30min")

// Alle Szenarien anzeigen
listTestScenarios()
```

## 📊 Test-Szenarien Details

Alle verfügbaren Szenarien sind in `src/utils/testScenarios.ts` definiert:

- **0h 30m**: Start Phase
- **3h 0m**: Aufwärmphase erreicht
- **8h 15m**: Fettverbrennung aktiv
- **12h 30m**: Ketose Phase
- **16h 0m**: Autophagie erreicht (Grenze)
- **17h 30m**: Erweiterte Autophagie ⭐
- **20h 45m**: Tiefe Autophagie
- **24h 0m**: Vollständige Regeneration

## 🎨 Farbsystem Testing

### Orange Zone (0-16h):
- Border: `border-orange-200`
- Background: `bg-orange-100`
- Text: `text-orange-900`
- Progress: Helles Orange (40% opacity)

### Grün bei 16h erreicht:
- Border: `border-emerald-200` 
- Background: `bg-emerald-100`
- Progress: Helles Grün (40% opacity) bis 16h

### Violett Zone (16h+):
- Progress: Helles Violett (40% opacity) ab 16h
- Trennlinie bei 66.67% (16h von 24h)

## 🐛 Debugging

### Test Status prüfen:
```javascript
// Test aktiv?
window.fastingTests.current()

// Aktuelle Test-Daten
console.log(window.fastingTests.current())
```

### Konsolen-Output:
- `🧪 Test-Modus aktiviert: 17h 30m`
- `📊 Erwartete Phase: Erweiterte Autophagie`
- `🎨 Erwartete Farbe: purple`

## 📁 Dateien

- `src/utils/testScenarios.ts` - Test-Logic und Szenarien
- `src/components/TestPanel.vue` - Visuelles Test-Interface
- `src/components/ProgressBar.vue` - Integration der Test-Daten

## 💡 Entwicklung

Das Test-System ist automatisch nur im Development-Modus aktiv (`import.meta.env.DEV`). In Production wird es nicht geladen.

### Auto-Test beim Start:
```typescript
// In TestPanel.vue onMounted() uncomment:
quickTests.extended() // Auto-load 17h test
```
