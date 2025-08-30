/**
 * Backend Integration Service
 * 
 * This service demonstrates how to integrate with the Spring Boot backend
 * using the actual API endpoints and data models.
 */

import { 
  startUserFast, 
  stopUserFast, 
  getUserFastingStatus, 
  getUserFastingHistory,
  checkUserAvailability,
  getLoggedUsername 
} from '../api'
import type { BackendFastSession, BackendFastStatus } from '../types/api'

/**
 * Backend Integration Manager
 * Handles all interactions with the Spring Boot backend
 */
export class BackendIntegrationService {
  private static instance: BackendIntegrationService;

  static getInstance(): BackendIntegrationService {
    if (!BackendIntegrationService.instance) {
      BackendIntegrationService.instance = new BackendIntegrationService();
    }
    return BackendIntegrationService.instance;
  }

  /**
   * Cross-device login: Get user's complete fasting data
   * Implements the backend team's recommended flow
   */
  async crossDeviceLogin(userIdentifier: string): Promise<{
    status: BackendFastStatus | null;
    history: BackendFastSession[];
    success: boolean;
  }> {
    try {
      console.log(`🔄 Cross-device login for: ${userIdentifier}`);

      // Step 1: Get current fasting status
      const status = await getUserFastingStatus(userIdentifier);
      console.log('📊 Current fast status:', status);

      // Step 2: Get fasting history
      const history = await getUserFastingHistory(userIdentifier);
      console.log(`📚 Fasting history: ${history.length} sessions`);

      // Step 3: Store user identifier locally
      localStorage.setItem('fasting_logged_username', userIdentifier);

      // Step 4: Emit events for UI updates
      window.dispatchEvent(new CustomEvent('crossDeviceLoginComplete', {
        detail: { userIdentifier, status, history }
      }));

      return { status, history, success: true };
    } catch (error) {
      console.error('❌ Cross-device login failed:', error);
      return { status: null, history: [], success: false };
    }
  }

  /**
   * Start fasting session for current user
   * Uses backend's user-specific endpoint
   */
  async startFasting(goalHours: number = 16): Promise<BackendFastSession | null> {
    const userIdentifier = getLoggedUsername();
    if (!userIdentifier) {
      console.error('No user logged in');
      return null;
    }

    try {
      console.log(`🎯 Starting ${goalHours}h fast for: ${userIdentifier}`);
      
      const fastSession = await startUserFast(userIdentifier, goalHours);
      console.log('✅ Fast started:', fastSession);

      // Update UI
      window.dispatchEvent(new CustomEvent('fastingStarted', {
        detail: { userIdentifier, fastSession }
      }));

      return fastSession;
    } catch (error) {
      console.error('❌ Failed to start fasting:', error);
      return null;
    }
  }

  /**
   * Stop current fasting session
   */
  async stopFasting(): Promise<BackendFastSession | null> {
    const userIdentifier = getLoggedUsername();
    if (!userIdentifier) {
      console.error('No user logged in');
      return null;
    }

    try {
      console.log(`🏁 Stopping fast for: ${userIdentifier}`);
      
      const completedFast = await stopUserFast(userIdentifier);
      console.log('✅ Fast completed:', completedFast);

      // Update UI
      window.dispatchEvent(new CustomEvent('fastingCompleted', {
        detail: { userIdentifier, completedFast }
      }));

      return completedFast;
    } catch (error) {
      console.error('❌ Failed to stop fasting:', error);
      return null;
    }
  }

  /**
   * Get real-time fasting status
   */
  async getCurrentStatus(): Promise<BackendFastStatus | null> {
    const userIdentifier = getLoggedUsername();
    if (!userIdentifier) {
      console.error('No user logged in');
      return null;
    }

    try {
      const status = await getUserFastingStatus(userIdentifier);
      return status;
    } catch (error) {
      console.error('❌ Failed to get status:', error);
      return null;
    }
  }

  /**
   * Check if username and email are available before registration
   */
  async validateUserRegistration(username: string, email: string): Promise<{
    canRegister: boolean;
    usernameAvailable: boolean;
    emailAvailable: boolean;
    errors: string[];
  }> {
    try {
      const availability = await checkUserAvailability(username, email);
      const errors: string[] = [];

      if (!availability.usernameAvailable) {
        errors.push(`Username '${username}' is already taken`);
      }

      if (!availability.emailAvailable) {
        errors.push(`Email '${email}' is already registered`);
      }

      return {
        canRegister: availability.usernameAvailable && availability.emailAvailable,
        usernameAvailable: availability.usernameAvailable,
        emailAvailable: availability.emailAvailable,
        errors
      };
    } catch (error) {
      console.error('❌ Failed to validate registration:', error);
      return {
        canRegister: false,
        usernameAvailable: false,
        emailAvailable: false,
        errors: ['Unable to validate registration data']
      };
    }
  }

  /**
   * Setup event listeners for backend integration
   */
  setupBackendEventListeners(callbacks: {
    onCrossDeviceLogin?: (data: any) => void;
    onFastingStarted?: (data: any) => void;
    onFastingCompleted?: (data: any) => void;
  }) {
    // Cross-device login complete
    const handleCrossDeviceLogin = (event: any) => {
      callbacks.onCrossDeviceLogin?.(event.detail);
    };

    // Fasting session started
    const handleFastingStarted = (event: any) => {
      callbacks.onFastingStarted?.(event.detail);
    };

    // Fasting session completed
    const handleFastingCompleted = (event: any) => {
      callbacks.onFastingCompleted?.(event.detail);
    };

    // Add event listeners
    window.addEventListener('crossDeviceLoginComplete', handleCrossDeviceLogin);
    window.addEventListener('fastingStarted', handleFastingStarted);
    window.addEventListener('fastingCompleted', handleFastingCompleted);

    // Return cleanup function
    return () => {
      window.removeEventListener('crossDeviceLoginComplete', handleCrossDeviceLogin);
      window.removeEventListener('fastingStarted', handleFastingStarted);
      window.removeEventListener('fastingCompleted', handleFastingCompleted);
    };
  }
}

/**
 * Example Usage in Vue Component:
 * 
 * <script setup lang="ts">
 * import { ref, onMounted, onUnmounted } from 'vue'
 * import { backendIntegration } from '../services/backend-integration'
 * 
 * const currentStatus = ref(null)
 * const isLoading = ref(false)
 * 
 * // Setup backend event listeners
 * const cleanup = backendIntegration.setupBackendEventListeners({
 *   onCrossDeviceLogin: (data) => {
 *     console.log('User logged in from another device:', data)
 *     currentStatus.value = data.status
 *   },
 *   onFastingStarted: (data) => {
 *     console.log('Fasting started:', data)
 *     currentStatus.value = data.fastSession
 *   },
 *   onFastingCompleted: (data) => {
 *     console.log('Fasting completed:', data)
 *     currentStatus.value = null
 *   }
 * })
 * 
 * // Login with username or email
 * const handleLogin = async (userIdentifier: string) => {
 *   isLoading.value = true
 *   const result = await backendIntegration.crossDeviceLogin(userIdentifier)
 *   isLoading.value = false
 *   
 *   if (result.success) {
 *     console.log('Login successful, user data synced!')
 *   }
 * }
 * 
 * // Start fasting
 * const startFast = () => {
 *   backendIntegration.startFasting(16)
 * }
 * 
 * // Stop fasting
 * const stopFast = () => {
 *   backendIntegration.stopFasting()
 * }
 * 
 * onUnmounted(() => {
 *   cleanup()
 * })
 * </script>
 */

// Export singleton instance
export const backendIntegration = BackendIntegrationService.getInstance();
