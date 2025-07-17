// lib/pwa-utils.js - FIXED VERSION
// Critical Bug Fix: Simplified mobile detection and improved service worker handling
// Quick Win: Non-intrusive mobile suggestions

let swRegistration = null;
let updateAvailable = false;
let updateInterval = null;

// Improved mobile detection
export const isMobileDevice = () => {
  if (typeof window === 'undefined') return false;
  
  // Check user agent
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
  
  // Check screen size
  const isSmallScreen = window.innerWidth <= 768;
  
  // Check touch capability
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  return mobileRegex.test(userAgent) || (isSmallScreen && isTouchDevice);
};

// FIXED: Robust service worker registration
export const registerServiceWorker = () => {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        swRegistration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/'
        });
        
        console.log('ServiceWorker registered:', swRegistration.scope);
        
        // Handle updates
        swRegistration.addEventListener('updatefound', handleUpdateFound);
        navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);
        
        // Check for updates every 10 minutes (reduced frequency)
        updateInterval = setInterval(() => {
          if (swRegistration && !updateAvailable && !document.hidden) {
            swRegistration.update().catch(error => {
              console.warn('SW update check failed:', error);
            });
          }
        }, 600000); // 10 minutes
        
        // Check for updates when page becomes visible
        document.addEventListener('visibilitychange', () => {
          if (!document.hidden && swRegistration && !updateAvailable) {
            swRegistration.update().catch(() => {
              // Silently fail - not critical
            });
          }
        });
        
      } catch (error) {
        console.warn('ServiceWorker registration failed:', error);
        // Continue without service worker - app still works
      }
    });
  }
};

const handleUpdateFound = () => {
  const newWorker = swRegistration.installing;
  if (!newWorker) return;
  
  updateAvailable = true;
  
  newWorker.addEventListener('statechange', () => {
    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
      // New content available - show subtle notification
      showUpdateNotification();
    }
  });
};

const handleControllerChange = () => {
  // Reload page when new service worker takes control
  window.location.reload();
};

