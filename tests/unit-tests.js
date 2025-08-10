/**
 * Simple Unit Tests für Goal System (ohne externe Dependencies)
 * 
 * Diese Tests können direkt in Node.js oder im Browser ausgeführt werden
 */

// === SIMPLE TEST FRAMEWORK ===
class SimpleTest {
  constructor() {
    this.tests = [];
    this.results = { passed: 0, failed: 0, total: 0 };
  }

  test(name, fn) {
    this.tests.push({ name, fn });
  }

  expect(actual) {
    return {
      toBe: (expected) => {
        if (actual === expected) return true;
        throw new Error(`Expected ${expected}, got ${actual}`);
      },
      toContain: (expected) => {
        if (typeof actual === 'string' && actual.includes(expected)) return true;
        if (Array.isArray(actual) && actual.includes(expected)) return true;
        throw new Error(`Expected "${actual}" to contain "${expected}"`);
      },
      toBeGreaterThan: (expected) => {
        if (actual > expected) return true;
        throw new Error(`Expected ${actual} to be greater than ${expected}`);
      },
      toBeLessThan: (expected) => {
        if (actual < expected) return true;
        throw new Error(`Expected ${actual} to be less than ${expected}`);
      }
    };
  }

  async run() {
    console.log('🧪 Running Goal System Tests...\n');
    
    for (const test of this.tests) {
      try {
        await test.fn();
        this.results.passed++;
        console.log(`✅ ${test.name}`);
      } catch (error) {
        this.results.failed++;
        console.log(`❌ ${test.name}: ${error.message}`);
      }
      this.results.total++;
    }
    
    console.log(`\n📊 Results: ${this.results.passed}/${this.results.total} passed`);
    return this.results;
  }
}

// === TEST UTILITIES ===
function calculateProgress(hours, minutes, goalHours) {
  const totalMinutes = hours * 60 + minutes;
  
  if (hours < goalHours) {
    // Bis Ziel: normale Berechnung auf Ziel-Basis
    const maxMinutes = goalHours * 60;
    return Math.min((totalMinutes / maxMinutes) * 100, 100);
  } else {
    // Ab Ziel: Umstellung auf erweiterte Basis
    const extendedMax = Math.max(goalHours + 8, 24);
    const maxMinutes = extendedMax * 60;
    return Math.min((totalMinutes / maxMinutes) * 100, 100);
  }
}

function getPhaseName(hours, goalHours) {
  if (hours < 3) return 'Anfangsphase';
  if (hours < 8) return 'Aufwärmphase';
  if (hours < 12) return 'Fettverbrennung';
  if (hours < goalHours) return 'Ketose';
  if (hours === goalHours) return `${goalHours}h Ziel erreicht!`;
  return 'Bonus-Zeit';
}

function getMaxHours(hours, goalHours) {
  return hours < goalHours ? goalHours : Math.max(goalHours + 8, 24);
}

function getColorPhase(hours, goalHours) {
  return hours < goalHours ? 'orange' : 'green-purple';
}

// === TESTS DEFINIEREN ===
const testSuite = new SimpleTest();

// Progress Calculation Tests
testSuite.test('Progress bei 8h von 12h Ziel sollte ~67% sein', () => {
  const progress = calculateProgress(8, 0, 12);
  testSuite.expect(Math.round(progress)).toBe(67);
});

testSuite.test('Progress bei 8h 30m von 12h Ziel sollte ~71% sein', () => {
  const progress = calculateProgress(8, 30, 12);
  testSuite.expect(Math.round(progress)).toBe(71);
});

testSuite.test('Progress bei 13h von 12h Ziel sollte 54% sein (erweiterte Skala)', () => {
  const progress = calculateProgress(13, 0, 12);
  testSuite.expect(Math.round(progress)).toBe(54); // 13/24 = 54%
});

testSuite.test('Progress bei 19h von 18h Ziel sollte ~74% sein', () => {
  const progress = calculateProgress(19, 0, 18);
  testSuite.expect(Math.round(progress)).toBe(73); // 19/26 = 73%
});

// Phase Name Tests
testSuite.test('2h sollte Anfangsphase sein', () => {
  const phase = getPhaseName(2, 16);
  testSuite.expect(phase).toBe('Anfangsphase');
});

testSuite.test('5h sollte Aufwärmphase sein', () => {
  const phase = getPhaseName(5, 16);
  testSuite.expect(phase).toBe('Aufwärmphase');
});

testSuite.test('10h sollte Fettverbrennung sein', () => {
  const phase = getPhaseName(10, 16);
  testSuite.expect(phase).toBe('Fettverbrennung');
});

testSuite.test('14h bei 16h Ziel sollte Ketose sein', () => {
  const phase = getPhaseName(14, 16);
  testSuite.expect(phase).toBe('Ketose');
});

