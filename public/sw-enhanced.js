// public/sw-enhanced.js - Advanced Service Worker for PWA with offline capabilities
const CACHE_VERSION = '2.1.1'; // Incremented for cache cleanup fix
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
  '/offline.html' // Essential offline fallback
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

// Cache validation configuration
const CACHE_VALIDATION = {
  maxCacheAge: 24 * 60 * 60 * 1000, // 24 hours
  requiredAssets: ['/offline.html', '/', '/calculator', '/mobile'],
  criticalEndpoints: ['/lib/components.js']
};

// Install event - cache critical assets with validation
self.addEventListener('install', (event) => {
  console.log('Enhanced SW: Installing...');
  
  event.waitUntil(
    installAndValidateCaches()
      .then(() => {
        console.log('Enhanced SW: Installation completed successfully');
        self.skipWaiting();
      })
      .catch(error => {
        console.error('Enhanced SW: Installation failed', error);
        // Don't skip waiting if installation fails
        throw error;
      })
  );
});

// Enhanced installation with cache validation
async function installAndValidateCaches() {
  try {
    // Install caches in parallel but validate each one
    const cachePromises = await Promise.allSettled([
      installStaticCache(),
      installComponentsCache(),
      installOfflineRequestsCache()
    ]);

    // Check if any critical cache installation failed
    const failed = cachePromises.filter(result => result.status === 'rejected');
    if (failed.length > 0) {
      console.warn('Enhanced SW: Some caches failed to install:', failed);
      // Continue installation but log warnings
    }

    // Validate that critical assets are cached
    const validationResult = await validateNewCaches();
    if (!validationResult.isValid) {
      throw new Error(`Cache validation failed: ${validationResult.errors.join(', ')}`);
    }

    console.log('Enhanced SW: All caches installed and validated successfully');
    return true;

  } catch (error) {
    console.error('Enhanced SW: Cache installation and validation failed:', error);
    throw error;
  }
}

// Install static cache with error handling
async function installStaticCache() {
  try {
    const cache = await caches.open(STATIC_CACHE_NAME);
    console.log('Enhanced SW: Caching static assets');
    
    // Cache assets individually to identify which ones fail
    const cacheResults = await Promise.allSettled(
      STATIC_ASSETS.map(async (asset) => {
        try {
          await cache.add(asset);
          console.log(`Enhanced SW: Cached ${asset}`);
        } catch (error) {
          console.warn(`Enhanced SW: Failed to cache ${asset}:`, error);
          throw error;
        }
      })
    );

    // Check for critical failures
    const failed = cacheResults.filter(result => result.status === 'rejected');
    if (failed.length > 0) {
      console.warn(`Enhanced SW: ${failed.length}/${STATIC_ASSETS.length} static assets failed to cache`);
      
      // Critical assets that must be cached
      const criticalAssets = ['/offline.html'];
      for (const asset of criticalAssets) {
        const cached = await cache.match(asset);
        if (!cached) {
          throw new Error(`Critical asset ${asset} not cached`);
        }
      }
    }

    return cache;
  } catch (error) {
    console.error('Enhanced SW: Static cache installation failed:', error);
    throw error;
  }
}

// Install components cache
async function installComponentsCache() {
  try {
    const cache = await caches.open(COMPONENTS_CACHE_NAME);
    console.log('Enhanced SW: Pre-caching component data');
    
    // Try to cache component data
    try {
      await cache.add('/lib/components.js');
      console.log('Enhanced SW: Component data cached successfully');
    } catch (error) {
      console.warn('Enhanced SW: Failed to cache component data:', error);
      // Non-critical, continue installation
    }

    return cache;
  } catch (error) {
    console.error('Enhanced SW: Components cache creation failed:', error);
    throw error;
  }
}

// Install offline requests cache
async function installOfflineRequestsCache() {
  try {
    const cache = await caches.open(OFFLINE_REQUESTS_CACHE);
    console.log('Enhanced SW: Initialized offline requests cache');
    return cache;
  } catch (error) {
    console.error('Enhanced SW: Offline requests cache creation failed:', error);
    throw error;
  }
}

