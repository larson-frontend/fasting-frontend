import { createApp } from 'vue'
import App from './App.vue'
import './assets/tailwind.css'
import { i18n } from './i18n'

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

app.use(i18n).mount('#app')
