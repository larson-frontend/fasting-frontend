import { createApp } from 'vue'
import App from './App.vue'
import './assets/tailwind.css'
import { i18n } from './i18n'
import { isFeatureEnabled } from './config/features'

// Debug Mock Mode (nur in Development)
if (import.meta.env.DEV) {
  import('./debug-mock');
}

// Debug mock mode during development
if (import.meta.env.DEV) {
  import('./debug-mock');
}

const app = createApp(App)

// Global error handler to prevent crashes
app.config.errorHandler = (err, instance, info) => {
  console.error('Global Vue error:', err, info)
  // Don't crash the app, just log the error
}

// Global warning handler
app.config.warnHandler = (msg, instance, trace) => {
  console.warn('Vue warning:', msg, trace)
}

// Enforce Light Mode while theme selection is disabled (prod-like behavior)
try {
  if (!isFeatureEnabled('themeSelection')) {
    document.documentElement.classList.remove('dark')
  }
} catch (e) {
  // no-op: defensive in case DOM is unavailable in some test envs
}

app.use(i18n).mount('#app')
