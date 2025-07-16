// public/sw-enhanced.js - Advanced Service Worker for PWA with offline capabilities
const CACHE_VERSION = '2.0.0';
const STATIC_CACHE_NAME = `cranksmith-static-v${CACHE_VERSION}`;
const DYNAMIC_CACHE_NAME = `cranksmith-dynamic-v${CACHE_VERSION}`;
const COMPONENTS_CACHE_NAME = `cranksmith-components-v${CACHE_VERSION}`;
const CALCULATIONS_CACHE_NAME = `cranksmith-calculations-v${CACHE_VERSION}`;

// Critical files for offline functionality
const STATIC_ASSETS = [
  '/',
  '/mobile',
  '/calculator',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/offline.html' // We'll create this
];

// Component data endpoints to cache
const COMPONENT_ENDPOINTS = [
  '/api/components-data',
  '/lib/components.js'
];

// Install event - cache critical assets
self.addEventListener('install', (event) => {
  console.log('Enhanced SW: Installing...');
  
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE_NAME).then(cache => {
        console.log('Enhanced SW: Caching static assets');
        return cache.addAll(STATIC_ASSETS.filter(asset => 
          !asset.includes('offline.html') // Skip if doesn't exist yet
        ));
      }),
      caches.open(COMPONENTS_CACHE_NAME).then(cache => {
        console.log('Enhanced SW: Pre-caching component data');
        // Pre-cache component database for offline calculations
        return cache.add('/lib/components.js');
      })
    ]).catch(error => {
      console.warn('Enhanced SW: Failed to cache some assets', error);
      return Promise.resolve();
    })
  );
  
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Enhanced SW: Activating...');
  
  event.waitUntil(
    Promise.all([
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName.includes('cranksmith') && 
                !cacheName.includes(CACHE_VERSION)) {
              console.log('Enhanced SW: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      self.clients.claim()
    ])
  );
});

// Fetch event - intelligent caching strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle different types of requests
  if (request.method === 'GET') {
    if (url.pathname.includes('/api/riley')) {
      // Riley API - cache successful responses
      event.respondWith(rileyAPIStrategy(request));
    } else if (url.pathname.includes('/api/') || url.pathname.includes('/lib/components')) {
      // API requests - cache with network first strategy
      event.respondWith(networkFirstStrategy(request, COMPONENTS_CACHE_NAME));
    } else if (STATIC_ASSETS.some(asset => url.pathname.includes(asset))) {
      // Static assets - cache first strategy
      event.respondWith(cacheFirstStrategy(request, STATIC_CACHE_NAME));
    } else if (url.pathname.includes('/_next/')) {
      // Next.js assets - cache first with long TTL
      event.respondWith(cacheFirstStrategy(request, DYNAMIC_CACHE_NAME));
    } else {
      // Other requests - network first with fallback
      event.respondWith(networkFirstWithFallback(request));
    }
  }
});

// Cache-first strategy for static assets
async function cacheFirstStrategy(request, cacheName) {
  try {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);
    
    if (cached) {
      // Return cached version and update in background
      fetchAndCache(request, cacheName);
      return cached;
    }
    
    return await fetchAndCache(request, cacheName);
  } catch (error) {
    console.error('Cache-first strategy failed:', error);
    return new Response('Offline', { status: 503 });
  }
}

