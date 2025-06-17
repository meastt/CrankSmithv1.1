// lib/pwa-utils.js - PWA utilities and service worker registration
export const registerServiceWorker = () => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', async () => {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js', {
            scope: '/'
          });
          
          console.log('ServiceWorker registered successfully:', registration.scope);
          
          // Handle updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New content is available, prompt user to refresh
                  showUpdateNotification();
                }
              });
            }
          });
          
          // Check for updates periodically
          setInterval(() => {
            registration.update();
          }, 60000); // Check every minute
          
        } catch (error) {
          console.log('ServiceWorker registration failed:', error);
        }
      });
    }
  };
  
  const showUpdateNotification = () => {
    if (window.confirm('A new version of CrankSmith is available. Would you like to refresh to get the latest features?')) {
      window.location.reload();
    }
  };
  
  export const checkIfPWA = () => {
    // Check if app is running in standalone mode
    return window.matchMedia('(display-mode: standalone)').matches ||
           window.navigator.standalone ||
           document.referrer.includes('android-app://');
  };
  
  export const getInstallPrompt = () => {
    return new Promise((resolve) => {
      let deferredPrompt = null;
      
      const handleBeforeInstallPrompt = (e) => {
        e.preventDefault();
        deferredPrompt = e;
        resolve(deferredPrompt);
      };
      
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      
      // Clean up listener after 10 seconds if no prompt
      setTimeout(() => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        if (!deferredPrompt) {
          resolve(null);
        }
      }, 10000);
    });
  };
  
  export const installPWA = async (deferredPrompt) => {
    if (!deferredPrompt) return false;
    
    try {
      const result = await deferredPrompt.prompt();
      return result.outcome === 'accepted';
    } catch (error) {
      console.error('PWA install failed:', error);
      return false;
    }
  };
  
  // Detect mobile device
  export const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           window.innerWidth <= 768;
  };
  
  // Check if running on iOS
  export const isIOS = () => {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  };
  
  // Check if app can be installed
  export const canInstall = () => {
    return 'serviceWorker' in navigator && 
           !checkIfPWA() && 
           (isMobileDevice() || window.innerWidth <= 1024);
  };
  
  // Save data with background sync fallback
  export const saveWithSync = async (data, endpoint) => {
    try {
      // Try to save immediately
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        return await response.json();
      }
      
      throw new Error('Network request failed');
    } catch (error) {
      console.log('Save failed, queuing for background sync:', error);
      
      // Save to localStorage for later sync
      const pendingData = JSON.parse(localStorage.getItem('pending_saves') || '[]');
      pendingData.push({
        data,
        endpoint,
        timestamp: Date.now()
      });
      localStorage.setItem('pending_saves', JSON.stringify(pendingData));
      
      // Register background sync
      if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
        const registration = await navigator.serviceWorker.ready;
        await registration.sync.register('background-sync-configs');
      }
      
      return { offline: true, queued: true };
    }
  };
  
  // Get network status
  export const getNetworkStatus = () => {
    return {
      online: navigator.onLine,
      connection: navigator.connection || navigator.mozConnection || navigator.webkitConnection,
      effectiveType: (navigator.connection || {}).effectiveType || 'unknown'
    };
  };
  
  // Monitor network status changes
  export const onNetworkChange = (callback) => {
    const handleOnline = () => callback({ online: true });
    const handleOffline = () => callback({ online: false });
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Return cleanup function
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  };
  
  // Cache management
  export const clearAppCache = async () => {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
    }
    
    // Clear localStorage
    localStorage.clear();
    
    // Unregister service worker
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(
        registrations.map(registration => registration.unregister())
      );
    }
  };
  
  // Performance monitoring
  export const measurePerformance = (name, fn) => {
    const start = performance.now();
    const result = fn();
    
    if (result instanceof Promise) {
      return result.finally(() => {
        const duration = performance.now() - start;
        console.log(`Performance: ${name} took ${duration.toFixed(2)}ms`);
      });
    } else {
      const duration = performance.now() - start;
      console.log(`Performance: ${name} took ${duration.toFixed(2)}ms`);
      return result;
    }
  };
  
  // Local storage with compression for large data
  export const saveCompressed = (key, data) => {
    try {
      const jsonString = JSON.stringify(data);
      // Simple compression: remove unnecessary whitespace
      const compressed = jsonString.replace(/\s+/g, ' ');
      localStorage.setItem(key, compressed);
      return true;
    } catch (error) {
      console.error('Failed to save compressed data:', error);
      return false;
    }
  };
  
  export const loadCompressed = (key) => {
    try {
      const compressed = localStorage.getItem(key);
      return compressed ? JSON.parse(compressed) : null;
    } catch (error) {
      console.error('Failed to load compressed data:', error);
      return null;
    }
  };
  
  // Haptic feedback for mobile
  export const hapticFeedback = (type = 'light') => {
    if ('vibrate' in navigator) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [50],
        success: [10, 50, 10],
        error: [100, 50, 100]
      };
      
      navigator.vibrate(patterns[type] || patterns.light);
    }
  };
  
  // Share API wrapper
  export const shareContent = async (data) => {
    if (navigator.share) {
      try {
        await navigator.share(data);
        return { success: true, method: 'native' };
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Share failed:', error);
        }
        return { success: false, error };
      }
    } else if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(data.url || data.text || '');
        return { success: true, method: 'clipboard' };
      } catch (error) {
        console.error('Clipboard write failed:', error);
        return { success: false, error };
      }
    } else {
      return { success: false, error: 'Share not supported' };
    }
  };
  
  // Battery status (if available)
  export const getBatteryStatus = async () => {
    if ('getBattery' in navigator) {
      try {
        const battery = await navigator.getBattery();
        return {
          level: Math.round(battery.level * 100),
          charging: battery.charging,
          chargingTime: battery.chargingTime,
          dischargingTime: battery.dischargingTime
        };
      } catch (error) {
        return null;
      }
    }
    return null;
  };
  
  // App info for debugging
  export const getAppInfo = () => {
    return {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      language: navigator.language,
      languages: navigator.languages,
      hardwareConcurrency: navigator.hardwareConcurrency,
      deviceMemory: navigator.deviceMemory,
      connection: navigator.connection ? {
        effectiveType: navigator.connection.effectiveType,
        downlink: navigator.connection.downlink,
        rtt: navigator.connection.rtt
      } : null,
      screen: {
        width: screen.width,
        height: screen.height,
        availWidth: screen.availWidth,
        availHeight: screen.availHeight,
        pixelRatio: window.devicePixelRatio
      },
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      isPWA: checkIfPWA(),
      isMobile: isMobileDevice(),
      isIOS: isIOS(),
      canInstall: canInstall()
    };
  };