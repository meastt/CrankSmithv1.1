// public/sw-enhanced.js - Advanced Service Worker for PWA with offline capabilities
const CACHE_VERSION = '2.1.0';
const STATIC_CACHE_NAME = `cranksmith-static-v${CACHE_VERSION}`;
const DYNAMIC_CACHE_NAME = `cranksmith-dynamic-v${CACHE_VERSION}`;
const COMPONENTS_CACHE_NAME = `cranksmith-components-v${CACHE_VERSION}`;
const CALCULATIONS_CACHE_NAME = `cranksmith-calculations-v${CACHE_VERSION}`;
const OFFLINE_REQUESTS_CACHE = `cranksmith-offline-requests-v${CACHE_VERSION}`;

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

// POST endpoints that support offline queuing
const OFFLINE_POST_ENDPOINTS = [
  '/api/save-config',
  '/api/user-preferences',
  '/api/analytics',
  '/api/feedback'
];

// Retry configuration for failed sync operations
const RETRY_CONFIG = {
  maxRetries: 5,
  baseDelay: 1000, // 1 second
  maxDelay: 32000, // 32 seconds
  backoffMultiplier: 2
};

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
      }),
      caches.open(OFFLINE_REQUESTS_CACHE).then(cache => {
        console.log('Enhanced SW: Initialized offline requests cache');
        return Promise.resolve();
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

// Enhanced fetch event - handles both GET and POST requests
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle GET requests
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
  // Handle POST requests with offline support
  else if (request.method === 'POST') {
    event.respondWith(handlePostRequest(request));
  }
  // Handle other HTTP methods
  else {
    event.respondWith(networkFirstWithFallback(request));
  }
});

