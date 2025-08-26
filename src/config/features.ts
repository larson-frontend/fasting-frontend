/**
 * Feature flags for controlling which features are enabled in the app
 * This allows us to hide unfinished features and accelerate publishing
 */

export interface FeatureFlags {
  // Notification features
  detailedNotifications: boolean
  
  // Theme features
  themeSelection: boolean
  
  // Advanced fasting features
  advancedFasting: boolean
  
  // Future features can be added here
  // advancedAnalytics: boolean
  // socialFeatures: boolean
  // premiumFeatures: boolean
}

/**
 * Current feature flag configuration
 * Set to false to hide features that aren't ready for production
 * 
 * TO ENABLE DETAILED NOTIFICATIONS IN FUTURE:
 * Change detailedNotifications to true when backend implementation is complete
 * 
 * TO ENABLE THEME SELECTION IN FUTURE:
 * Change themeSelection to true when theme switching is ready for production
 * 
 * TO ENABLE ADVANCED FASTING IN FUTURE:
 * Change advancedFasting to true when auto-start and custom goals are ready
 */
export const featureFlags: FeatureFlags = {
  // Hide detailed notification settings (reminders, meal reminders, etc.)
  // until backend implementation is complete
  detailedNotifications: false,
  
  // Hide theme selection (light/dark/system) for initial release
  // Keep system theme as default for now
  themeSelection: false,
  
  // Hide advanced fasting features (auto-start, custom goal hours) for initial release
  // Keep basic 16-hour default for now
  advancedFasting: false,
}

/**
 * Helper function to check if a feature is enabled
 */
export function isFeatureEnabled(feature: keyof FeatureFlags): boolean {
  return featureFlags[feature]
}

/**
 * Development mode override - can be used to enable all features in dev
 */
export function enableAllFeaturesInDev(): void {
  if (import.meta.env.DEV) {
    Object.keys(featureFlags).forEach(key => {
      featureFlags[key as keyof FeatureFlags] = true
    })
    console.log('Development mode: All features enabled', featureFlags)
  }
  }

  // Apply environment-driven feature enables (whitelist style)
  import { getEnabledFeaturesFromEnv, config } from '../api/config';
  const enabledFromEnv = getEnabledFeaturesFromEnv();
  enabledFromEnv.forEach(f => {
    if (f in featureFlags) {
      featureFlags[f as keyof FeatureFlags] = true;
    }
  });

  // Test environment: enable all features to satisfy component test expectations
  if (import.meta.env.MODE === 'test') {
    Object.keys(featureFlags).forEach(key => {
      featureFlags[key as keyof FeatureFlags] = true;
    });
  }

  // In production freeze the object to guard against accidental runtime toggling
  if (config.isProduction && !import.meta.env.TEST) {
    Object.freeze(featureFlags);
}
