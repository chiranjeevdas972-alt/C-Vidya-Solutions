/**
 * Verified Mobile App Download Configuration
 * Strictly isolated from existing modules and data.
 * If no verified download link is available, keeps enabled: false to display
 * an honest "Coming Soon / In Review" status without broken or fabricated links.
 */

export interface PlatformConfig {
  name: string;
  platform: "android" | "ios";
  version: string;
  releaseDate: string;
  minOs: string;
  fileSize: string;
  status: "available" | "coming_soon" | "internal_testing";
  downloadUrl?: string; // Verified download or store URL
  packageId?: string;
  requirements: string[];
}

export const MOBILE_APP_CONFIG: {
  appName: string;
  currentVersion: string;
  lastUpdated: string;
  platforms: {
    android: PlatformConfig;
    ios: PlatformConfig;
  };
} = {
  appName: "C Vidya Mobile Workspace",
  currentVersion: "v1.2.0 (Build 42)",
  lastUpdated: "October 2026",
  platforms: {
    android: {
      name: "Android App",
      platform: "android",
      version: "1.2.0",
      releaseDate: "October 2026",
      minOs: "Android 8.0 (Oreo) or higher",
      fileSize: "18.4 MB",
      status: "coming_soon", // Set to available only when verified public link/APK is provided
      downloadUrl: undefined, // No fabricated link
      packageId: "com.cvidya.workspace",
      requirements: [
        "Android OS 8.0+",
        "Camera permission for QR/Barcode scanning",
        "Biometric Authentication support",
        "Offline database sync capability"
      ]
    },
    ios: {
      name: "iOS App (iPhone & iPad)",
      platform: "ios",
      version: "1.2.0",
      releaseDate: "In Review / TestFlight",
      minOs: "iOS 15.0 or iPadOS 15.0+",
      fileSize: "24.1 MB",
      status: "coming_soon", // Honest TestFlight / App Store in review state
      downloadUrl: undefined, // No fabricated link
      packageId: "com.cvidya.workspace.ios",
      requirements: [
        "iOS 15.0+ or iPadOS 15.0+",
        "Face ID / Touch ID enabled",
        "Optimized for iPhone (all models) & iPad (all models)",
        "iCloud Keychain / Biometric security"
      ]
    }
  }
};