// Enhanced POST request handler with offline queuing
async function handlePostRequest(request) {
  const url = new URL(request.url);
  
  try {
    // Attempt network request first
    const response = await fetch(request.clone());
    
    if (response.ok) {
      return response;
    } else {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    console.log('POST request failed, checking for offline support:', url.pathname);
    
    // Check if this endpoint supports offline queuing
    if (OFFLINE_POST_ENDPOINTS.some(endpoint => url.pathname.includes(endpoint))) {
      return await queueOfflineRequest(request);
    } else {
      // Return appropriate offline response for unsupported endpoints
      return new Response(JSON.stringify({
        success: false,
        error: 'This action requires an internet connection',
        offline: true,
        canRetry: false
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
}

// Queue offline POST request for later sync
async function queueOfflineRequest(request) {
  try {
    const requestData = {
      id: generateRequestId(),
      url: request.url,
      method: request.method,
      headers: Object.fromEntries(request.headers.entries()),
      body: await request.text(),
      timestamp: Date.now(),
      retryCount: 0
    };
    
    // Store in offline cache
    const cache = await caches.open(OFFLINE_REQUESTS_CACHE);
    const queueKey = `offline-request-${requestData.id}`;
    
    await cache.put(queueKey, new Response(JSON.stringify(requestData)));
    
    // Register for background sync
    try {
      await self.registration.sync.register('sync-offline-requests');
    } catch (syncError) {
      console.warn('Background sync not supported, will retry on next service worker event');
    }
    
    console.log('Enhanced SW: POST request queued for sync', request.url);
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Request saved for when you\'re back online',
      offline: true,
      requestId: requestData.id
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Failed to queue offline request:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to save request for offline sync',
      offline: true
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Generate unique request ID
function generateRequestId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

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
    return await fetch(request);
  } catch (error) {
    console.log('Network failed for:', request.url);
    
    // For navigation requests, return offline page
    if (request.mode === 'navigate') {
      const cache = await caches.open(STATIC_CACHE_NAME);
      const offlinePage = await cache.match('/offline.html');
      return offlinePage || new Response('Offline', { status: 503 });
    }
    
    return new Response('Offline', { status: 503 });
  }
}

// Fetch and cache helper
async function fetchAndCache(request, cacheName) {
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    throw error;
  }
}

// Riley API specific strategy with better caching
async function rileyAPIStrategy(request) {
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      // Cache successful Riley responses for offline fallback
      const cache = await caches.open(COMPONENTS_CACHE_NAME);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    // Return helpful offline message for Riley
    return new Response(JSON.stringify({
      success: false,
      message: "Riley is currently offline. Please check your internet connection and try again.",
      offline: true
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Enhanced background sync with exponential backoff retry
self.addEventListener('sync', (event) => {
  console.log('Enhanced SW: Background sync triggered', event.tag);
  
  if (event.tag === 'sync-offline-requests') {
    event.waitUntil(syncOfflineRequests());
  } else if (event.tag === 'sync-saved-configs') {
    event.waitUntil(syncSavedConfigurations());
  }
});

// Robust sync with exponential backoff retry logic
async function syncOfflineRequests() {
  try {
    const cache = await caches.open(OFFLINE_REQUESTS_CACHE);
    const cacheKeys = await cache.keys();
    
    // Find all offline requests
    const requestKeys = cacheKeys.filter(key => 
      key.url.includes('offline-request-')
    );
    
    if (requestKeys.length === 0) {
      console.log('Enhanced SW: No offline requests to sync');
      return;
    }
    
    console.log(`Enhanced SW: Syncing ${requestKeys.length} offline requests`);
    
    const syncResults = await Promise.allSettled(
      requestKeys.map(key => syncSingleRequest(cache, key))
    );
    
    // Count successful and failed syncs
    const successful = syncResults.filter(result => result.status === 'fulfilled').length;
    const failed = syncResults.filter(result => result.status === 'rejected').length;
    
    console.log(`Enhanced SW: Sync complete - ${successful} successful, ${failed} failed`);
    
    // Notify clients of sync results
    await notifyClients({
      type: 'SYNC_COMPLETE',
      payload: {
        total: requestKeys.length,
        successful,
        failed
      }
    });
    
  } catch (error) {
    console.error('Background sync failed:', error);
    
    // Schedule retry with exponential backoff
    try {
      await self.registration.sync.register('sync-offline-requests');
    } catch (retryError) {
      console.warn('Failed to schedule sync retry');
    }
  }
}

// Sync a single request with retry logic
async function syncSingleRequest(cache, requestKey) {
  try {
    const cachedResponse = await cache.match(requestKey);
    if (!cachedResponse) {
      console.warn('Cached request not found:', requestKey.url);
      return;
    }
    
    const requestData = await cachedResponse.json();
    
    // Check if we've exceeded max retries
    if (requestData.retryCount >= RETRY_CONFIG.maxRetries) {
      console.warn(`Max retries exceeded for request ${requestData.id}`);
      await cache.delete(requestKey);
      return;
    }
    
    // Calculate delay for exponential backoff
    const delay = Math.min(
      RETRY_CONFIG.baseDelay * Math.pow(RETRY_CONFIG.backoffMultiplier, requestData.retryCount),
      RETRY_CONFIG.maxDelay
    );
    
    // Apply delay if this is a retry
    if (requestData.retryCount > 0) {
      console.log(`Retrying request ${requestData.id} after ${delay}ms delay`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    
    // Attempt to sync the request
    const response = await fetch(requestData.url, {
      method: requestData.method,
      headers: requestData.headers,
      body: requestData.body
    });
    
    if (response.ok) {
      console.log(`Successfully synced request ${requestData.id}`);
      await cache.delete(requestKey);
    } else {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
  } catch (error) {
    console.warn(`Failed to sync request ${requestKey.url}:`, error.message);
    
    // Update retry count and re-queue
    const cachedResponse = await cache.match(requestKey);
    if (cachedResponse) {
      const requestData = await cachedResponse.json();
      requestData.retryCount++;
      requestData.lastRetry = Date.now();
      
      if (requestData.retryCount < RETRY_CONFIG.maxRetries) {
        await cache.put(requestKey, new Response(JSON.stringify(requestData)));
        console.log(`Request ${requestData.id} queued for retry ${requestData.retryCount}/${RETRY_CONFIG.maxRetries}`);
      } else {
        console.warn(`Abandoning request ${requestData.id} after ${RETRY_CONFIG.maxRetries} retries`);
        await cache.delete(requestKey);
      }
    }
    
    throw error;
  }
}

// Legacy sync function for saved configurations (enhanced with retry logic)
async function syncSavedConfigurations() {
  try {
    const cache = await caches.open(CALCULATIONS_CACHE_NAME);
    const pendingConfigs = await cache.match('/pending-sync-configs');
    
    if (pendingConfigs) {
      const configs = await pendingConfigs.json();
      console.log(`Enhanced SW: Syncing ${configs.length} saved configurations`);
      
      let successCount = 0;
      let failCount = 0;
      
      // Attempt to sync each configuration with retry logic
      for (const config of configs) {
        let success = false;
        let retries = 0;
        
        while (!success && retries < RETRY_CONFIG.maxRetries) {
          try {
            if (retries > 0) {
              const delay = Math.min(
                RETRY_CONFIG.baseDelay * Math.pow(RETRY_CONFIG.backoffMultiplier, retries - 1),
                RETRY_CONFIG.maxDelay
              );
              await new Promise(resolve => setTimeout(resolve, delay));
            }
            
            const response = await fetch('/api/save-config', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(config)
            });
            
            if (response.ok) {
              success = true;
              successCount++;
            } else {
              throw new Error(`HTTP ${response.status}`);
            }
          } catch (error) {
            retries++;
            if (retries >= RETRY_CONFIG.maxRetries) {
              console.warn(`Failed to sync config ${config.id} after ${retries} retries`);
              failCount++;
            }
          }
        }
      }
      
      // Clear pending sync cache only if all succeeded
      if (failCount === 0) {
        await cache.delete('/pending-sync-configs');
      } else {
        // Keep failed configs for next sync attempt
        const failedConfigs = configs.filter((_, index) => index >= successCount);
        await cache.put('/pending-sync-configs', new Response(JSON.stringify(failedConfigs)));
      }
      
      // Notify all clients
      await notifyClients({
        type: 'CONFIG_SYNC_COMPLETE',
        payload: { 
          total: configs.length,
          successful: successCount,
          failed: failCount
        }
      });
    }
  } catch (error) {
    console.error('Configuration sync failed:', error);
  }
}

// Helper function to notify all clients
async function notifyClients(message) {
  try {
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage(message);
    });
  } catch (error) {
    console.error('Failed to notify clients:', error);
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
    case 'FORCE_SYNC':
      forceSyncOfflineRequests();
      break;
    case 'CLEAR_OFFLINE_QUEUE':
      clearOfflineQueue();
      break;
  }
});

// Force sync for manual retry
async function forceSyncOfflineRequests() {
  console.log('Enhanced SW: Force sync triggered');
  await syncOfflineRequests();
}

// Clear offline request queue
async function clearOfflineQueue() {
  try {
    const cache = await caches.open(OFFLINE_REQUESTS_CACHE);
    const keys = await cache.keys();
    
    await Promise.all(
      keys.map(key => cache.delete(key))
    );
    
    console.log('Enhanced SW: Offline queue cleared');
    
    await notifyClients({
      type: 'OFFLINE_QUEUE_CLEARED',
      payload: { clearedCount: keys.length }
    });
  } catch (error) {
    console.error('Failed to clear offline queue:', error);
  }
}

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
    try {
      await self.registration.sync.register('sync-saved-configs');
    } catch (syncError) {
      console.warn('Background sync registration failed');
    }
    
    console.log('Enhanced SW: Configuration saved for sync');
  } catch (error) {
    console.error('Failed to save offline configuration:', error);
  }
}

// Enhanced cache status with offline request queue info
async function sendCacheStatus(client) {
  try {
    const cacheNames = await caches.keys();
    const status = {
      hasOfflineData: cacheNames.some(name => name.includes('components')),
      hasPendingSync: false,
      cacheSize: cacheNames.length,
      offlineRequestCount: 0,
      pendingConfigCount: 0
    };
    
    // Check for pending sync data
    const calcCache = await caches.open(CALCULATIONS_CACHE_NAME);
    const pending = await calcCache.match('/pending-sync-configs');
    if (pending) {
      const configs = await pending.json();
      status.hasPendingSync = configs.length > 0;
      status.pendingConfigCount = configs.length;
    }
    
    // Check for offline requests
    const offlineCache = await caches.open(OFFLINE_REQUESTS_CACHE);
    const offlineKeys = await offlineCache.keys();
    const requestKeys = offlineKeys.filter(key => key.url.includes('offline-request-'));
    status.offlineRequestCount = requestKeys.length;
    
    if (status.offlineRequestCount > 0 || status.pendingConfigCount > 0) {
      status.hasPendingSync = true;
    }
    
    client.postMessage({
      type: 'CACHE_STATUS',
      payload: status
    });
  } catch (error) {
    console.error('Failed to get cache status:', error);
  }
}