# Cross-Device User Data Synchronization

This document explains how the fasting app automatically syncs user data when logging in from different devices.

## 🔄 How It Works

When a user logs in with their username on any device, the system automatically:

1. **Authenticates** the user with the backend
2. **Fetches** their current fasting status from the server
3. **Retrieves** their complete fasting history
4. **Stores** the username locally for quick access
5. **Syncs** all data to the local device

## 🚀 Implementation Details

### User Service Methods

#### `syncUserDataAfterLogin()`
- Automatically called after successful login/registration
- Fetches both fasting status and history in parallel
- Returns: `{ status: any, history: any[] }`

#### `fetchUserFastingStatus()`
- Gets the user's current fasting state
- Includes: active status, elapsed time, goal hours
- Requires authentication token

#### `fetchUserFastingHistory()`
- Retrieves complete fasting session history
- Includes: past sessions, completion stats, achievements
- Requires authentication token

### Authentication Headers

All user-specific API calls automatically include:
```typescript
headers: {
  'Authorization': `Bearer ${userToken}`
}
```

## 📱 Cross-Device Scenarios

### Scenario 1: User logs in on new device
```
Device A: User creates account "john_doe"
Device B: User logs in with "john_doe"
Result: Device B gets all fasting data from Device A
```

### Scenario 2: User continues fasting on different device
```
Device A: User starts 16h fast
Device B: User logs in mid-fast
Result: Device B shows current fast progress and can continue/stop
```

### Scenario 3: Multiple devices, same user
```
All devices: Automatically sync when user logs in
Backend: Single source of truth for all user data
Result: Consistent experience across all devices
```

## 💻 Usage Examples

### Manual Data Sync
```typescript
import { syncUserDataAfterLogin } from './api'

// Manually trigger data sync
const result = await syncUserDataAfterLogin()
console.log('Synced data:', result)
```

### Check Current Status
```typescript
import { fetchUserFastingStatus } from './api'

const status = await fetchUserFastingStatus()
if (status?.active) {
  console.log(`Fast active for ${status.hours}h ${status.minutes}m`)
}
```

### Get History
```typescript
import { fetchUserFastingHistory } from './api'

const history = await fetchUserFastingHistory()
console.log(`User has completed ${history.length} fasting sessions`)
```

### Using the Sync Manager
```typescript
import { userDataSync } from './services/user-data-sync'

// Setup listeners for sync events
const cleanup = userDataSync.setupSyncListeners({
  onSyncComplete: (data) => {
    console.log('Data synced from server:', data)
    // Update UI with fresh data
  },
  onSyncError: (error) => {
    console.error('Sync failed:', error)
    // Show error message to user
  }
})

// Manually trigger sync
await userDataSync.manualSync()
```

## 🔒 Security & Authentication

- All sync operations require valid JWT token
- Tokens are automatically included in headers
- Failed auth results in graceful error handling
- User data is always scoped to the authenticated user

## 🎯 Benefits

1. **Seamless Experience**: User can switch devices without losing progress
2. **Data Consistency**: Single source of truth on backend
3. **Automatic Sync**: No manual intervention required
4. **Offline Support**: Local storage maintains data when offline
5. **Real-time Updates**: Fresh data on every login

## 🛠️ Mock vs Real API

The system works identically in both modes:

### Mock Mode
- Simulates realistic sync delays
- Returns sample fasting data
- Uses same localStorage patterns
- Perfect for development/testing

### Production Mode
- Connects to real backend API
- Fetches actual user data
- Requires proper authentication
- Full cross-device synchronization

## 🧪 Testing

All sync functionality is tested:
- ✅ Login triggers data sync
- ✅ Registration syncs (empty) data
- ✅ Authentication headers included
- ✅ Error handling for failed sync
- ✅ Mock and real API consistency

## 🔧 Configuration

The sync endpoints can be configured in `src/api/config.ts`:

```typescript
export const endpoints = {
  fasting: {
    status: '/fasting/status',    // User's current state
    history: '/fasting/history'   // User's session history
  }
}
```

## 📊 Data Flow

```
User Login → Authentication → Token Storage → Data Sync → UI Update
     ↓              ↓              ↓              ↓           ↓
  Username      JWT Token    localStorage   API Calls   Fresh Data
```

This implementation ensures that users always have their complete fasting data available, regardless of which device they use to access the application.
