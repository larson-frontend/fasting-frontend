/**
 * Manual Test Suite für Fasting Tracker Goal System
 * 
 * Diese Tests können manuell im Browser ausgeführt werden
 * Verwende die Browser DevTools Console für die Ausführung
 */

// === BROWSER CONSOLE TESTS ===
// Kopiere diese Funktionen in die Browser Console um Tests auszuführen

window.fastingTests = window.fastingTests || {};

// Test Suite für Goal System
window.fastingTests.runGoalSystemTests = function() {
  console.log('🧪 Starting Goal System Tests...\n');
  
  // Test 1: 12h Ziel bei 8h Progress
  console.log('Test 1: 12h Ziel bei 8h Progress');
  window.fastingTests.activate(8, 30, 12);
  console.log('✓ Erwartung: Orange Farben, ~71% Progress, "Fettverbrennung" Phase');
  console.log('✓ Überprüfe: ProgressBar sollte orange sein\n');
  
  setTimeout(() => {
    // Test 2: 12h Ziel überschritten (13h)
    console.log('Test 2: 12h Ziel überschritten (13h)');
    window.fastingTests.activate(13, 0, 12);
    console.log('✓ Erwartung: Grün/Violett Farben, ~65% Progress, "Bonus-Zeit" Phase');
    console.log('✓ Überprüfe: Trennlinie bei 12h sichtbar\n');
  }, 2000);
  
  setTimeout(() => {
    // Test 3: 18h Ziel bei 19.25h
    console.log('Test 3: 18h Ziel bei 19.25h');
    window.fastingTests.activate(19, 15, 18);
    console.log('✓ Erwartung: Trennlinie bei ~69%, "Bonus-Zeit", Violett-Bereich\n');
  }, 4000);
  
  setTimeout(() => {
    // Test 4: 10h Ziel bei 11.5h
    console.log('Test 4: 10h Ziel bei 11.5h');
    window.fastingTests.activate(11, 30, 10);
    console.log('✓ Erwartung: Erweiterte Skala auf 18h (10+8), Trennlinie bei ~56%\n');
  }, 6000);
  
  setTimeout(() => {
    // Test 5: Zurück zu Live-Daten
    console.log('Test 5: Zurück zu Live-Daten');
    window.fastingTests.off();
    console.log('✓ Tests abgeschlossen - Live-Daten aktiv\n');
    console.log('🎉 Alle Goal System Tests durchgeführt!');
  }, 8000);
};

// Einzelne Test-Funktionen
window.fastingTests.testGoalOverride = function() {
  console.log('🎯 Testing Goal Override System...');
  
  const testCases = [
    { hours: 11, minutes: 0, goal: 10, expectedPhase: 'Bonus-Zeit', expectedScale: 18 },
    { hours: 13, minutes: 30, goal: 12, expectedPhase: 'Bonus-Zeit', expectedScale: 20 },
    { hours: 17, minutes: 0, goal: 16, expectedPhase: 'Bonus-Zeit', expectedScale: 24 },
    { hours: 19, minutes: 15, goal: 18, expectedPhase: 'Bonus-Zeit', expectedScale: 26 },
    { hours: 21, minutes: 0, goal: 20, expectedPhase: 'Bonus-Zeit', expectedScale: 28 },
    { hours: 25, minutes: 30, goal: 24, expectedPhase: 'Bonus-Zeit', expectedScale: 32 }
  ];
  
  testCases.forEach((test, index) => {
    setTimeout(() => {
      console.log(`\nTest ${index + 1}: ${test.hours}h ${test.minutes}m bei ${test.goal}h Ziel`);
      window.fastingTests.activate(test.hours, test.minutes, test.goal);
      console.log(`Erwartung: ${test.expectedPhase}, Skala: ${test.expectedScale}h`);
    }, index * 3000);
  });
  
  setTimeout(() => {
    window.fastingTests.off();
    console.log('\n✅ Goal Override Tests abgeschlossen!');
  }, testCases.length * 3000);
};

// Farb-System Tests
window.fastingTests.testColorSystem = function() {
  console.log('🎨 Testing Color System...');
  
  const colorTests = [
    { hours: 8, goal: 12, expectedColor: 'orange', description: 'Vor Ziel' },
    { hours: 12, goal: 12, expectedColor: 'green', description: 'Ziel erreicht' },
    { hours: 15, goal: 12, expectedColor: 'green/purple', description: 'Nach Ziel' },
    { hours: 14, goal: 16, expectedColor: 'orange', description: 'Vor 16h Ziel' },
    { hours: 18, goal: 16, expectedColor: 'green/purple', description: 'Nach 16h Ziel' }
  ];
  
  colorTests.forEach((test, index) => {
    setTimeout(() => {
      console.log(`\nFarb-Test ${index + 1}: ${test.hours}h bei ${test.goal}h Ziel`);
      window.fastingTests.activate(test.hours, 0, test.goal);
      console.log(`Erwartung: ${test.expectedColor} (${test.description})`);
      console.log('Überprüfe: Border, Icon-Hintergrund und Text-Farben');
    }, index * 2500);
  });
  
  setTimeout(() => {
    window.fastingTests.off();
    console.log('\n🎨 Color System Tests abgeschlossen!');
  }, colorTests.length * 2500);
};

