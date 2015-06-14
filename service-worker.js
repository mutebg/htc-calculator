'use strict';

importScripts('serviceworker-cache-polyfill.js');

// updated service worker is activated.
var CACHE_VERSION = 4;
var CURRENT_CACHES = {
    prefetch: 'calculator-cache-v' + CACHE_VERSION
};

self.addEventListener('install', function (event) {
    var urlsToPrefetch = ['/', 'css/main.css', 'main.js', 'index.html'];

    console.log('Handling install event. Resources to pre-fetch:', urlsToPrefetch);

    event.waitUntil(caches.open(CURRENT_CACHES['prefetch']).then(function (cache) {
        return cache.addAll(urlsToPrefetch.map(function (urlToPrefetch) {
            return new Request(urlToPrefetch, {
                mode: 'no-cors'
            });
        })).then(function () {
            console.log('All resources have been fetched and cached.');
        });
    })['catch'](function (err) {
        // This catch() will handle any exceptions from the caches.open()/cache.addAll() steps.
        console.log('Pre-fetching failed:', err);
    }));
});

self.addEventListener('activate', function (event) {
    // Delete all caches that aren't named in CURRENT_CACHES.
    var expectedCacheNames = Object.keys(CURRENT_CACHES).map(function (key) {
        return CURRENT_CACHES[key];
    });

    event.waitUntil(caches.keys().then(function (cacheNames) {
        return Promise.all(cacheNames.map(function (cacheName) {
            if (expectedCacheNames.indexOf(cacheName) == -1) {
                // If this cache name isn't present in the array of "expected" cache names, then delete it.
                console.log('Deleting out of date cache:', cacheName);
                return caches['delete'](cacheName);
            }
        }));
    }));
});

self.addEventListener('fetch', function (event) {
    console.log('Handling fetch event for', event.request.url);

    event.respondWith(
    // caches.match() will look for a cache entry in all of the caches available to the service worker.
    // It's an alternative to first opening a specific named cache and then matching on that.
    caches.match(event.request).then(function (response) {
        if (response) {
            console.log('Found response in cache:', response);
            return response;
        }

        console.log('No response found in cache. About to fetch from network...');

        // event.request will always have the proper mode set ('cors, 'no-cors', etc.) so we don't
        // have to hardcode 'no-cors' like we do when fetch()ing in the install handler.
        return fetch(event.request).then(function (response) {
            console.log('Response from network is:', response);

            return response;
        })['catch'](function (err) {
            // This catch() will handle exceptions thrown from the fetch() operation.
            // Note that a HTTP error response (e.g. 404) will NOT trigger an exception.
            // It will return a normal response object that has the appropriate error code set.
            console.error('Fetching failed:', err);

            throw err;
        });
    }));
});