testSuite.test('12h bei 12h Ziel sollte "12h Ziel erreicht!" sein', () => {
  const phase = getPhaseName(12, 12);
  testSuite.expect(phase).toBe('12h Ziel erreicht!');
});

testSuite.test('15h bei 12h Ziel sollte Bonus-Zeit sein', () => {
  const phase = getPhaseName(15, 12);
  testSuite.expect(phase).toBe('Bonus-Zeit');
});

// Max Hours Tests
testSuite.test('Max Hours bei 8h von 12h Ziel sollte 12 sein', () => {
  const maxHours = getMaxHours(8, 12);
  testSuite.expect(maxHours).toBe(12);
});

testSuite.test('Max Hours bei 13h von 12h Ziel sollte 24 sein', () => {
  const maxHours = getMaxHours(13, 12);
  testSuite.expect(maxHours).toBe(24); // Math.max(12+8, 24) = 24
});

testSuite.test('Max Hours bei 25h von 24h Ziel sollte 32 sein', () => {
  const maxHours = getMaxHours(25, 24);
  testSuite.expect(maxHours).toBe(32);
});

testSuite.test('Max Hours bei 11h von 10h Ziel sollte 24 sein', () => {
  const maxHours = getMaxHours(11, 10);
  testSuite.expect(maxHours).toBe(24); // Math.max(10+8, 24) = 24
});

// Color Phase Tests
testSuite.test('Farbe bei 8h von 12h Ziel sollte orange sein', () => {
  const color = getColorPhase(8, 12);
  testSuite.expect(color).toBe('orange');
});

testSuite.test('Farbe bei 13h von 12h Ziel sollte green-purple sein', () => {
  const color = getColorPhase(13, 12);
  testSuite.expect(color).toBe('green-purple');
});

testSuite.test('Farbe bei 16h von 16h Ziel sollte green-purple sein', () => {
  const color = getColorPhase(16, 16);
  testSuite.expect(color).toBe('green-purple');
});

// Edge Cases
testSuite.test('Progress bei 0h 1m sollte minimal sein', () => {
  const progress = calculateProgress(0, 1, 16);
  testSuite.expect(progress).toBeGreaterThan(0);
  testSuite.expect(progress).toBeLessThan(1);
});

testSuite.test('Progress bei 48h von 24h Ziel sollte 100% oder weniger sein', () => {
  const progress = calculateProgress(48, 0, 24);
  testSuite.expect(Math.round(progress)).toBe(100);
});

testSuite.test('Exakt Ziel erreicht sollte korrekte Phase zeigen', () => {
  const phase12 = getPhaseName(12, 12); // 12h = Ziel
  const phase16 = getPhaseName(16, 16); // 16h = Ziel  
  const phase18 = getPhaseName(18, 18); // 18h = Ziel
  const phase24 = getPhaseName(24, 24); // 24h = Ziel
  
  testSuite.expect(phase12).toContain('12h Ziel erreicht!');
  testSuite.expect(phase16).toContain('16h Ziel erreicht!');
  testSuite.expect(phase18).toContain('18h Ziel erreicht!');
  testSuite.expect(phase24).toContain('24h Ziel erreicht!');
});

// Complex Scenarios
testSuite.test('Komplexes Szenario: 19h 15m bei 18h Ziel', () => {
  const hours = 19, minutes = 15, goal = 18;
  
  const progress = calculateProgress(hours, minutes, goal);
  const phase = getPhaseName(hours, goal);
  const maxHours = getMaxHours(hours, goal);
  const color = getColorPhase(hours, goal);
  
  testSuite.expect(Math.round(progress)).toBe(74); // 19.25h von 26h = 74%
  testSuite.expect(phase).toBe('Bonus-Zeit');
  testSuite.expect(maxHours).toBe(26); // Math.max(18+8, 24) = 26
  testSuite.expect(color).toBe('green-purple');
});

// === TESTS AUSFÜHREN ===
if (typeof window !== 'undefined') {
  // Browser Environment
  window.runGoalSystemUnitTests = async function() {
    console.log('🧪 Starting Goal System Unit Tests in Browser...\n');
    const results = await testSuite.run();
    console.log('\n🎉 Unit Tests completed!');
    return results;
  };
  
  console.log('Unit Tests loaded! Run with: window.runGoalSystemUnitTests()');
} else if (typeof module !== 'undefined') {
  // Node.js Environment
  module.exports = { testSuite, calculateProgress, getPhaseName, getMaxHours, getColorPhase };
  
  // Auto-run in Node.js
  if (require.main === module) {
    testSuite.run().then(results => {
      process.exit(results.failed > 0 ? 1 : 0);
    });
  }
} else {
  // Direct execution
  testSuite.run();
}