// Network-first strategy for dynamic content
async function networkFirstStrategy(request, cacheName) {
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.log('Network failed, checking cache:', request.url);
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);
    
    if (cached) {
      return cached;
    }
    
    // Return offline response for failed API calls
    return new Response(JSON.stringify({
      success: false,
      error: 'This feature requires an internet connection',
      offline: true
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Network-first with offline page fallback
async function networkFirstWithFallback(request) {
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    const cached = await cache.match(request);
    
    if (cached) {
      return cached;
    }
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      const offlineCache = await caches.open(STATIC_CACHE_NAME);
      const offlinePage = await offlineCache.match('/offline.html');
      return offlinePage || new Response('Offline', { status: 503 });
    }
    
    return new Response('Offline', { status: 503 });
  }
}

// Special handling for Riley AI with offline fallback
async function rileyAPIStrategy(request) {
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      // Cache successful Riley responses
      const cache = await caches.open(CALCULATIONS_CACHE_NAME);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    // Return offline Riley response
    return new Response(JSON.stringify({
      success: false,
      response: "I'm currently offline, but you can still use the gear calculator! The component database and calculations work without an internet connection.",
      offline: true,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Helper function to fetch and cache
async function fetchAndCache(request, cacheName) {
  const response = await fetch(request);
  
  if (response.ok) {
    const cache = await caches.open(cacheName);
    cache.put(request, response.clone());
  }
  
  return response;
}

// Background sync for saved configurations
self.addEventListener('sync', (event) => {
  console.log('Enhanced SW: Background sync triggered', event.tag);
  
  if (event.tag === 'sync-saved-configs') {
    event.waitUntil(syncSavedConfigurations());
  }
});

// Sync saved configurations when back online
async function syncSavedConfigurations() {
  try {
    const cache = await caches.open(CALCULATIONS_CACHE_NAME);
    const pendingConfigs = await cache.match('/pending-sync-configs');
    
    if (pendingConfigs) {
      const configs = await pendingConfigs.json();
      
      // Attempt to sync each configuration
      for (const config of configs) {
        try {
          await fetch('/api/save-config', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(config)
          });
        } catch (error) {
          console.warn('Failed to sync config:', config.id);
        }
      }
      
      // Clear pending sync cache
      await cache.delete('/pending-sync-configs');
      
      // Notify all clients
      const clients = await self.clients.matchAll();
      clients.forEach(client => {
        client.postMessage({
          type: 'SYNC_COMPLETE',
          payload: { configCount: configs.length }
        });
      });
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Message handling for communication with main thread
self.addEventListener('message', (event) => {
  const { type, payload } = event.data;
  
  switch (type) {
    case 'CACHE_COMPONENT_DATA':
      cacheComponentData(payload);
      break;
    case 'SAVE_OFFLINE_CONFIG':
      saveOfflineConfiguration(payload);
      break;
    case 'REQUEST_CACHE_STATUS':
      sendCacheStatus(event.source);
      break;
  }
});

// Cache component data for offline use
async function cacheComponentData(data) {
  try {
    const cache = await caches.open(COMPONENTS_CACHE_NAME);
    await cache.put('/cached-components', new Response(JSON.stringify(data)));
    console.log('Enhanced SW: Component data cached for offline use');
  } catch (error) {
    console.error('Failed to cache component data:', error);
  }
}

// Save configuration for background sync
async function saveOfflineConfiguration(config) {
  try {
    const cache = await caches.open(CALCULATIONS_CACHE_NAME);
    const existing = await cache.match('/pending-sync-configs');
    
    let configs = [];
    if (existing) {
      configs = await existing.json();
    }
    
    configs.push({
      ...config,
      id: Date.now(),
      timestamp: new Date().toISOString()
    });
    
    await cache.put('/pending-sync-configs', new Response(JSON.stringify(configs)));
    
    // Register for background sync
    await self.registration.sync.register('sync-saved-configs');
    
    console.log('Enhanced SW: Configuration saved for sync');
  } catch (error) {
    console.error('Failed to save offline configuration:', error);
  }
}

// Send cache status to client
async function sendCacheStatus(client) {
  try {
    const cacheNames = await caches.keys();
    const status = {
      hasOfflineData: cacheNames.some(name => name.includes('components')),
      hasPendingSync: false,
      cacheSize: cacheNames.length
    };
    
    // Check for pending sync data
    const cache = await caches.open(CALCULATIONS_CACHE_NAME);
    const pending = await cache.match('/pending-sync-configs');
    if (pending) {
      const configs = await pending.json();
      status.hasPendingSync = configs.length > 0;
      status.pendingCount = configs.length;
    }
    
    client.postMessage({
      type: 'CACHE_STATUS',
      payload: status
    });
  } catch (error) {
    console.error('Failed to get cache status:', error);
  }
}