// public/sw-enhanced.js - Simplified Service Worker for CrankSmith PWA
const CACHE_VERSION = '2.2.0';
const STATIC_CACHE = `cranksmith-static-v${CACHE_VERSION}`;
const DYNAMIC_CACHE = `cranksmith-dynamic-v${CACHE_VERSION}`;
const OFFLINE_CACHE = `cranksmith-offline-v${CACHE_VERSION}`;

// Simple logging utility
const log = {
  info: (msg, ...args) => console.log(`[SW] ${msg}`, ...args),
  warn: (msg, ...args) => console.warn(`[SW] ${msg}`, ...args),
  error: (msg, ...args) => console.error(`[SW] ${msg}`, ...args)
};

// Critical assets for offline functionality
const STATIC_ASSETS = [
  '/',
  '/mobile',
  '/calculator',
  '/bike-fit',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/offline.html'
];

// API endpoints to cache dynamically
const API_ENDPOINTS = [
  '/api/components-data',
  '/lib/components.js'
];

// ===== INSTALL EVENT =====
self.addEventListener('install', (event) => {
  log.info('Installing service worker...');
  
  event.waitUntil(
    installCaches()
      .then(() => {
        log.info('Installation complete, taking control');
        return self.skipWaiting();
      })
      .catch(error => {
        log.error('Installation failed:', error);
        throw error;
      })
  );
});

async function installCaches() {
  try {
    const cache = await caches.open(STATIC_CACHE);
    log.info(`Caching ${STATIC_ASSETS.length} static assets`);
    
    // Cache assets with simple error handling
    const results = await Promise.allSettled(
      STATIC_ASSETS.map(asset => cache.add(asset))
    );
    
    const failed = results.filter(r => r.status === 'rejected').length;
    if (failed > 0) {
      log.warn(`${failed}/${STATIC_ASSETS.length} assets failed to cache`);
    }
    
    // Ensure critical offline page is cached
    const offlinePage = await cache.match('/offline.html');
    if (!offlinePage) {
      log.warn('Critical: offline.html not cached, creating fallback');
      await cache.put('/offline.html', createFallbackOfflinePage());
    }
    
    log.info('Static cache installation complete');
    return true;
    
  } catch (error) {
    log.error('Cache installation failed:', error);
    throw error;
  }
}

