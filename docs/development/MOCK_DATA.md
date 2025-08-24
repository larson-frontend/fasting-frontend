# Mock Data Configuration

Dieses Projekt unterstützt Mock-Daten zum lokalen Testen ohne Backend-Service.

## Mock-Modus aktivieren

1. **Automatisch (empfohlen)**: 
   - Die `.env.local` Datei ist bereits konfiguriert mit `VITE_USE_MOCK_DATA=true`
   
2. **Manuell**:
   ```bash
   # In .env.local oder .env
   VITE_USE_MOCK_DATA=true
   ```

## Mock-Modus deaktivieren

```bash
# In .env.local oder .env
VITE_USE_MOCK_DATA=false
VITE_API_BASE=http://localhost:8080/api/fast
```

## Was ist enthalten?

### Mock-Daten:
- **5 vorgefertigte Fasten-Sessions** in der Historie
- **Realistische Fasten-Dauern** (16h-18h)
- **Goal-System** vollständig funktional
- **Aktive Session** kann gestartet/gestoppt werden

### Mock-API Features:
- ✅ `startFast(goalHours)` - Neues Fasten starten
- ✅ `stopFast()` - Aktuelles Fasten beenden  
- ✅ `statusFast()` - Aktueller Status mit Live-Zeit
- ✅ `historyFast()` - Historie der abgeschlossenen Sessions
- ✅ `healthCheck()` - System-Gesundheit
- ✅ **300-500ms Delay** für realistische API-Simulation
- ✅ **Error Handling** wie echte API

### UI-Indikatoren:
- **🎭 Mock-Modus** wird unten in der App angezeigt
- **Live-Updates** der Fasten-Zeit im Mock-Modus
- **Alle Features** funktionieren identisch zum echten Backend

## Entwicklung

```bash
# Mock-Modus (Standard)
npm run dev

# Echter API-Modus
VITE_USE_MOCK_DATA=false npm run dev
```

Die Mock-Daten ermöglichen vollständiges Testing aller Features:
- Goal-Auswahl (10h, 12h, 16h, 18h, 20h, 24h)
- Progress-Visualisierung mit allen Phasen
- Historie mit realistischen Daten
- Start/Stop-Funktionalität
- Fehlerbehandlung
