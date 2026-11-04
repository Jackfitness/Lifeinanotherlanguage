import type { CapacitorConfig } from '@capacitor/cli';

/**
 * Native app shell (iOS + Android). The web build in `dist/` runs inside the app.
 * Change `appId` before the first store upload: it can't be changed after release.
 */
const config: CapacitorConfig = {
  appId: 'com.lifeinanotherlanguage.app',
  appName: 'Life in Another Language',
  webDir: 'dist',
  backgroundColor: '#FFF4E6',
  ios: { contentInset: 'never', backgroundColor: '#FFF4E6' },
  android: { backgroundColor: '#FFF4E6' },
};

export default config;