function createFallbackOfflinePage() {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Offline - CrankSmith</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; text-align: center; padding: 50px; }
        .container { max-width: 400px; margin: 0 auto; }
        .retry-btn { padding: 12px 24px; background: #3B82F6; color: white; border: none; border-radius: 8px; cursor: pointer; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🔧 You're Offline</h1>
        <p>CrankSmith needs an internet connection to work properly.</p>
        <button class="retry-btn" onclick="window.location.reload()">Try Again</button>
      </div>
    </body>
    </html>
  `;
  
  return new Response(html, {
    headers: { 'Content-Type': 'text/html' }
  });
}

// ===== ACTIVATE EVENT =====
self.addEventListener('activate', (event) => {
  log.info('Activating service worker...');
  
  event.waitUntil(
    cleanupOldCaches()
      .then(() => {
        log.info('Activation complete, claiming clients');
        return self.clients.claim();
      })
      .catch(error => {
        log.error('Activation failed:', error);
      })
  );
});

async function cleanupOldCaches() {
  try {
    const cacheNames = await caches.keys();
    const currentCaches = [STATIC_CACHE, DYNAMIC_CACHE, OFFLINE_CACHE];
    const oldCaches = cacheNames.filter(name => 
      name.startsWith('cranksmith-') && !currentCaches.includes(name)
    );
    
    if (oldCaches.length > 0) {
      log.info(`Cleaning up ${oldCaches.length} old caches`);
      await Promise.all(oldCaches.map(name => caches.delete(name)));
    }
    
    return true;
  } catch (error) {
    log.error('Cache cleanup failed:', error);
    throw error;
  }
}

// ===== FETCH EVENT =====
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests and chrome-extension requests
  if (event.request.method !== 'GET' || 
      event.request.url.startsWith('chrome-extension://')) {
    return;
  }
  
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  
  try {
    // Route requests to appropriate strategies
    if (isStaticAsset(url)) {
      return await cacheFirstStrategy(request, STATIC_CACHE);
    }
    
    if (isApiRequest(url)) {
      return await networkFirstStrategy(request, DYNAMIC_CACHE);
    }
    
    if (isNavigationRequest(request)) {
      return await navigationStrategy(request);
    }
    
    // Default: network first for other resources
    return await networkFirstStrategy(request, DYNAMIC_CACHE);
    
  } catch (error) {
    log.error('Request handling failed:', error);
    return createErrorResponse(request);
  }
}

// ===== CACHING STRATEGIES =====
async function cacheFirstStrategy(request, cacheName) {
  try {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);
    
    if (cached) {
      log.info(`Cache hit: ${request.url}`);
      return cached;
    }
    
    log.info(`Cache miss, fetching: ${request.url}`);
    const response = await fetch(request);
    
    if (response.ok) {
      cache.put(request, response.clone()).catch(err => 
        log.warn('Failed to cache response:', err.message)
      );
    }
    
    return response;
    
  } catch (error) {
    log.warn(`Cache-first failed for ${request.url}:`, error.message);
    return createErrorResponse(request);
  }
}

async function networkFirstStrategy(request, cacheName) {
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone()).catch(err => 
        log.warn('Failed to cache response:', err.message)
      );
    }
    
    return response;
    
  } catch (networkError) {
    log.info(`Network failed for ${request.url}, checking cache`);
    
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);
    
    if (cached) {
      log.info(`Serving from cache: ${request.url}`);
      return cached;
    }
    
    log.warn(`No cache available for ${request.url}`);
    return createErrorResponse(request);
  }
}

async function navigationStrategy(request) {
  try {
    const response = await fetch(request);
    return response;
    
  } catch (error) {
    log.info(`Navigation failed, serving offline page for: ${request.url}`);
    
    const cache = await caches.open(STATIC_CACHE);
    const offlinePage = await cache.match('/offline.html');
    
    return offlinePage || createFallbackOfflinePage();
  }
}

// ===== HELPER FUNCTIONS =====
function isStaticAsset(url) {
  return url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/) ||
         STATIC_ASSETS.includes(url.pathname);
}

function isApiRequest(url) {
  return url.pathname.startsWith('/api/') || 
         API_ENDPOINTS.some(endpoint => url.pathname === endpoint);
}

function isNavigationRequest(request) {
  return request.mode === 'navigate' || 
         (request.method === 'GET' && request.headers.get('accept')?.includes('text/html'));
}

function createErrorResponse(request) {
  if (isNavigationRequest(request)) {
    return createFallbackOfflinePage();
  }
  
  if (isApiRequest(new URL(request.url))) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Network unavailable',
      offline: true
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  return new Response('Resource unavailable', { 
    status: 503,
    statusText: 'Service Unavailable'
  });
}

// ===== MESSAGE HANDLING =====
self.addEventListener('message', (event) => {
  const { type, payload } = event.data || {};
  
  switch (type) {
    case 'SKIP_WAITING':
      log.info('Received skip waiting command');
      self.skipWaiting();
      break;
      
    case 'GET_CACHE_STATUS':
      sendCacheStatus(event.source);
      break;
      
    case 'CLEAR_CACHES':
      clearAllCaches().then(() => {
        event.source.postMessage({
          type: 'CACHES_CLEARED',
          payload: { success: true }
        });
      }).catch(error => {
        event.source.postMessage({
          type: 'CACHES_CLEARED',
          payload: { success: false, error: error.message }
        });
      });
      break;
      
    default:
      log.warn('Unknown message type:', type);
  }
});

async function sendCacheStatus(client) {
  try {
    const cacheNames = await caches.keys();
    const cranksmithCaches = cacheNames.filter(name => name.startsWith('cranksmith-'));
    
    // Simple cache size estimation
    let totalSize = 0;
    for (const cacheName of cranksmithCaches) {
      const cache = await caches.open(cacheName);
      const requests = await cache.keys();
      totalSize += requests.length;
    }
    
    const status = {
      version: CACHE_VERSION,
      cacheCount: cranksmithCaches.length,
      totalCachedItems: totalSize,
      caches: cranksmithCaches,
      timestamp: Date.now()
    };
    
    client.postMessage({
      type: 'CACHE_STATUS',
      payload: status
    });
    
  } catch (error) {
    log.error('Failed to get cache status:', error);
    client.postMessage({
      type: 'CACHE_STATUS_ERROR',
      payload: { error: error.message }
    });
  }
}

async function clearAllCaches() {
  try {
    const cacheNames = await caches.keys();
    const cranksmithCaches = cacheNames.filter(name => name.startsWith('cranksmith-'));
    
    log.info(`Clearing ${cranksmithCaches.length} caches`);
    await Promise.all(cranksmithCaches.map(name => caches.delete(name)));
    
    log.info('All caches cleared successfully');
    return true;
    
  } catch (error) {
    log.error('Failed to clear caches:', error);
    throw error;
  }
}

// ===== ERROR HANDLING =====
self.addEventListener('error', (event) => {
  log.error('Service Worker error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  log.error('Unhandled promise rejection:', event.reason);
});

log.info(`Service Worker loaded - Version ${CACHE_VERSION}`);