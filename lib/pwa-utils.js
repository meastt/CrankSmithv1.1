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

// FIXED: Smart mobile routing with less intrusion
export const handleMobileRouting = (router) => {
  if (typeof window === 'undefined') return;
  
  const isMobile = isMobileDevice();
  const isOnMobilePage = router.pathname.startsWith('/mobile');
  const isOnLandingPage = router.pathname === '/';
  
  // Check user preferences
  const hasOptedOutMobile = localStorage.getItem('cranksmith_desktop_preference') === 'true';
  const hasSeenSuggestion = localStorage.getItem('cranksmith_mobile_suggested') === 'true';
  
  // Only show suggestion once, and only on specific pages
  const shouldSuggestMobile = isMobile && 
                              !isOnMobilePage && 
                              !isOnLandingPage && 
                              !hasOptedOutMobile && 
                              !hasSeenSuggestion &&
                              (router.pathname === '/calculator' || router.pathname === '/garage');
  
  if (shouldSuggestMobile) {
    // Mark as suggested to avoid repeated prompts
    localStorage.setItem('cranksmith_mobile_suggested', 'true');
    
    // Show subtle banner instead of popup
    showMobileSuggestionBanner(router);
  }
};

// Subtle mobile suggestion banner
const showMobileSuggestionBanner = (router) => {
  // Don't show if there's already a banner
  if (document.querySelector('[data-mobile-banner]')) return;
  
  const banner = document.createElement('div');
  banner.setAttribute('data-mobile-banner', 'true');
  banner.className = 'fixed bottom-4 left-4 right-4 bg-blue-600 text-white p-3 rounded-lg shadow-lg z-40 transition-all duration-300 transform translate-y-full';
  banner.innerHTML = `
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span>📱</span>
        <span class="text-sm">Better mobile experience available</span>
      </div>
      <div class="flex gap-2">
        <button onclick="window.mobileRouterPush('/mobile')" class="bg-white text-blue-600 px-3 py-1 rounded text-sm font-medium">
          Try Mobile
        </button>
        <button onclick="window.dismissMobileBanner()" class="text-white/80 hover:text-white">
          ✕
        </button>
      </div>
    </div>
  `;
  
  // Add helper functions to window
  window.mobileRouterPush = (path) => {
    router.push(path);
    banner.remove();
  };
  
  window.dismissMobileBanner = () => {
    localStorage.setItem('cranksmith_desktop_preference', 'true');
    banner.classList.add('translate-y-full');
    setTimeout(() => banner.remove(), 300);
  };
  
  document.body.appendChild(banner);
  
  // Slide up
  setTimeout(() => {
    banner.classList.remove('translate-y-full');
  }, 100);
  
  // Auto-dismiss after 15 seconds
  setTimeout(() => {
    if (banner.parentElement) {
      banner.classList.add('translate-y-full');
      setTimeout(() => banner.remove(), 300);
    }
  }, 15000);
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