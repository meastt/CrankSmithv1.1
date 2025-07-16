// lib/pwa-enhanced.ts - Enhanced PWA utilities with offline support and background sync
import { ServiceWorkerMessage } from '../types';

let swRegistration: ServiceWorkerRegistration | null = null;
let installPromptEvent: any = null;

// Enhanced service worker registration
export async function registerEnhancedServiceWorker(): Promise<void> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    console.log('Service Worker not supported');
    return;
  }

  try {
    // Unregister old service worker first
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const registration of registrations) {
      if (registration.scope.includes('sw.js')) {
        await registration.unregister();
        console.log('Unregistered old service worker');
      }
    }

    // Register enhanced service worker
    swRegistration = await navigator.serviceWorker.register('/sw-enhanced.js', {
      scope: '/',
      updateViaCache: 'none'
    });

    console.log('Enhanced Service Worker registered successfully');

    // Handle service worker updates
    swRegistration.addEventListener('updatefound', () => {
      const newWorker = swRegistration?.installing;
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New version available
            showUpdatePrompt();
          }
        });
      }
    });

    // Listen for messages from service worker
    navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);

    // Cache component data for offline use
    await cacheComponentData();

  } catch (error) {
    console.error('Enhanced Service Worker registration failed:', error);
  }
}

// Handle messages from service worker
function handleServiceWorkerMessage(event: MessageEvent<ServiceWorkerMessage>): void {
  const { type, payload } = event.data;

  switch (type) {
    case 'CACHE_UPDATED':
      console.log('Cache updated:', payload);
      break;
    case 'OFFLINE_READY':
      showOfflineReadyNotification();
      break;
    case 'UPDATE_AVAILABLE':
      showUpdatePrompt();
      break;
  }
}

// Cache component data for offline calculations
export async function cacheComponentData(): Promise<void> {
  if (!swRegistration) return;

  try {
    // Import component data
    const { componentDatabase } = await import('./components');
    
    // Send to service worker for caching
    if (swRegistration.active) {
      swRegistration.active.postMessage({
        type: 'CACHE_COMPONENT_DATA',
        payload: componentDatabase
      });
    }

    console.log('Component data sent to service worker for caching');
  } catch (error) {
    console.error('Failed to cache component data:', error);
  }
}

// Enhanced PWA install functionality
export function initializeEnhancedPWA(): void {
  // Listen for install prompt
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    installPromptEvent = e;
    console.log('PWA install prompt captured');
  });

  // Handle app installed
  window.addEventListener('appinstalled', () => {
    console.log('PWA installed successfully');
    installPromptEvent = null;
    
    // Track installation
    if (typeof (window as any).gtag !== 'undefined') {
      (window as any).gtag('event', 'pwa_install', {
        event_category: 'engagement',
        event_label: 'PWA Installation'
      });
    }
  });

  // Register service worker
  registerEnhancedServiceWorker();
}

// Enhanced install PWA function
export async function installEnhancedPWA(): Promise<boolean> {
  if (!installPromptEvent) {
    console.log('No install prompt available');
    return false;
  }

  try {
    const result = await installPromptEvent.prompt();
    const userChoice = await result.userChoice;
    
    if (userChoice === 'accepted') {
      console.log('User accepted PWA install');
      return true;
    } else {
      console.log('User dismissed PWA install');
      return false;
    }
  } catch (error) {
    console.error('PWA install failed:', error);
    return false;
  } finally {
    installPromptEvent = null;
  }
}

// Check if PWA install is available
export function canInstallEnhancedPWA(): boolean {
  return !!installPromptEvent;
}

// Offline configuration management
export async function saveConfigurationOffline(config: any): Promise<void> {
  if (!swRegistration?.active) {
    console.warn('Service worker not available for offline save');
    return;
  }

  try {
    swRegistration.active.postMessage({
      type: 'SAVE_OFFLINE_CONFIG',
      payload: config
    });

    console.log('Configuration saved for offline sync');
  } catch (error) {
    console.error('Failed to save configuration offline:', error);
  }
}

// Get cache status
export async function getCacheStatus(): Promise<any> {
  return new Promise((resolve) => {
    if (!swRegistration?.active) {
      resolve({ hasOfflineData: false, hasPendingSync: false });
      return;
    }

    const messageChannel = new MessageChannel();
    messageChannel.port1.onmessage = (event) => {
      if (event.data.type === 'CACHE_STATUS') {
        resolve(event.data.payload);
      }
    };

    swRegistration.active.postMessage(
      { type: 'REQUEST_CACHE_STATUS' },
      [messageChannel.port2]
    );

    // Timeout after 5 seconds
    setTimeout(() => {
      resolve({ hasOfflineData: false, hasPendingSync: false });
    }, 5000);
  });
}

// Connection status management
export class ConnectionManager {
  private static instance: ConnectionManager;
  private isOnline: boolean = navigator.onLine;
  private listeners: Set<(online: boolean) => void> = new Set();

  private constructor() {
    window.addEventListener('online', this.handleOnline.bind(this));
    window.addEventListener('offline', this.handleOffline.bind(this));
  }

  static getInstance(): ConnectionManager {
    if (!ConnectionManager.instance) {
      ConnectionManager.instance = new ConnectionManager();
    }
    return ConnectionManager.instance;
  }

  private handleOnline(): void {
    this.isOnline = true;
    this.notifyListeners();
    console.log('Connection restored');
  }

  private handleOffline(): void {
    this.isOnline = false;
    this.notifyListeners();
    console.log('Connection lost');
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.isOnline));
  }

  public addListener(listener: (online: boolean) => void): void {
    this.listeners.add(listener);
  }

  public removeListener(listener: (online: boolean) => void): void {
    this.listeners.delete(listener);
  }

  public get online(): boolean {
    return this.isOnline;
  }
}

// Enhanced notifications
function showOfflineReadyNotification(): void {
  if ('toast' in window) {
    (window as any).toast.success('App is ready to work offline!', 3000);
  }
}

function showUpdatePrompt(): void {
  if ('toast' in window) {
    (window as any).toast.info('A new version is available. Refresh to update.', 8000);
  }
}

// Network-aware fetch wrapper
export async function networkAwareFetch(
  url: string, 
  options: RequestInit = {}
): Promise<Response> {
  try {
    const response = await fetch(url, {
      ...options,
      cache: 'no-cache'
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return response;
  } catch (error) {
    console.warn('Network request failed, checking cache:', url);
    
    // Try to get cached version if available
    if ('caches' in window) {
      const cache = await caches.open('cranksmith-components-v2.0.0');
      const cached = await cache.match(url);
      
      if (cached) {
        console.log('Returning cached response for:', url);
        return cached;
      }
    }

    throw error;
  }
}

// Offline-first calculation wrapper
export async function offlineCalculateResults(
  currentSetup: any,
  proposedSetup: any,
  speedUnit: string
): Promise<any> {
  try {
    // Try to import calculation function directly
    const { calculateRealPerformance } = await import('./calculateRealPerformance');
    return calculateRealPerformance(currentSetup, proposedSetup, speedUnit);
  } catch (error) {
    console.error('Offline calculation failed:', error);
    throw new Error('Calculation temporarily unavailable');
  }
}

// Export singleton connection manager instance
export const connectionManager = ConnectionManager.getInstance();