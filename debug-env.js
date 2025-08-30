// Debug script to check environment variables and config
import { config } from './src/api/config.js';

console.log('=== Environment Debug ===');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('import.meta.env.DEV:', import.meta.env?.DEV);
console.log('import.meta.env.PROD:', import.meta.env?.PROD);
console.log('import.meta.env.VITE_USE_MOCK_DATA:', import.meta.env?.VITE_USE_MOCK_DATA);

console.log('\n=== Config Values ===');
console.log('config.useMockData:', config.useMockData);
console.log('config.isDevelopment:', config.isDevelopment);
console.log('config.isProduction:', config.isProduction);
console.log('config.apiBase:', config.apiBase);
