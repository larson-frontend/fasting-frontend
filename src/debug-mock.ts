console.log('=== MOCK MODE DEBUG ===');

// Check environment variables
console.log('Environment Variables:');
console.log('- import.meta.env.DEV:', import.meta.env.DEV);
console.log('- import.meta.env.PROD:', import.meta.env.PROD);
console.log('- import.meta.env.VITE_USE_MOCK_DATA:', import.meta.env.VITE_USE_MOCK_DATA);

// Import and check config
import { config, isMockMode } from './api/index';

console.log('\nConfig Values:');
console.log('- config.useMockData:', config.useMockData);
console.log('- config.isDevelopment:', config.isDevelopment);
console.log('- config.isProduction:', config.isProduction);
console.log('- isMockMode (exported):', isMockMode);

console.log('\nMock mode is:', config.useMockData ? '✅ ENABLED' : '❌ DISABLED');
console.log('=========================');
