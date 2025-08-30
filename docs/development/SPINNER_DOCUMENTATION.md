# Loading Spinner Components Documentation

This document explains how to use the loading spinner components in the fasting-frontend application.

## Components Overview

### 1. LoadingSpinner (Full-screen overlay with skeleton)
A full-screen loading spinner that shows a skeleton version of the landing page layout with a floating leaf animation.

**Location:** `src/components/LoadingSpinner.vue`

**Features:**
- Displays a skeleton/placeholder version of the main app layout
- Floating leaf emoji (🍃) with gentle float animation
- No loading text (visual-only loading indication)
- Shows structure placeholders for header, status card, history card, and debug info

**Usage:**
```vue
<template>
  <LoadingSpinner :show="isLoading" />
</template>
```

**Props:**
- `show` (boolean): Controls spinner visibility

### 2. InlineSpinner (Inline/button spinner)
A smaller spinner for use in buttons or inline contexts.

**Location:** `src/components/InlineSpinner.vue`

**Usage:**
```vue
<template>
  <button :disabled="loading">
    <InlineSpinner 
      v-if="loading"
      :show="loading" 
      size="xs"
      variant="dark"
    />
    <span v-else>Button Text</span>
  </button>
</template>
```

**Props:**
- `show` (boolean): Controls spinner visibility
- `text` (string): Optional text next to spinner
- `size` ('xs' | 'sm' | 'md'): Spinner size
- `variant` ('light' | 'dark' | 'primary'): Color variant

## Implementation Examples

### Global Loading State
The main App.vue demonstrates full-screen loading during API operations:

```vue
<script setup>
const loading = ref(false)

async function performApiOperation() {
  loading.value = true
  try {
    await apiCall()
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <LoadingSpinner :show="loading" />
</template>
```

### Button Loading State
The HistoryCard component demonstrates inline loading in a button:

```vue
<template>
  <button 
    @click="$emit('refresh')" 
    :disabled="loading"
    class="flex items-center justify-center min-w-[100px]">
    <InlineSpinner 
      v-if="loading"
      :show="loading" 
      size="xs"
      variant="dark"
    />
    <span v-else>{{ $t('history.refresh') }}</span>
  </button>
</template>
```

## Localization

Loading texts are localized in `src/locales/`:

**English (en.json):**
```json
{
  "common": {
    "loading": "Loading...",
    "loadingData": "Loading data...",
    "startingFast": "Starting fast...",
    "stoppingFast": "Stopping fast..."
  }
}
```

**German (de.json):**
```json
{
  "common": {
    "loading": "Laden...",
    "loadingData": "Daten werden geladen...",
    "startingFast": "Fasten wird gestartet...",
    "stoppingFast": "Fasten wird beendet..."
  }
}
```

## Best Practices

1. **Always use loading states for API calls** - Users should know when the app is working
2. **Use descriptive loading text** - Tell users what's happening
3. **Disable interactive elements** - Prevent user actions during loading
4. **Use appropriate spinner size** - Full-screen for major operations, inline for buttons
5. **Consistent styling** - Use the same logo/branding across all spinners

## Global Loading Composable

For advanced usage, you can use the global loading composable:

```typescript
// src/composables/useGlobalLoading.ts
import { useGlobalLoading } from '@/composables/useGlobalLoading'

const { isLoading, loadingText, startLoading, stopLoading } = useGlobalLoading()

// Usage
startLoading('Loading data...')
// ... perform operation
stopLoading()
```

This provides a centralized way to manage loading states across the entire application.
