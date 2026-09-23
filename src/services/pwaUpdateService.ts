/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { registerSW } from 'virtual:pwa-register';

export interface PWAUpdateState {
  isUpdateAvailable: boolean;
  isUpdating: boolean;
  isOfflineReady: boolean;
  lastChecked: Date | null;
  registration: ServiceWorkerRegistration | null;
  appVersion: string;
}

type PWAUpdateListener = (state: PWAUpdateState) => void;

class PWAUpdateManager {
  private static instance: PWAUpdateManager;
  private state: PWAUpdateState = {
    isUpdateAvailable: false,
    isUpdating: false,
    isOfflineReady: false,
    lastChecked: null,
    registration: null,
    appVersion: 'NASS-2026-REV-7.2'
  };

  private listeners: Set<PWAUpdateListener> = new Set();
  private updateSWFunction: ((reloadPage?: boolean) => Promise<void>) | null = null;
  private checkIntervalId: number | null = null;

  private constructor() {
    this.init();
  }

  public static getInstance(): PWAUpdateManager {
    if (!PWAUpdateManager.instance) {
      PWAUpdateManager.instance = new PWAUpdateManager();
    }
    return PWAUpdateManager.instance;
  }

  private notify() {
    this.listeners.forEach((listener) => {
      try {
        listener({ ...this.state });
      } catch (err) {
        console.error('[PWA Manager] Error notifying listener:', err);
      }
    });
  }

  public subscribe(listener: PWAUpdateListener): () => void {
    this.listeners.add(listener);
    listener({ ...this.state });
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getState(): PWAUpdateState {
    return { ...this.state };
  }

  private init() {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    try {
      this.updateSWFunction = registerSW({
        immediate: true,
        onNeedRefresh: () => {
          console.log('[PWA Manager] 🚀 New content available. Update ready for installed PWA.');
          this.state.isUpdateAvailable = true;
          this.notify();
        },
        onOfflineReady: () => {
          console.log('[PWA Manager] ✅ App cached and ready for full offline operation.');
          this.state.isOfflineReady = true;
          this.notify();
        },
        onRegisteredSW: (_swScriptUrl, registration) => {
          if (registration) {
            this.state.registration = registration;
            this.state.lastChecked = new Date();
            this.setupPeriodicUpdateChecks(registration);
            this.notify();
          }
        },
        onRegisterError: (error) => {
          console.warn('[PWA Manager] Service worker registration error:', error);
        }
      });

      // Listen for when a new service worker takes control (immediate reload / asset switch)
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('[PWA Manager] Active Service Worker controller changed. Updates active.');
        this.state.isUpdating = false;
        this.notify();
      });

      // Check on window focus and visibility change (when an installed PWA is resumed from background)
      window.addEventListener('focus', () => this.checkForUpdates());
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          this.checkForUpdates();
        }
      });

      // Check when network connection is restored
      window.addEventListener('online', () => {
        console.log('[PWA Manager] Network restored. Checking for latest summit updates...');
        this.checkForUpdates();
      });

    } catch (err) {
      console.warn('[PWA Manager] Initialization warning:', err);
    }
  }

  private setupPeriodicUpdateChecks(registration: ServiceWorkerRegistration) {
    if (this.checkIntervalId) {
      window.clearInterval(this.checkIntervalId);
    }

    // Check for updates every 10 minutes while app is open
    this.checkIntervalId = window.setInterval(() => {
      if (navigator.onLine) {
        console.log('[PWA Manager] Periodic background check for service worker updates...');
        registration.update().catch((e) => console.warn('[PWA Manager] Background update check:', e));
        this.state.lastChecked = new Date();
        this.notify();
      }
    }, 10 * 60 * 1000);
  }

  /**
   * Manually check for updates against server
   */
  public async checkForUpdates(): Promise<{ hasUpdate: boolean }> {
    if (!navigator.onLine) {
      return { hasUpdate: false };
    }

    this.state.lastChecked = new Date();
    this.notify();

    if (this.state.registration) {
      try {
        console.log('[PWA Manager] Checking for updates on service worker registration...');
        await this.state.registration.update();
        
        // If an update is waiting or installing
        const isWaiting = !!this.state.registration.waiting;
        const isInstalling = !!this.state.registration.installing;

        if (isWaiting || isInstalling) {
          this.state.isUpdateAvailable = true;
          this.notify();
          return { hasUpdate: true };
        }
      } catch (err) {
        console.warn('[PWA Manager] Check for updates failed:', err);
      }
    }

    return { hasUpdate: this.state.isUpdateAvailable };
  }

  /**
   * Apply the update immediately by reloading the active service worker
   */
  public async applyUpdate(): Promise<void> {
    this.state.isUpdating = true;
    this.notify();

    if (this.updateSWFunction) {
      try {
        await this.updateSWFunction(true);
      } catch (err) {
        console.warn('[PWA Manager] Error during updateSW execution, falling back to location reload:', err);
        window.location.reload();
      }
    } else {
      window.location.reload();
    }
  }

  /**
   * Purge old caches and reload fresh assets
   */
  public async forceHardRefresh(): Promise<void> {
    if ('caches' in window) {
      try {
        const cacheKeys = await caches.keys();
        await Promise.all(
          cacheKeys.map((key) => {
            console.log('[PWA Manager] Clearing cache:', key);
            return caches.delete(key);
          })
        );
      } catch (e) {
        console.warn('[PWA Manager] Cache purge warning:', e);
      }
    }
    window.location.reload();
  }
}

export const pwaUpdateService = PWAUpdateManager.getInstance();
