/**
 * Demo: How to use the logged username localStorage functionality
 * 
 * This file demonstrates how to use the new getLoggedUsername() function
 * that stores and retrieves the unique username from localStorage.
 */

import { getLoggedUsername } from '../api'

/**
 * Example: Get the currently logged username
 */
export function getCurrentLoggedUsername(): string | null {
  const username = getLoggedUsername()
  
  if (username) {
    console.log('Currently logged user:', username)
    return username
  } else {
    console.log('No user is currently logged in')
    return null
  }
}

/**
 * Example: Check if a specific user is logged in
 */
export function isUserLoggedIn(expectedUsername: string): boolean {
  const currentUsername = getLoggedUsername()
  return currentUsername === expectedUsername
}

/**
 * Example: Get a display name for the logged user
 */
export function getLoggedUserDisplayName(): string {
  const username = getLoggedUsername()
  
  if (!username) {
    return 'Guest'
  }
  
  // Capitalize first letter
  return username.charAt(0).toUpperCase() + username.slice(1)
}

/**
 * Example: Use in component logic
 */
export function exampleUsageInComponent() {
  // This is how you would use it in a Vue component:
  
  /*
  <script setup lang="ts">
  import { getLoggedUsername } from '../api'
  import { ref, onMounted } from 'vue'
  
  const currentUser = ref<string | null>(null)
  
  onMounted(() => {
    currentUser.value = getLoggedUsername()
    
    if (currentUser.value) {
      console.log('Welcome back,', currentUser.value)
    }
  })
  </script>
  
  <template>
    <div v-if="currentUser">
      Welcome back, {{ currentUser }}!
    </div>
    <div v-else>
      Please log in
    </div>
  </template>
  */
}