// Subtle update notification
const showUpdateNotification = () => {
  // Only show if user isn't actively calculating
  if (document.hidden) return;
  
  const notification = document.createElement('div');
  notification.className = 'fixed top-4 right-4 bg-blue-600 text-white p-3 rounded-lg shadow-lg z-50 transition-all duration-300 transform translate-x-full';
  notification.innerHTML = `
    <div class="flex items-center gap-2">
      <span>🔄</span>
      <span class="text-sm">Update available</span>
      <button onclick="window.location.reload()" class="bg-white text-blue-600 px-2 py-1 rounded text-xs font-medium ml-2">
        Update
      </button>
      <button onclick="this.parentElement.parentElement.remove()" class="text-white/80 hover:text-white ml-1">
        ✕
      </button>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Slide in
  setTimeout(() => {
    notification.classList.remove('translate-x-full');
  }, 100);
  
  // Auto-remove after 10 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.classList.add('translate-x-full');
      setTimeout(() => notification.remove(), 300);
    }
  }, 10000);
};

// Mobile user preferences management
const MOBILE_PREFERENCES = {
  DESKTOP_PREFERRED: 'cranksmith_desktop_preference',
  MOBILE_SUGGESTED_TODAY: 'cranksmith_mobile_suggested_today',
  LAST_SUGGESTION_DATE: 'cranksmith_last_suggestion_date'
};

// Check if we should show mobile suggestion today
const shouldShowMobileSuggestionToday = () => {
  if (typeof window === 'undefined') return false;
  
  const today = new Date().toDateString();
  const lastSuggestionDate = localStorage.getItem(MOBILE_PREFERENCES.LAST_SUGGESTION_DATE);
  const hasSeenToday = localStorage.getItem(MOBILE_PREFERENCES.MOBILE_SUGGESTED_TODAY) === 'true';
  
  // Reset daily flag if it's a new day
  if (lastSuggestionDate !== today) {
    localStorage.removeItem(MOBILE_PREFERENCES.MOBILE_SUGGESTED_TODAY);
    return true;
  }
  
  return !hasSeenToday;
};

// Mark mobile suggestion as shown for today
const markMobileSuggestionShown = () => {
  if (typeof window === 'undefined') return;
  
  const today = new Date().toDateString();
  localStorage.setItem(MOBILE_PREFERENCES.MOBILE_SUGGESTED_TODAY, 'true');
  localStorage.setItem(MOBILE_PREFERENCES.LAST_SUGGESTION_DATE, today);
};

// User preference management
export const getUserMobilePreference = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(MOBILE_PREFERENCES.DESKTOP_PREFERRED);
};

export const setUserPrefersMobile = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(MOBILE_PREFERENCES.DESKTOP_PREFERRED);
};

export const setUserPrefersDesktop = () => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(MOBILE_PREFERENCES.DESKTOP_PREFERRED, 'true');
  markMobileSuggestionShown();
};

// FIXED: Non-intrusive mobile routing with Toast notifications
export const handleMobileRouting = (router) => {
  if (typeof window === 'undefined') return;
  
  const isMobile = isMobileDevice();
  const isOnMobilePage = router.pathname.startsWith('/mobile');
  
  // Don't show suggestions if:
  // 1. Not on mobile device
  // 2. Already on mobile page
  // 3. User prefers desktop
  // 4. Already suggested today
  if (!isMobile || isOnMobilePage) return;
  
  const userPrefersDesktop = getUserMobilePreference() === 'true';
  const canShowToday = shouldShowMobileSuggestionToday();
  
  if (userPrefersDesktop || !canShowToday) return;
  
  // Only suggest on calculator and specific useful pages
  const suggestOnPages = ['/calculator', '/bike-fit', '/garage', '/builder'];
  const shouldSuggest = suggestOnPages.includes(router.pathname);
  
  if (shouldSuggest) {
    // Use a small delay to ensure page is loaded
    setTimeout(() => {
      showMobileSuggestionToast(router);
    }, 2000);
  }
};

// Toast-based mobile suggestion (non-intrusive)
const showMobileSuggestionToast = (router) => {
  // Mark as shown to prevent repeat suggestions today
  markMobileSuggestionShown();
  
  // Create a custom toast notification
  const toastEvent = new CustomEvent('show-mobile-suggestion', {
    detail: {
      message: '📱 Better mobile experience available',
      type: 'info',
      duration: 8000,
      actions: [
        {
          label: 'Try Mobile',
          variant: 'primary',
          onClick: () => {
            router.push('/mobile' + router.pathname);
          }
        },
        {
          label: 'Stay on Desktop',
          variant: 'secondary',
          onClick: () => {
            setUserPrefersDesktop();
          }
        }
      ]
    }
  });
  
  // Dispatch to toast system
  if (typeof window !== 'undefined') {
    window.dispatchEvent(toastEvent);
  }
};

// Simple mobile app detection for routing
export const isMobileApp = (pathname) => {
  return pathname && pathname.startsWith('/mobile');
};

// PWA install detection
export const useInstallPrompt = () => {
  const [installPrompt, setInstallPrompt] = useState(null);
  
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);
  
  return installPrompt;
};

// Check if app is installed
export const isAppInstalled = () => {
  return window.matchMedia('(display-mode: standalone)').matches ||
         window.navigator.standalone === true;
};

// Missing PWA utility functions for compatibility
let deferredPrompt = null;

export const checkIfPWA = () => {
  if (typeof window === 'undefined') return false;
  return isAppInstalled();
};

export const canInstall = () => {
  if (typeof window === 'undefined') return false;
  return deferredPrompt !== null;
};

export const getInstallPrompt = () => {
  return deferredPrompt;
};

export const installPWA = async (prompt) => {
  if (!prompt) return false;
  
  try {
    const result = await prompt.prompt();
    const outcome = await result.userChoice;
    
    if (outcome === 'accepted') {
      deferredPrompt = null;
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error installing PWA:', error);
    return false;
  }
};

export const isIOS = () => {
  if (typeof window === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

// Initialize prompt handling
if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
  });
}

// Cleanup function for unmounting
export const cleanup = () => {
  if (updateInterval) {
    clearInterval(updateInterval);
    updateInterval = null;
  }
  
  if (swRegistration) {
    swRegistration.removeEventListener('updatefound', handleUpdateFound);
    swRegistration = null;
  }
};