// Validate that new caches contain required assets
async function validateNewCaches() {
  const errors = [];
  
  try {
    // Check static cache for critical assets
    const staticCache = await caches.open(STATIC_CACHE_NAME);
    for (const asset of CACHE_VALIDATION.requiredAssets) {
      const cached = await staticCache.match(asset);
      if (!cached) {
        errors.push(`Required asset ${asset} not found in static cache`);
      }
    }

    // Check components cache for critical endpoints
    const componentsCache = await caches.open(COMPONENTS_CACHE_NAME);
    for (const endpoint of CACHE_VALIDATION.criticalEndpoints) {
      const cached = await componentsCache.match(endpoint);
      if (!cached) {
        console.warn(`Critical endpoint ${endpoint} not found in components cache`);
        // Warning only, not fatal
      }
    }

    // Verify cache accessibility
    const cacheNames = await caches.keys();
    const expectedCaches = [
      STATIC_CACHE_NAME,
      COMPONENTS_CACHE_NAME,
      OFFLINE_REQUESTS_CACHE
    ];

    for (const expectedCache of expectedCaches) {
      if (!cacheNames.includes(expectedCache)) {
        errors.push(`Expected cache ${expectedCache} not found`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings: errors.length
    };

  } catch (error) {
    errors.push(`Cache validation error: ${error.message}`);
    return {
      isValid: false,
      errors,
      warnings: 0
    };
  }
}

// Enhanced activate event with safe cache cleanup
self.addEventListener('activate', (event) => {
  console.log('Enhanced SW: Activating...');
  
  event.waitUntil(
    safeActivateAndCleanup()
      .then(() => {
        console.log('Enhanced SW: Activation completed successfully');
      })
      .catch(error => {
        console.error('Enhanced SW: Activation failed:', error);
        // Continue anyway to avoid breaking the service worker
      })
  );
});

// Safe activation with comprehensive cache validation and cleanup
async function safeActivateAndCleanup() {
  try {
    // Step 1: Validate current caches before any cleanup
    console.log('Enhanced SW: Validating current caches...');
    const validation = await validateCurrentCaches();
    
    if (!validation.hasMinimalOfflineSupport) {
      console.warn('Enhanced SW: Minimal offline support not available, preserving old caches');
      await self.clients.claim();
      return;
    }

    // Step 2: Get all cache names and identify old caches
    const allCacheNames = await caches.keys();
    const oldCaches = allCacheNames.filter(cacheName => 
      cacheName.includes('cranksmith') && 
      !cacheName.includes(CACHE_VERSION)
    );

    // Step 3: Verify new caches are fully functional before cleanup
    const newCacheValidation = await validateNewCaches();
    if (!newCacheValidation.isValid) {
      console.warn('Enhanced SW: New caches not fully valid, attempting repair...');
      
      try {
        await repairCaches();
        const retryValidation = await validateNewCaches();
        if (!retryValidation.isValid) {
          throw new Error('Cache repair failed: ' + retryValidation.errors.join(', '));
        }
      } catch (repairError) {
        console.error('Enhanced SW: Cache repair failed, preserving old caches:', repairError);
        await self.clients.claim();
        return;
      }
    }

    // Step 4: Perform safe cache cleanup only after validation
    if (oldCaches.length > 0) {
      console.log(`Enhanced SW: Safely cleaning up ${oldCaches.length} old caches`);
      
      const cleanupResults = await Promise.allSettled(
        oldCaches.map(async (cacheName) => {
          try {
            await caches.delete(cacheName);
            console.log(`Enhanced SW: Deleted old cache: ${cacheName}`);
          } catch (error) {
            console.warn(`Enhanced SW: Failed to delete cache ${cacheName}:`, error);
            throw error;
          }
        })
      );

      const failedCleanups = cleanupResults.filter(result => result.status === 'rejected');
      if (failedCleanups.length > 0) {
        console.warn(`Enhanced SW: ${failedCleanups.length} cache cleanups failed`);
      }
    }

    // Step 5: Final validation and client notification
    await self.clients.claim();
    
    const finalValidation = await validateCurrentCaches();
    await notifyClients({
      type: 'CACHE_UPDATE_COMPLETE',
      payload: {
        version: CACHE_VERSION,
        hasOfflineSupport: finalValidation.hasMinimalOfflineSupport,
        cleanedCaches: oldCaches.length,
        validation: finalValidation
      }
    });

    console.log('Enhanced SW: Cache cleanup and activation completed successfully');

  } catch (error) {
    console.error('Enhanced SW: Safe activation failed:', error);
    
    // Attempt emergency fallback
    await emergencyFallbackActivation();
    throw error;
  }
}

// Validate current caches for minimal offline functionality
async function validateCurrentCaches() {
  try {
    const validation = {
      hasMinimalOfflineSupport: false,
      hasOfflinePage: false,
      hasStaticAssets: false,
      hasComponentData: false,
      cacheCount: 0,
      errors: []
    };

    const cacheNames = await caches.keys();
    validation.cacheCount = cacheNames.length;

    // Check for offline page (critical)
    const staticCache = await caches.open(STATIC_CACHE_NAME);
    const offlinePage = await staticCache.match('/offline.html');
    validation.hasOfflinePage = !!offlinePage;

    // Check for basic navigation pages
    const navigationPages = await Promise.all([
      staticCache.match('/'),
      staticCache.match('/calculator'),
      staticCache.match('/mobile')
    ]);
    validation.hasStaticAssets = navigationPages.some(page => !!page);

    // Check for component data
    const componentsCache = await caches.open(COMPONENTS_CACHE_NAME);
    const componentData = await componentsCache.match('/lib/components.js');
    validation.hasComponentData = !!componentData;

    // Minimal offline support = offline page + at least one navigation page
    validation.hasMinimalOfflineSupport = validation.hasOfflinePage && validation.hasStaticAssets;

    if (!validation.hasMinimalOfflineSupport) {
      validation.errors.push('Missing minimal offline support (offline page and/or navigation pages)');
    }

    return validation;

  } catch (error) {
    console.error('Enhanced SW: Cache validation error:', error);
    return {
      hasMinimalOfflineSupport: false,
      hasOfflinePage: false,
      hasStaticAssets: false,
      hasComponentData: false,
      cacheCount: 0,
      errors: [`Validation error: ${error.message}`]
    };
  }
}

// Repair caches by re-caching critical assets
async function repairCaches() {
  console.log('Enhanced SW: Attempting cache repair...');
  
  try {
    // Repair static cache with critical assets
    const staticCache = await caches.open(STATIC_CACHE_NAME);
    const criticalAssets = ['/offline.html', '/', '/calculator'];
    
    for (const asset of criticalAssets) {
      try {
        const cached = await staticCache.match(asset);
        if (!cached) {
          console.log(`Enhanced SW: Re-caching critical asset: ${asset}`);
          await staticCache.add(asset);
        }
      } catch (error) {
        console.warn(`Enhanced SW: Failed to repair cache for ${asset}:`, error);
        // Continue with other assets
      }
    }

    // Attempt to repair component cache
    const componentsCache = await caches.open(COMPONENTS_CACHE_NAME);
    try {
      const componentData = await componentsCache.match('/lib/components.js');
      if (!componentData) {
        console.log('Enhanced SW: Re-caching component data');
        await componentsCache.add('/lib/components.js');
      }
    } catch (error) {
      console.warn('Enhanced SW: Failed to repair component cache:', error);
      // Non-critical, continue
    }

    console.log('Enhanced SW: Cache repair completed');

  } catch (error) {
    console.error('Enhanced SW: Cache repair failed:', error);
    throw error;
  }
}

// Emergency fallback activation when normal activation fails
async function emergencyFallbackActivation() {
  console.warn('Enhanced SW: Performing emergency fallback activation');
  
  try {
    // Claim clients immediately
    await self.clients.claim();
    
    // Try to ensure offline.html is available
    const staticCache = await caches.open(STATIC_CACHE_NAME);
    try {
      const offlinePage = await staticCache.match('/offline.html');
      if (!offlinePage) {
        await staticCache.add('/offline.html');
      }
    } catch (error) {
      console.error('Enhanced SW: Emergency offline page caching failed:', error);
    }

    // Notify clients of emergency state
    await notifyClients({
      type: 'EMERGENCY_ACTIVATION',
      payload: {
        message: 'Service worker activated in emergency mode',
        limitedOfflineSupport: true
      }
    });

  } catch (error) {
    console.error('Enhanced SW: Emergency fallback activation failed:', error);
  }
}

// Enhanced fetch event - handles both GET and POST requests with better fallbacks
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
      // Other requests - network first with robust fallback
      event.respondWith(networkFirstWithRobustFallback(request));
    }
  } 
  // Handle POST requests with offline support
  else if (request.method === 'POST') {
    event.respondWith(handlePostRequest(request));
  }
  // Handle other HTTP methods
  else {
    event.respondWith(networkFirstWithRobustFallback(request));
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

// Cache-first strategy for static assets with fallback
async function cacheFirstStrategy(request, cacheName) {
  try {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);
    
    if (cached) {
      // Return cached version and update in background
      fetchAndCache(request, cacheName).catch(error => {
        console.warn('Background cache update failed:', error);
      });
      return cached;
    }
    
    return await fetchAndCache(request, cacheName);
  } catch (error) {
    console.error('Cache-first strategy failed:', error);
    return await createOfflineResponse(request);
  }
}

