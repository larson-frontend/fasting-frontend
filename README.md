# Fasting Frontend

[![CI/CD Pipeline](https://github.com/larson-frontend/fasting-frontend/actions/workflows/ci.yml/badge.svg)](https://github.com/larson-frontend/fasting-frontend/actions/workflows/ci.yml)
[![Pull Request Checks](https://github.com/larson-frontend/fasting-frontend/actions/workflows/pr-checks.yml/badge.svg)](https://github.com/larson-frontend/fasting-frontend/actions/workflows/pr-checks.yml)
[![Release](https://github.com/larson-frontend/fasting-frontend/actions/workflows/release.yml/badge.svg)](https://github.com/larson-frontend/fasting-frontend/actions/workflows/release.yml)

**Modern Fasting Tracker** - Vue 3 + TypeScript + Tailwind CSS

## 🚀 Quick Start

```bash
npm install              # Install dependencies
npm run dev             # Development server → http://localhost:5173
npm run build           # Production build
npm run test            # Run tests
npm run validate        # Type-check + tests
```

**Optional:** Create `.env` with `VITE_API_BASE=http://localhost:8080/api`

## ✨ Features

- 🎯 **Goal-based Fasting** - Customizable goals (10h-24h)
- 📊 **Progress Tracking** - Visual progress bars with phase colors
- 📱 **Mobile-first Design** - Responsive Tailwind CSS
- 🧪 **Smart Fallback** - Auto-switches to mock data in dev
- 🔧 **Test Panel** - Built-in testing tools
- ⚡ **Modern Stack** - Vue 3 Composition API + TypeScript

## 🧪 Testing & CI/CD

| Command | Description |
|---------|-------------|
| `npm run test` | Interactive tests |
| `npm run test:run` | Single test run |
| `npm run test:coverage` | Coverage report |
| `npm run type-check` | TypeScript validation |

**Automated CI/CD:** Tests, builds, and security audits on every push. Auto-releases on version tags.

## 🔧 Tech Stack

- **Frontend:** Vue 3 + Composition API + TypeScript
- **Styling:** Tailwind CSS + Mobile-first Design
- **Build:** Vite + Vue SFC + Hot Reload
- **Testing:** Vitest + Vue Test Utils + Coverage
- **CI/CD:** GitHub Actions + Automated Releases
- **API:** REST with intelligent fallback system

## 📝 Development Notes

- **CORS:** Backend should allow origin `http://localhost:5173`
- **Mock Data:** Automatic fallback in development mode
- **Test Panel:** Available in dev mode for manual testing
- **Error Handling:** Production-ready error pages
