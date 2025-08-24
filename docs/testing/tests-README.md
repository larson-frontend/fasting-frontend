# 🧪 Test Documentation

This project has several types of tests organized by purpose and execution environment.

## 📁 Test Structure

```
tests/
├── components/           # Vue component tests (Vitest + Vue Test Utils)
├── api/                 # API service tests (Vitest)
├── integration/         # Integration workflow tests (Vitest)
├── utils/              # Shared test utilities, fixtures & mocks
├── manual/             # Browser console manual tests
├── standalone/         # Self-contained test frameworks
└── README.md           # This documentation
```

## 🚀 Running Tests

### Automated Tests (Vitest)
```bash
# Run all tests (automated + standalone)
npm run test:all

# Run all tests with CI reporting
npm run test:all:ci

# Run only automated tests
npm run test

# Run with coverage
npm run test:coverage

# Run only standalone tests
npm run test:standalone

# Run specific test file
npm run test UserSettings.test.ts

# Run tests in watch mode
npm run test:watch
```

### CI/CD Integration
All tests are automatically run in GitHub Actions:
- **Pull Requests**: `npm run test:all` (101 automated + 21 standalone tests)
- **Main CI**: `npm run test:all:ci` (with coverage and verbose reporting)
- **Validation**: `npm run validate` (type-check + all tests)

### Manual Browser Tests
```bash
# 1. Start the development server
npm run dev

# 2. Open browser console (F12)
# 3. Load manual tests:
```
```javascript
// In browser console:
// First load the test file by adding script tag or copying content
// Then run tests:
window.fastingTests.help()                    // Show all available tests
window.fastingTests.runAllTests()             // Run complete test suite
window.fastingTests.runGoalSystemTests()      // Run goal system tests only
window.fastingTests.testColorSystem()         // Test color calculations
window.fastingTests.testEdgeCases()           // Test edge cases
```

### Standalone Tests (No Dependencies)
```bash
# Run with Node.js
node tests/standalone/goal-system-tests.js

# Or copy into browser console for direct execution
```

## 📊 Test Categories

### 🎯 Component Tests (`tests/components/`)
- **UserSettings**: 30 tests in 5 categories (Structure, UI Controls, Interactions, Validation, Data Management)
- **UserSetup**: 10 tests covering setup flow
- Vue component testing with mounting, props, events, and user interactions

### 🔌 API Tests (`tests/api/`)
- **Endpoints**: 13 tests for API endpoint functionality
- **User Service**: 9 tests for user preferences service
- HTTP request/response testing and error handling

### 🔄 Integration Tests (`tests/integration/`)
- **User Workflows**: Complete user journey testing
- **Data Persistence**: State management and storage
- **Cross-component Communication**: Component interaction testing

### 🖥️ Manual Tests (`tests/manual/`)
- **Browser Console Tests**: Interactive testing in live browser environment
- **Goal System Validation**: Real-time testing of goal calculations and UI updates
- **Visual Testing**: Manual verification of colors, animations, and responsive design

### 🔧 Standalone Tests (`tests/standalone/`)
- **Goal System Logic**: Pure function testing without Vue/Vitest dependencies
- **Progress Calculations**: Mathematical validation of fasting progress
- **Phase Logic**: Testing fasting phase determination
- Can run in any JavaScript environment (Node.js, browser, etc.)

## 🛠️ Test Utilities (`tests/utils/`)

### Fixtures
- `user-fixtures.ts`: Test user data and configurations
- `goal-fixtures.ts`: Predefined goal scenarios

### Mocks
- `storage-mock.ts`: LocalStorage simulation
- `api-mock.ts`: API response mocking

### Setup
- `test-setup.ts`: Global test configuration
- `vue-test-utils.config.ts`: Vue testing configuration

## 📈 Coverage

Current test coverage across 101 tests:
- **Components**: 30 tests (UserSettings) + 10 tests (UserSetup) = 40 tests
- **API**: 13 tests (endpoints) + 9 tests (services) = 22 tests  
- **Integration**: 39 tests across workflow scenarios
- **Manual**: 5+ test scenarios for goal system
- **Standalone**: 15+ unit tests for goal calculations

## 🎯 Best Practices

### For Component Tests
- Use categorical organization with emoji headers
- Test structure, UI controls, interactions, validation, and data management
- Mock external dependencies and API calls
- Test both happy path and error scenarios

### For API Tests  
- Test all HTTP methods and status codes
- Validate request/response data structures
- Test error handling and edge cases
- Mock external services and databases

### For Integration Tests
- Test complete user workflows end-to-end
- Verify data persistence across components
- Test state management and component communication
- Use realistic test scenarios

### For Manual Tests
- Use browser console for interactive testing
- Test visual elements, animations, and responsive design
- Validate real-time calculations and UI updates
- Test user experience and accessibility

### For Standalone Tests
- Keep tests independent of framework dependencies
- Focus on pure function logic and calculations
- Enable testing in multiple environments
- Provide simple, clear test descriptions

## 🔍 Debugging Tests

### Failed Tests
```bash
# Run specific failing test
npm run test -- --run UserSettings.test.ts

# Get detailed output
npm run test -- --reporter=verbose

# Debug mode
npm run test:debug
```

### Manual Test Issues
- Check browser console for errors
- Verify development server is running
- Ensure test functions are properly loaded
- Use `window.fastingTests.help()` for available commands

### Standalone Test Issues
- Verify Node.js compatibility
- Check for missing dependencies in standalone environment
- Ensure functions are properly exported/defined
