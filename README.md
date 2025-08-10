# Fasting Frontend

[![CI/CD Pipeline](https://github.com/larson-frontend/fasting-frontend/actions/workflows/ci.yml/badge.svg)](https://github.com/larson-frontend/fasting-frontend/actions/workflows/ci.yml)
[![Pull Request Checks](https://github.com/larson-frontend/fasting-frontend/actions/workflows/pr-checks.yml/badge.svg)](https://github.com/larson-frontend/fasting-frontend/actions/workflows/pr-checks.yml)
[![Release](https://github.com/larson-frontend/fasting-frontend/actions/workflows/release.yml/badge.svg)](https://github.com/larson-frontend/fasting-frontend/actions/workflows/release.yml)

**Modern Fasting Tracker** - Vue 3 + TypeScript + Tailwind CSS

## 🚀 Quick Start

### Prerequisites
- **Node.js 22.17.1+** (Latest LTS recommended)
- **npm 10+** (comes with Node.js)

### Installation & Development
```bash
# Clone and setup
git clone <repository-url>
cd fasting-frontend

# Install dependencies
npm install

# Start development server
npm run dev                    # → http://localhost:5173

# Production build
npm run build                  # → dist/

# Preview production build
npm run preview               # → http://localhost:4173
```

### Testing & Validation
```bash
npm run test                  # Interactive test runner
npm run test:run             # Single test run (CI mode)
npm run test:coverage        # Generate coverage report
npm run validate             # TypeScript + tests (recommended)
```

**Environment Setup:** Create `.env` with `VITE_API_BASE=http://localhost:8080/api` for custom API endpoint.

## ✨ Features

### Core Functionality
- 🎯 **Smart Fasting Goals** - Flexible duration settings (10h-24h) with preset options
- 📊 **Real-time Progress** - Visual progress indicators with dynamic phase colors
- ⏱️ **Precise Tracking** - Millisecond-accurate timer with pause/resume capability
- 📈 **Progress Analytics** - Detailed statistics and completion tracking

### User Experience
- 📱 **Mobile-first Design** - Optimized for all screen sizes with Tailwind CSS
- 🎨 **Modern UI** - Clean, intuitive interface with responsive components
- 🔧 **Development Tools** - Built-in test panel for manual testing and debugging
- ⚡ **Performance** - Fast loading with Vite's optimized bundling

### Technical Excellence
- 🧪 **Intelligent Fallback** - Seamless switch between live API and mock data
- � **Type Safety** - Full TypeScript coverage with strict type checking
- 🏗️ **Modular Architecture** - Clean separation of concerns with service layers
- 🚀 **Modern Stack** - Latest Vue 3 Composition API with enhanced reactivity

## 🧪 Testing & CI/CD

| Command | Description |
|---------|-------------|
| `npm run test` | Interactive tests |
| `npm run test:run` | Single test run |
| `npm run test:coverage` | Coverage report |
| `npm run type-check` | TypeScript validation |

**Automated CI/CD:** Tests, builds, and security audits on every push. Auto-releases on version tags.

## 🔄 Recent Updates

### Version 0.1.0 - Modern Stack Upgrade (August 2025)
- ⬆️ **Node.js 22.17.1** - Upgraded to latest LTS for enhanced performance
- ⬆️ **Vue 3.5.0** - Latest Vue with improved Composition API and reactivity
- ⬆️ **Vite 7.1.1** - Ultra-fast build tool with advanced optimizations
- ⬆️ **TypeScript 5.6.0** - Latest TypeScript with enhanced type inference
- ⬆️ **Vitest 3.2.4** - Modern testing framework with native ESM support
- 🏗️ **API Restructure** - Improved modular service architecture
- 🔧 **Configuration Updates** - Optimized build and test configurations
- ✅ **Zero Vulnerabilities** - Complete security audit and dependency cleanup
- 📊 **Full Test Coverage** - 34/34 tests passing with comprehensive coverage

## 🔧 Tech Stack

### Core Framework
- **Vue 3.5.0** - Latest Composition API with enhanced reactivity
- **TypeScript 5.6.0** - Advanced type safety and modern JS features
- **Node.js 22.17.1** - Latest LTS with enhanced performance

### Build & Development
- **Vite 7.1.1** - Ultra-fast build tool with HMR
- **vue-tsc 3.0.0** - Vue TypeScript compiler
- **@vitejs/plugin-vue 6.0.1** - Vue SFC support

### Styling & UI
- **Tailwind CSS 3.4.13** - Utility-first CSS framework
- **PostCSS 8.4.47** - CSS processing pipeline
- **Autoprefixer 10.4.20** - Automatic vendor prefixes

### Testing & Quality
- **Vitest 3.2.4** - Fast native ESM test runner
- **@vue/test-utils 2.4.6** - Vue component testing utilities
- **@vitest/coverage-v8 3.2.4** - Code coverage reporting
- **jsdom 26.1.0** - DOM environment for testing

### Architecture
- **API Layer:** Modular service architecture with fallback system
- **State Management:** Vue 3 Composition API reactive refs
- **Component System:** Single File Components (SFC)
- **Build System:** Zero-config Vite with optimized production builds

## 📝 Development Notes

### API Configuration
- **CORS Setup:** Backend should allow origin `http://localhost:5173`
- **Environment Variables:** Use `.env` for `VITE_API_BASE` configuration
- **Fallback System:** Automatic mock data in development when API unavailable
- **Service Architecture:** Modular API layer with `fasting-service`, `mock-service`, and `fallback-service`

### Development Workflow
- **Hot Reload:** Instant updates via Vite HMR
- **Type Checking:** Real-time TypeScript validation
- **Test Panel:** Available in dev mode (`/test-panel`) for manual testing
- **Error Boundaries:** Production-ready error handling and user feedback

### Node.js Version Management
```bash
# Using nvm (recommended)
nvm use                       # Uses .nvmrc (Node.js 22.17.1)
nvm install 22.17.1          # Install if needed

# Verify version
node -v                      # Should output v22.17.1
```

### Project Structure
```
src/
├── api/                     # API service layer
│   ├── index.ts            # Main API exports
│   ├── fasting-service.ts  # Live API implementation
│   ├── mock-service.ts     # Mock data service
│   └── fallback-service.ts # Fallback handling
├── components/             # Vue components
├── assets/                 # Static assets
└── main.ts                # Application entry point
```
