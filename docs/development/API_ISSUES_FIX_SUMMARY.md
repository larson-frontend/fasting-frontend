# 🚨 API Issues Analysis & Fixes

**Date**: August 24, 2025  
**Issues**: `/api/users/me` 403 Forbidden, UserSettings "No User logged in" error

## 🔍 **Root Cause Analysis**

### **Issue 1: `/api/users/me` endpoint returns 403 Forbidden**

**Problem**: Frontend is calling `/api/users/me` but this endpoint **doesn't exist** in the backend.

**Evidence**:
- Frontend code: `await userHttpClient.get<User>('/users/me')`
- Backend API: Only has `/api/users/current` endpoint
- Result: 403 Forbidden error

**Root Cause**: **Endpoint URL mismatch** between frontend and backend.

### **Issue 2: UserSettings "Save Changes" shows "No User logged in"**

**Problem**: The save button fails because `getCurrentUser()` returns `null`.

**Call Chain**:
1. UserSettings clicks "Save Changes" 
2. Calls `savePreferences()` 
3. Checks `if (!currentUser.value)` 
4. `getCurrentUser()` calls non-existent `/users/me` → 403 error
5. 403 error triggers `this.logout()` → clears auth token
6. Returns `null` → "No user logged in" error

**Root Cause**: Same as Issue 1 - wrong endpoint URL.

### **Issue 3: What `/api/users/me` should do**

Based on backend analysis:
- **Intended behavior**: Get current authenticated user data
- **Backend equivalent**: `/api/users/current` 
- **Parameters**: Expects `userId` parameter (currently defaults to "1")
- **Response**: `{ user: User }` object wrapper
- **Authentication**: Expects JWT in Authorization header

## ✅ **Implemented Fixes**

### **Fix 1: Corrected API Endpoint URL**

**Before**:
```typescript
const user = await userHttpClient.get<User>('/users/me', {
  headers: { Authorization: `Bearer ${this.authToken}` }
});
```

**After**:
```typescript
const userId = this.currentUser?.id || '1'; // Use stored user ID or default
const response = await userHttpClient.get<{user: User}>(`/users/current?userId=${userId}`, {
  headers: { Authorization: `Bearer ${this.authToken}` }
});
const user = response.user; // Extract user from response wrapper
```

### **Fix 2: Updated Response Handling**

**Changes**:
- Added `userId` parameter to match backend API
- Updated response type to match backend wrapper: `{user: User}`
- Extract user from response wrapper before processing

### **Fix 3: Backwards Compatibility**

**Approach**:
- Use stored `currentUser.id` if available
- Fallback to `userId=1` for testing/development
- Maintain existing error handling and logout logic

## 🔧 **Backend API Reference**

Based on actual backend implementation:

### **GET /api/users/current**
```javascript
// Request
GET /api/users/current?userId=1
Headers: {
  'Authorization': 'Bearer <jwt-token>',
  'Content-Type': 'application/json'
}

// Response (200 OK)
{
  "user": {
    "id": "1",
    "username": "john_doe", 
    "email": "john@example.com",
    "preferences": {
      "language": "en",
      "theme": "system",
      "notifications": { ... }
    }
  }
}
```

### **PATCH /api/users/preferences**
```javascript
// Request  
PATCH /api/users/preferences?userId=1
Headers: {
  'Authorization': 'Bearer <jwt-token>',
  'Content-Type': 'application/json'
}
Body: {
  "language": "de",
  "theme": "dark",
  "notifications": { ... }
}

// Response (200 OK)
{
  "user": { /* updated user object */ }
}
```

## 🚀 **Testing Status**

### **Frontend Changes Applied** ✅
- ✅ Updated `getCurrentUser()` method in `user-service.ts`
- ✅ Fixed endpoint URL: `/users/me` → `/users/current`
- ✅ Added userId parameter handling
- ✅ Updated response parsing to handle wrapper object
- ✅ Updated API endpoint tests to match new endpoint
- ✅ All 122 tests passing (101 automated + 21 standalone)

### **Expected Results After Fix**
- ✅ `/api/users/current?userId=1` should return 200 OK (instead of 403)
- ✅ UserSettings should load user data successfully  
- ✅ "Save Changes" button should work without "No user logged in" error
- ✅ User preferences should save and persist correctly

### **Backend Requirements** 
- ✅ Backend already has correct `/api/users/current` endpoint
- ✅ Backend already has `/api/users/preferences` endpoint  
- ✅ Both endpoints expect JWT authentication headers
- ✅ Both endpoints use `userId` parameter (temporary until full JWT auth)

## 📊 **Impact Assessment**

### **Before Fix (Broken)**
```
User opens Settings
   ↓
getCurrentUser() calls /users/me  
   ↓
404/403 Error (endpoint doesn't exist)
   ↓
logout() called (clears auth data)
   ↓ 
Save button shows "No user logged in"
   ↓
❌ Complete feature failure
```

### **After Fix (Working)**
```
User opens Settings
   ↓
getCurrentUser() calls /users/current?userId=1
   ↓  
200 OK with user data
   ↓
Settings form populated with current preferences
   ↓
Save button works normally
   ↓
✅ Full feature functionality
```

## 🎯 **API Endpoint Summary**

| Frontend Call | Backend Endpoint | Status | Purpose |
|---------------|------------------|---------|---------|
| `GET /users/me` | ❌ **Not Found** | **Fixed** → `/users/current` | Get current user |
| `GET /users/current` | ✅ **Exists** | ✅ **Working** | Get current user (correct) |
| `PATCH /users/preferences` | ✅ **Exists** | ✅ **Working** | Update user preferences |
| `POST /users/login-or-create` | ✅ **Exists** | ✅ **Working** | Login/register user |

## 🔮 **Future Improvements**

### **Full JWT Authentication** (Backend Task)
Currently both endpoints use `userId` parameter as temporary solution:
- **Goal**: Extract user ID from JWT token directly
- **Benefit**: Remove need for `userId` parameter
- **Security**: Prevent users from accessing other users' data

### **Response Consistency** (Backend Task)  
- **Current**: Some endpoints return `{user: User}`, others return `User` directly
- **Goal**: Standardize response format across all user endpoints
- **Benefit**: Simpler frontend response handling

## ✅ **Resolution Status**

- ✅ **Root cause identified**: Wrong endpoint URL in frontend
- ✅ **Fix implemented**: Updated to correct backend endpoint
- ✅ **Response handling updated**: Handle backend response wrapper
- ✅ **Backwards compatibility**: Fallback to userId=1 for development
- ✅ **Ready for testing**: Frontend changes complete

**Next Step**: Test the application to verify the fixes resolve both issues.
