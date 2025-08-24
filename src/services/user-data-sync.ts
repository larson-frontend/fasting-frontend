/**
 * User Data Sync Service
 * 
 * This service demonstrates how user fasting data is automatically
 * synchronized when logging in from different devices.
 */

import { 
  syncUserDataAfterLogin, 
  fetchUserFastingStatus, 
  fetchUserFastingHistory,
  getLoggedUsername 
} from '../api'

/**
 * Sync Manager for User Fasting Data
 */
export class UserDataSyncManager {
  private static instance: UserDataSyncManager;
  private syncInProgress = false;
  
  static getInstance(): UserDataSyncManager {
    if (!UserDataSyncManager.instance) {
      UserDataSyncManager.instance = new UserDataSyncManager();
    }
    return UserDataSyncManager.instance;
  }

  /**
   * Check if sync is in progress
   */
  isSyncing(): boolean {
    return this.syncInProgress;
  }

  /**
   * Manually trigger data sync for current user
   */
  async manualSync(): Promise<{ status: any; history: any[] } | null> {
    const username = getLoggedUsername();
    if (!username) {
      console.warn('No user logged in, cannot sync data');
      return null;
    }

    this.syncInProgress = true;
    
    try {
      console.log(`🔄 Syncing data for user: ${username}`);
      
      const result = await syncUserDataAfterLogin();
      
      console.log('✅ User data sync completed:', result);
      
      // Emit custom event for components to listen to
      window.dispatchEvent(new CustomEvent('userDataSynced', {
        detail: { username, ...result }
      }));
      
      return result;
    } catch (error) {
      console.error('❌ User data sync failed:', error);
      
      // Emit error event
      window.dispatchEvent(new CustomEvent('userDataSyncError', {
        detail: { username, error }
      }));
      
      return null;
    } finally {
      this.syncInProgress = false;
    }
  }

  /**
   * Get current user fasting status
   */
  async getCurrentFastingStatus(): Promise<any> {
    try {
      return await fetchUserFastingStatus();
    } catch (error) {
      console.error('Failed to fetch fasting status:', error);
      return null;
    }
  }

  /**
   * Get current user fasting history
   */
  async getCurrentFastingHistory(): Promise<any[]> {
    try {
      return await fetchUserFastingHistory();
    } catch (error) {
      console.error('Failed to fetch fasting history:', error);
      return [];
    }
  }

  /**
   * Example: Setup sync event listeners for Vue components
   */
  setupSyncListeners(callbacks: {
    onSyncStart?: () => void;
    onSyncComplete?: (data: any) => void;
    onSyncError?: (error: any) => void;
  }) {
    // Listen for sync events
    window.addEventListener('userDataSynced', (event: any) => {
      callbacks.onSyncComplete?.(event.detail);
    });

    window.addEventListener('userDataSyncError', (event: any) => {
      callbacks.onSyncError?.(event.detail);
    });

    // Return cleanup function
    return () => {
      window.removeEventListener('userDataSynced', callbacks.onSyncComplete as any);
      window.removeEventListener('userDataSyncError', callbacks.onSyncError as any);
    };
  }
}

/**
 * Example usage in a Vue component:
 * 
 * <script setup lang="ts">
 * import { ref, onMounted, onUnmounted } from 'vue'
 * import { UserDataSyncManager } from '../services/user-data-sync'
 * 
 * const syncManager = UserDataSyncManager.getInstance()
 * const isLoading = ref(false)
 * const fastingData = ref(null)
 * 
 * const cleanup = syncManager.setupSyncListeners({
 *   onSyncStart: () => isLoading.value = true,
 *   onSyncComplete: (data) => {
 *     isLoading.value = false
 *     fastingData.value = data
 *     console.log('Data synced from another device!', data)
 *   },
 *   onSyncError: (error) => {
 *     isLoading.value = false
 *     console.error('Sync failed:', error)
 *   }
 * })
 * 
 * onMounted(() => {
 *   // Trigger manual sync if needed
 *   syncManager.manualSync()
 * })
 * 
 * onUnmounted(() => {
 *   cleanup()
 * })
 * </script>
 */

// Export singleton instance
export const userDataSync = UserDataSyncManager.getInstance();
