/* global importScripts */

const version = 'v1';
const debug = true;
const cacheItems = [
  'http://unsplash.it/640/480/',
  'http://unsplash.it/641/480/',
  'http://unsplash.it/642/480/',
  'https://cdnjs.cloudflare.com/ajax/libs/normalize/3.0.3/normalize.min.css',
];

importScripts('serviceworker-cache-polyfill.js');

// Simple console log wrapper, we are now able to easily turn off console messages
function logSW() {
  return (debug) ? console.log.apply(console, arguments) : false;
}

self.addEventListener('install', function installServiceWorker(event) {
  logSW('[ServiceWorker]: Install version: ' + version);

  // Wait until the installation has been finished
  event.waitUntil(
    // Open the cache for the current version
    caches.open(version).then(function openCachePromise(cache) {
      logSW('[ServiceWorker] Cached files', cacheItems, version);

      // Add all files in the array defined above to the cache
      return cache.addAll(cacheItems);
    }).then(function forceActivate() {
      // Force activation
      return self.skipWaiting();
    })
  );
});

self.addEventListener('fetch', function fetchEvent(event) {
  // Send a new response back to the user
  event.respondWith(
    // Check if the requested element is in the cache
    caches.match(event.request)
      // A promise with a response if it's in the cache
      .then(function matchedRequest(response) {
        // Cache hit - return the response from the cached version
        if (response) {
          logSW('[Fetch] Returning from Service Worker cache: ', event.request.url);
          return response;
        }

        // Not in cache, return the result from the server
        logSW('[Fetch] Returning from server: ', event.request.url);

        return fetch(event.request);
      }
    )
  );
});

self.addEventListener('activate', function activateEvent(event) {
  // Define a list of versions that should be purged
  const cacheWhitelist = [version];

  logSW('[ServiceWorker] Activate');

  // Wait until activated
  event.waitUntil(
    // Get all cache store keys
    caches.keys().then(function keyListPromise(keyList) {
      // Map over all keys in the cache
      return Promise.all(keyList.map(function keyListIteration(key, i) {
        // If the current cache store does not match the whitelist, delete it
        if (cacheWhitelist.indexOf(key) === -1) {
          return caches.delete(keyList[i]);
        }
      }));
    })
  );
});
