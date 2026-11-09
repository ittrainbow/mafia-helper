/* eslint-disable no-restricted-globals */
const CACHE_NAME = 'mafia-helper-v2'
const BASE_PATH = self.location.pathname.replace(/\/sw\.js$/, '')

const withBase = (path) => `${BASE_PATH}${path}`

const urlsToCache = [
  withBase('/'),
  withBase('/index.html'),
  withBase('/manifest.json'),
  withBase('/favicon-mafia.ico'),
  withBase('/icon-192.png'),
  withBase('/icon-512.png')
]

self.addEventListener('install', (event) => {
  console.log('Service Worker installing...')
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          console.log('Deleting old cache:', cacheName)
          return caches.delete(cacheName)
        })
      )
    }).then(() => {
      return caches.open(CACHE_NAME).then((cache) => {
        console.log('Opened new cache:', CACHE_NAME)
        return cache.addAll(urlsToCache.map((url) => new Request(url, { cache: 'reload' })))
      })
    })
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...')
  event.waitUntil(
    Promise.all([
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => cacheName !== CACHE_NAME)
            .map((cacheName) => {
              console.log('Deleting old cache on activate:', cacheName)
              return caches.delete(cacheName)
            })
        )
      }),
      self.clients.claim()
    ])
  )
})

self.addEventListener('fetch', (event) => {
  if (event.request.url.startsWith('chrome-extension://')) {
    return
  }

  if (
    event.request.mode === 'navigate' ||
    event.request.destination === 'document' ||
    event.request.url.includes('/static/')
  ) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseToCache = response.clone()
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache)
            })
          }
          return response
        })
        .catch(() => {
          return caches.match(event.request).then((response) => {
            if (response) {
              return response
            }
            if (event.request.mode === 'navigate') {
              return caches.match(withBase('/index.html'))
            }
          })
        })
    )
    return
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, networkResponse.clone())
              })
            }
          })
          .catch(() => {})
        return response
      }

      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response
        }
        const responseToCache = response.clone()
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache)
        })
        return response
      })
    }).catch(() => {
      if (event.request.mode === 'navigate') {
        return caches.match(withBase('/index.html'))
      }
    })
  )
})