// Performance Tests
window.fastingTests.testEdgeCases = function() {
  console.log('⚠️ Testing Edge Cases...');
  
  const edgeCases = [
    { hours: 0, minutes: 1, goal: 16, description: 'Minimale Zeit' },
    { hours: 0, minutes: 0, goal: 10, description: 'Null Zeit' },
    { hours: 48, minutes: 0, goal: 24, description: 'Extreme Zeit' },
    { hours: 25, minutes: 0, goal: 24, description: 'Leicht über Ziel' },
    { hours: 10, minutes: 0, goal: 10, description: 'Exakt Ziel erreicht' }
  ];
  
  edgeCases.forEach((test, index) => {
    setTimeout(() => {
      console.log(`\nEdge Case ${index + 1}: ${test.description}`);
      window.fastingTests.activate(test.hours, test.minutes, test.goal);
      console.log(`Test: ${test.hours}h ${test.minutes}m bei ${test.goal}h Ziel`);
      console.log('Überprüfe: Keine Fehler, korrekte Darstellung');
    }, index * 2000);
  });
  
  setTimeout(() => {
    window.fastingTests.off();
    console.log('\n⚠️ Edge Case Tests abgeschlossen!');
  }, edgeCases.length * 2000);
};

// Umfassender Test-Durchlauf
window.fastingTests.runAllTests = function() {
  console.log('🚀 Starting Complete Test Suite...\n');
  
  // Schritt 1: Goal System Tests
  this.runGoalSystemTests();
  
  // Schritt 2: Goal Override Tests (nach 10 Sekunden)
  setTimeout(() => {
    this.testGoalOverride();
  }, 10000);
  
  // Schritt 3: Color System Tests (nach weiteren 20 Sekunden)
  setTimeout(() => {
    this.testColorSystem();
  }, 30000);
  
  // Schritt 4: Edge Case Tests (nach weiteren 15 Sekunden)
  setTimeout(() => {
    this.testEdgeCases();
  }, 45000);
  
  // Abschluss (nach weiteren 12 Sekunden)
  setTimeout(() => {
    console.log('\n🎉 ALLE TESTS ABGESCHLOSSEN!');
    console.log('📊 Zusammenfassung der getesteten Features:');
    console.log('  ✓ Goal System Integration');
    console.log('  ✓ Progress Calculation');
    console.log('  ✓ Color System');
    console.log('  ✓ Phase Names');
    console.log('  ✓ Separation Lines');
    console.log('  ✓ Edge Cases');
    console.log('\n🔄 Für erneute Tests: window.fastingTests.runAllTests()');
  }, 57000);
};

// Dokumentation
window.fastingTests.help = function() {
  console.log('📚 Fasting Tests - Available Commands:');
  console.log('');
  console.log('🧪 Test Suites:');
  console.log('  window.fastingTests.runAllTests()        - Alle Tests (1 Minute)');
  console.log('  window.fastingTests.runGoalSystemTests() - Goal System Tests');
  console.log('  window.fastingTests.testGoalOverride()   - Goal Override Tests');
  console.log('  window.fastingTests.testColorSystem()    - Color System Tests');
  console.log('  window.fastingTests.testEdgeCases()      - Edge Case Tests');
  console.log('');
  console.log('🎯 Quick Tests:');
  console.log('  window.fastingTests.goal10()    - 11h bei 10h Ziel');
  console.log('  window.fastingTests.goal12()    - 13.5h bei 12h Ziel');
  console.log('  window.fastingTests.extended()  - 17.5h bei 16h Ziel');
  console.log('  window.fastingTests.off()       - Zurück zu Live-Daten');
  console.log('');
  console.log('⚙️ Custom Test:');
  console.log('  window.fastingTests.activate(hours, minutes, goalHours)');
  console.log('  Beispiel: window.fastingTests.activate(19, 30, 18)');
};

console.log('🧪 Manual Test Suite geladen!');
console.log('Verwende: window.fastingTests.help() für alle Befehle');
console.log('Schnellstart: window.fastingTests.runAllTests()');
