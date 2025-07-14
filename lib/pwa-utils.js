// lib/pwa-utils.js - PWA utilities and service worker registration
let swRegistration = null;
let updateAvailable = false;

export const registerServiceWorker = () => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', async () => {
        try {
          swRegistration = await navigator.serviceWorker.register('/sw.js', {
            scope: '/'
          });
          
          console.log('ServiceWorker registered successfully:', swRegistration.scope);
          
          // Handle updates with proper error handling
          swRegistration.addEventListener('updatefound', handleUpdateFound);
          
          // Handle controller change (when new SW takes over)
          navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);
          
          // Check for updates periodically (every 5 minutes instead of 1)
          setInterval(() => {
            if (swRegistration && !updateAvailable) {
              swRegistration.update().catch(error => {
                console.warn('SW update check failed:', error);
              });
            }
          }, 300000); // Check every 5 minutes
          
          // Check for updates when page becomes visible
          document.addEventListener('visibilitychange', () => {
            if (!document.hidden && swRegistration && !updateAvailable) {
              swRegistration.update().catch(error => {
                console.warn('SW update check failed:', error);
              });
            }
          });
          
        } catch (error) {
          console.error('ServiceWorker registration failed:', error);
          // Optionally notify user about offline functionality being unavailable
          if (process.env.NODE_ENV === 'development') {
            console.warn('App will work but offline features may be limited');
          }
        }
      });
    }
  };

  const handleUpdateFound = () => {
    const newWorker = swRegistration.installing;
    if (!newWorker) return;
    
    updateAvailable = true;
    
    newWorker.addEventListener('statechange', () => {
      switch (newWorker.state) {
        case 'installed':
          if (navigator.serviceWorker.controller) {
            // New content is available
            showUpdateNotification();
          } else {
            // Content is cached for first time
            showInstallNotification();
          }
          break;
        case 'redundant':
          // Installation failed
          console.warn('New service worker installation failed');
          updateAvailable = false;
          break;
        case 'activated':
          // New SW has taken control
          updateAvailable = false;
          break;
      }
    });
  };

  const handleControllerChange = () => {
    // New service worker has taken control
    showReloadNotification();
  };

  const showUpdateNotification = () => {
    // Create a more user-friendly notification
    const notification = createUpdateNotification();
    document.body.appendChild(notification);
    
    // Auto-dismiss after 10 seconds if no action
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 10000);
  };

  const showInstallNotification = () => {
    // First time installation - optional notification
    console.log('App is ready for offline use');
    
    // Show a subtle notification
    const toast = createToast('App is ready for offline use! 🎉', 'success');
    document.body.appendChild(toast);
    
    setTimeout(() => {
      if (toast.parentNode) {
        toast.remove();
      }
    }, 3000);
  };

  const showReloadNotification = () => {
    // Automatic reload notification
    const toast = createToast('App updated! Reloading...', 'info');
    document.body.appendChild(toast);
    
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const createUpdateNotification = () => {
    const notification = document.createElement('div');
    notification.className = 'sw-update-notification';
    notification.innerHTML = `
      <div class="sw-update-notification" style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--bg-secondary);
        border: 1px solid var(--accent-blue);
        border-radius: 12px;
        padding: 16px;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        animation: slideInRight 0.3s ease-out;
      ">
        <div style="display: flex; align-items: flex-start; gap: 12px;">
          <div style="flex: 1;">
            <h4 style="margin: 0 0 8px 0; color: var(--text-primary); font-size: 16px; font-weight: 600;">
              Update Available
            </h4>
            <p style="margin: 0 0 12px 0; color: var(--text-secondary); font-size: 14px; line-height: 1.4;">
              A new version of CrankSmith is ready with improvements and bug fixes.
            </p>
            <div style="display: flex; gap: 8px;">
              <button onclick="this.closest('.sw-update-notification').remove(); window.location.reload();" 
                      style="
                        background: var(--accent-blue);
                        color: white;
                        border: none;
                        border-radius: 6px;
                        padding: 8px 16px;
                        font-size: 14px;
                        cursor: pointer;
                        transition: background 0.2s;
                      ">
                Update Now
              </button>
              <button onclick="this.closest('.sw-update-notification').remove();" 
                      style="
                        background: transparent;
                        color: var(--text-secondary);
                        border: 1px solid var(--border-light);
                        border-radius: 6px;
                        padding: 8px 16px;
                        font-size: 14px;
                        cursor: pointer;
                        transition: all 0.2s;
                      ">
                Later
              </button>
            </div>
          </div>
          <button onclick="this.closest('.sw-update-notification').remove();" 
                  style="
                    background: none;
                    border: none;
                    color: var(--text-tertiary);
                    cursor: pointer;
                    padding: 4px;
                    line-height: 1;
                  ">
            ×
          </button>
        </div>
      </div>
    `;
    
    return notification;
  };

  const createToast = (message, type = 'info') => {
    const toast = document.createElement('div');
    const bgColor = type === 'success' ? 'var(--success-green)' : 
                   type === 'error' ? 'var(--error-red)' : 'var(--accent-blue)';
    
    toast.innerHTML = `
      <div class="toast-notification" style="
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: ${bgColor};
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        animation: slideInUp 0.3s ease-out;
      ">
        ${message}
      </div>
    `;
    
    return toast;
  };

  // Add CSS animations
  if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes slideInUp {
        from { transform: translate(-50%, 100%); opacity: 0; }
        to { transform: translate(-50%, 0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }

  // Export function to manually trigger update check
  export const checkForUpdates = () => {
    if (swRegistration && !updateAvailable) {
      return swRegistration.update();
    }
    return Promise.resolve();
  };

  // Export function to skip waiting and activate new SW immediately
  export const skipWaiting = () => {
    if (swRegistration && swRegistration.waiting) {
      swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
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