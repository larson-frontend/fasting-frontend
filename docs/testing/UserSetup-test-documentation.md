# UserSetup Component Tests

## Overview
The `UserSetup.test.ts` file contains comprehensive tests for the UserSetup component, focusing primarily on the **username already exists** scenario during first-time registration.

## Test Coverage

### 🚨 Username Already Exists Scenarios

#### 1. **USER_EXISTS Error Display**
- Tests that when a username already exists, the component displays the correct error message
- Verifies amber styling (warning style) is applied instead of red error styling
- Checks that the proper error title and message are shown

#### 2. **Email Already Exists**
- Validates that email conflicts are handled the same way as username conflicts
- Ensures the API is called with the correct email parameter
- Confirms amber warning styling is applied

#### 3. **Error Event Emission**
- Verifies that the component emits the correct error event
- Checks that the error message is passed to the parent component

#### 4. **Error Type Differentiation**
- Tests that USER_EXISTS errors are styled differently from general errors
- USER_EXISTS: Amber warning styling (less severe)
- General errors: Red error styling (more severe)

#### 5. **Error Icon Display**
- Validates that the correct warning triangle icon is shown for USER_EXISTS
- Ensures different icons are used for different error types

#### 6. **Loading State**
- Tests that the submit button is disabled during API calls
- Verifies loading text is displayed while processing

#### 7. **Input Validation**
- Tests email format detection and API call structure
- Validates username format handling

### 🌐 Language Selection Tests

#### 8. **Language Switching**
- Tests that clicking language buttons immediately changes the interface language
- Validates that translations are applied correctly

### ✅ Success Scenarios

#### 9. **Successful Registration**
- Tests that successful user creation emits the correct success event
- Validates that user data is passed to the parent component

## Key Features Tested

### Error Handling
```typescript
// USER_EXISTS errors get amber styling
expect(wrapper.find('.border-amber-200').exists()).toBe(true)

// General errors get red styling  
expect(wrapper.find('.border-red-200').exists()).toBe(true)
```

### API Integration
```typescript
// Email format detection
expect(mockLoginOrCreateUser).toHaveBeenCalledWith({
  email: 'test@example.com'
})

// Username format detection
expect(mockLoginOrCreateUser).toHaveBeenCalledWith({
  username: 'testuser123'
})
```

### User Experience
```typescript
// Loading state during API calls
expect(submitButton.attributes('disabled')).toBeDefined()
expect(wrapper.text()).toContain('Loading...')

// Proper error messaging
expect(wrapper.text()).toContain('Username/Email Already Taken')
expect(wrapper.text()).toContain('Please try a different username or email address')
```

## Running the Tests

```bash
# Run only UserSetup tests
npx vitest run tests/UserSetup.test.ts

# Run all tests
npm run test:run

# Run tests in watch mode
npm run test
```

## Test Structure

The tests use:
- **Vitest** as the test runner
- **Vue Test Utils** for component mounting and interaction
- **Mock functions** to simulate API responses
- **i18n support** for testing translations
- **Data test IDs** for reliable element selection

## Mock Strategy

The tests mock the `loginOrCreateUser` API function to simulate:
- Successful user registration
- USER_EXISTS errors
- General network/validation errors
- Slow API responses (loading states)

This allows testing all scenarios without requiring a real backend.