// Network-first strategy for dynamic content with better fallback
async function networkFirstStrategy(request, cacheName) {
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone()).catch(error => {
        console.warn('Failed to cache response:', error);
      });
    }
    
    return response;
  } catch (error) {
    console.log('Network failed, checking cache:', request.url);
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);
    
    if (cached) {
      return cached;
    }
    
    // Return appropriate offline response for failed API calls
    return new Response(JSON.stringify({
      success: false,
      error: 'This feature requires an internet connection',
      offline: true,
      cached: false
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Enhanced network-first with robust offline fallback
async function networkFirstWithRobustFallback(request) {
  try {
    return await fetch(request);
  } catch (error) {
    console.log('Network failed for:', request.url);
    return await createOfflineResponse(request);
  }
}

// Create appropriate offline response based on request type
async function createOfflineResponse(request) {
  // For navigation requests, return offline page
  if (request.mode === 'navigate') {
    try {
      const cache = await caches.open(STATIC_CACHE_NAME);
      const offlinePage = await cache.match('/offline.html');
      
      if (offlinePage) {
        return offlinePage;
      } else {
        // Fallback: create basic offline page
        return new Response(`
          <!DOCTYPE html>
          <html><head><title>Offline - CrankSmith</title></head>
          <body>
            <h1>You're offline</h1>
            <p>Please check your internet connection and try again.</p>
            <button onclick="window.location.reload()">Retry</button>
          </body></html>
        `, {
          status: 200,
          headers: { 'Content-Type': 'text/html' }
        });
      }
    } catch (cacheError) {
      console.error('Failed to access offline cache:', cacheError);
      return new Response('Offline - Service Unavailable', { status: 503 });
    }
  }
  
  // For other requests, return JSON error
  return new Response(JSON.stringify({
    success: false,
    error: 'Network unavailable',
    offline: true
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

// Fetch and cache helper with error handling
async function fetchAndCache(request, cacheName) {
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      const cache = await caches.open(cacheName);
      await cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.error('Fetch and cache failed:', error);
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
      cache.put(request, response.clone()).catch(error => {
        console.warn('Failed to cache Riley response:', error);
      });
    }
    
    return response;
  } catch (error) {
    // Return helpful offline message for Riley
    return new Response(JSON.stringify({
      success: false,
      message: "Riley is currently offline. Please check your internet connection and try again.",
      offline: true,
      canRetry: true
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

// Sync a single request with exponential backoff retry logic
async function syncSingleRequest(cache, requestKey) {
  try {
    const response = await cache.match(requestKey);
    if (!response) {
      throw new Error('Request not found in cache');
    }
    
    const requestData = await response.json();
    
    // Check if we've exceeded max retry attempts
    if (requestData.retryCount >= RETRY_CONFIG.maxRetries) {
      console.warn(`Enhanced SW: Request ${requestData.id} exceeded max retries, removing`);
      await cache.delete(requestKey);
      return { success: false, reason: 'max_retries_exceeded' };
    }
    
    // Calculate delay for exponential backoff
    if (requestData.retryCount > 0) {
      const delay = Math.min(
        RETRY_CONFIG.baseDelay * Math.pow(RETRY_CONFIG.backoffMultiplier, requestData.retryCount - 1),
        RETRY_CONFIG.maxDelay
      );
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    
    // Attempt to replay the request
    const fetchResponse = await fetch(requestData.url, {
      method: requestData.method,
      headers: requestData.headers,
      body: requestData.body
    });
    
    if (fetchResponse.ok) {
      // Success - remove from cache
      await cache.delete(requestKey);
      console.log(`Enhanced SW: Successfully synced request ${requestData.id}`);
      return { success: true, requestId: requestData.id };
    } else {
      // Update retry count and store back
      requestData.retryCount++;
      await cache.put(requestKey, new Response(JSON.stringify(requestData)));
      throw new Error(`HTTP ${fetchResponse.status}: ${fetchResponse.statusText}`);
    }
  } catch (error) {
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
    case 'VALIDATE_CACHES':
      validateAndReportCaches(event.source);
      break;
    case 'REPAIR_CACHES':
      repairCachesManually(event.source);
      break;
  }
});

// Validate caches and report status
async function validateAndReportCaches(client) {
  try {
    const validation = await validateCurrentCaches();
    const newCacheValidation = await validateNewCaches();
    
    client.postMessage({
      type: 'CACHE_VALIDATION_RESULT',
      payload: {
        current: validation,
        new: newCacheValidation,
        timestamp: Date.now()
      }
    });
  } catch (error) {
    client.postMessage({
      type: 'CACHE_VALIDATION_ERROR',
      payload: {
        error: error.message,
        timestamp: Date.now()
      }
    });
  }
}

// Manual cache repair triggered by client
async function repairCachesManually(client) {
  try {
    await repairCaches();
    const validation = await validateCurrentCaches();
    
    client.postMessage({
      type: 'CACHE_REPAIR_COMPLETE',
      payload: {
        success: true,
        validation,
        timestamp: Date.now()
      }
    });
  } catch (error) {
    client.postMessage({
      type: 'CACHE_REPAIR_ERROR',
      payload: {
        success: false,
        error: error.message,
        timestamp: Date.now()
      }
    });
  }
}

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

// Enhanced cache status with offline request queue info and validation
async function sendCacheStatus(client) {
  try {
    const cacheNames = await caches.keys();
    const currentValidation = await validateCurrentCaches();
    const newValidation = await validateNewCaches();
    
    const status = {
      hasOfflineData: cacheNames.some(name => name.includes('components')),
      hasPendingSync: false,
      cacheSize: cacheNames.length,
      offlineRequestCount: 0,
      pendingConfigCount: 0,
      version: CACHE_VERSION,
      validation: currentValidation,
      newCacheValidation: newValidation,
      hasMinimalOfflineSupport: currentValidation.hasMinimalOfflineSupport
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
    client.postMessage({
      type: 'CACHE_STATUS_ERROR',
      payload: {
        error: error.message,
        timestamp: Date.now()
      }
    });
  }
}