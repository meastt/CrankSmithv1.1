// public/sw.js - Service Worker for PWA offline support
const CACHE_NAME = 'cranksmith-v1.0.0';
const STATIC_CACHE_NAME = 'cranksmith-static-v1.0.0';
const DYNAMIC_CACHE_NAME = 'cranksmith-dynamic-v1.0.0';

// Files to cache immediately
const STATIC_ASSETS = [
  '/mobile',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
  // Add your CSS and JS files here
  '/_next/static/css/',
  '/_next/static/chunks/',
  // Component data that should work offline
  '/api/components-data.json' // If you create this endpoint
];

// API endpoints that can be cached
const CACHEABLE_APIS = [
  '/api/components-data',
  '/api/calculations'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .catch((error) => {
        console.error('Service Worker: Failed to cache static assets', error);
      })
  );
  
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Delete old caches
            if (cacheName !== STATIC_CACHE_NAME && 
                cacheName !== DYNAMIC_CACHE_NAME && 
                cacheName !== CACHE_NAME) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
  );
  
  // Take control of all pages immediately
  self.clients.claim();
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip external requests (CDNs, APIs from other domains)
  if (!url.origin.includes(self.location.origin)) {
    return;
  }

  event.respondWith(
    // Strategy: Cache First for static assets, Network First for dynamic content
    handleRequest(request)
  );
});

async function handleRequest(request) {
  const url = new URL(request.url);
  
  // Strategy 1: Cache First (for static assets and app shell)
  if (isStaticAsset(url.pathname)) {
    return cacheFirst(request);
  }
  
  // Strategy 2: Network First (for API calls and dynamic content)
  if (isApiCall(url.pathname) || isDynamicContent(url.pathname)) {
    return networkFirst(request);
  }
  
  // Strategy 3: Stale While Revalidate (for components data)
  if (isComponentData(url.pathname)) {
    return staleWhileRevalidate(request);
  }
  
  // Default: Network First
  return networkFirst(request);
}

// Cache First Strategy - for static assets
async function cacheFirst(request) {
  try {
    const cache = await caches.open(STATIC_CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Cache First failed:', error);
    return new Response('Offline - Asset not available', { 
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Network First Strategy - for dynamic content
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Network failed, trying cache:', error);
    
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/mobile') || new Response(
        getOfflineHTML(),
        { 
          headers: { 'Content-Type': 'text/html' },
          status: 200 
        }
      );
    }
    
    return new Response('Offline - Content not available', { 
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Stale While Revalidate - for component data
async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  // Fetch in background to update cache
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => {
    // Network failed, but we might have cache
    return cachedResponse;
  });
  
  // Return cache immediately if available, otherwise wait for network
  return cachedResponse || fetchPromise;
}

// Helper functions to categorize requests
function isStaticAsset(pathname) {
  return pathname.includes('/_next/static/') ||
         pathname.includes('/icon-') ||
         pathname.includes('/manifest.json') ||
         pathname.endsWith('.png') ||
         pathname.endsWith('.jpg') ||
         pathname.endsWith('.css') ||
         pathname.endsWith('.js');
}

function isApiCall(pathname) {
  return pathname.startsWith('/api/');
}

function isDynamicContent(pathname) {
  return pathname.includes('/mobile') && !isStaticAsset(pathname);
}

function isComponentData(pathname) {
  return pathname.includes('components') || pathname.includes('calculations');
}

// Offline HTML fallback
function getOfflineHTML() {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>CrankSmith - Offline</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
            background: #010309;
            color: white;
            margin: 0;
            padding: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            text-align: center;
          }
          .offline-container {
            max-width: 400px;
            padding: 40px 20px;
          }
          .offline-icon {
            font-size: 64px;
            margin-bottom: 20px;
          }
          h1 {
            font-size: 24px;
            margin-bottom: 16px;
            color: #3B82F6;
          }
          p {
            font-size: 16px;
            line-height: 1.5;
            color: #9CA3AF;
            margin-bottom: 24px;
          }
          .retry-btn {
            background: #3B82F6;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 16px;
            cursor: pointer;
          }
        </style>
      </head>
      <body>
        <div class="offline-container">
          <div class="offline-icon">📴</div>
          <h1>You're Offline</h1>
          <p>
            No internet connection detected. Some features may not be available, 
            but you can still use cached calculations and view saved configurations.
          </p>
          <button class="retry-btn" onclick="window.location.reload()">
            Try Again
          </button>
        </div>
      </body>
    </html>
  `;
}

// Background sync for saving data when back online
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync-configs') {
    event.waitUntil(syncPendingConfigs());
  }
});

async function syncPendingConfigs() {
  // Handle any pending configuration saves when back online
  console.log('Service Worker: Syncing pending configurations...');
  
  // This would integrate with your data saving logic
  // For now, just log that sync happened
  try {
    // Check if there are pending saves in IndexedDB or localStorage
    // Send them to the server when online
    console.log('Service Worker: Sync completed');
  } catch (error) {
    console.error('Service Worker: Sync failed', error);
  }
}

// Push notifications (for future features)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.body,
      icon: '/icon-192x192.png',
      badge: '/icon-72x72.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.primaryKey
      },
      actions: [
        {
          action: 'explore',
          title: 'Open CrankSmith',
          icon: '/icon-192x192.png'
        },
        {
          action: 'close',
          title: 'Close',
          icon: '/icon-192x192.png'
        }
      ]
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/mobile')
    );
  }
});