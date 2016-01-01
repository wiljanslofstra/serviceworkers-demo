/* global importScripts */

const version = 1;

importScripts('serviceworker-cache-polyfill.js');

self.addEventListener('install', function installServiceWorker(event) {
  console.log('[ServiceWorker]: Install version: ' + version);
});

self.addEventListener('fetch', function fetchEvent(event) {
  console.log('[ServiceWorker]: Fetch: ' + event.request.url);
});

self.addEventListener('activate', function activateEvent(event) {
  console.log('[ServiceWorker] Activate');
});
