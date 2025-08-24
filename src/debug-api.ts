/**
 * API Configuration Debug Information
 * Use this script to test API calls and verify authentication
 */

console.log('=== API Configuration Debug ===');

// 1. Check stored authentication data
console.log('\n1. Authentication Status:');
console.log('- Auth token exists:', !!localStorage.getItem('fasting_auth_token'));
console.log('- User data exists:', !!localStorage.getItem('fasting_user'));
console.log('- Language setting:', localStorage.getItem('fasting_language'));
console.log('- Username:', localStorage.getItem('fasting_logged_username'));

// 2. Check localStorage
console.log('\n2. LocalStorage Contents:');
console.log('- Auth token:', localStorage.getItem('fasting_auth_token'));
console.log('- User data:', localStorage.getItem('fasting_user'));
console.log('- Language:', localStorage.getItem('fasting_language'));
console.log('- Username:', localStorage.getItem('fasting_logged_username'));

// 3. Test API endpoints (you can run these manually in browser console)
console.log('\n3. Manual API Test Commands (run in browser console):');
console.log(`
// Test authentication status
fetch('/api/users/me', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('fasting_auth_token'),
    'Content-Type': 'application/json'
  }
}).then(r => r.json()).then(console.log).catch(console.error);

// Test user fasting status  
const user = JSON.parse(localStorage.getItem('fasting_user') || '{}');
const userIdentifier = user.username || user.email;
fetch('/api/fast/user/' + encodeURIComponent(userIdentifier) + '/status', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('fasting_auth_token'),
    'Content-Type': 'application/json'
  }
}).then(r => r.json()).then(console.log).catch(console.error);

// Test user fasting history
fetch('/api/fast/user/' + encodeURIComponent(userIdentifier) + '/history', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('fasting_auth_token'),
    'Content-Type': 'application/json'
  }
}).then(r => r.json()).then(console.log).catch(console.error);
`);

export {};
