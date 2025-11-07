const CACHE_NAME = 'mafia-helper-v1'
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon-mafia.ico'
]

// Установка service worker
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...')
  event.waitUntil(
    // Сначала удаляем все старые кэши
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          console.log('Deleting old cache:', cacheName)
          return caches.delete(cacheName)
        })
      )
    }).then(() => {
      // Затем создаем новый кэш и загружаем свежие ресурсы
      return caches.open(CACHE_NAME).then((cache) => {
        console.log('Opened new cache:', CACHE_NAME)
        return cache.addAll(urlsToCache.map(url => new Request(url, { cache: 'reload' })))
      })
    })
  )
  // Активируем новый service worker сразу
  self.skipWaiting()
})

// Активация service worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...')
  event.waitUntil(
    Promise.all([
      // Очищаем все старые кэши
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('Deleting old cache on activate:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      }),
      // Берем контроль над всеми страницами
      self.clients.claim()
    ])
  )
})

// Перехват запросов
self.addEventListener('fetch', (event) => {
  // Пропускаем запросы к Firebase Storage и внешним API
  if (event.request.url.includes('firebase') || 
      event.request.url.includes('googleapis') ||
      event.request.url.startsWith('chrome-extension://')) {
    return
  }

  // Для HTML и основных ресурсов используем стратегию NetworkFirst
  if (event.request.mode === 'navigate' || 
      event.request.destination === 'document' ||
      event.request.url.includes('/static/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Если сетевой запрос успешен, обновляем кэш
          if (response && response.status === 200) {
            const responseToCache = response.clone()
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache)
            })
          }
          return response
        })
        .catch(() => {
          // Если сеть недоступна, используем кэш
          return caches.match(event.request).then((response) => {
            if (response) {
              return response
            }
            // Если это навигация и нет кэша, возвращаем index.html
            if (event.request.mode === 'navigate') {
              return caches.match('/index.html')
            }
          })
        })
    )
  } else {
    // Для остальных ресурсов используем CacheFirst с обновлением
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          // Возвращаем из кеша, если есть
          if (response) {
            // В фоне обновляем кэш
            fetch(event.request).then((networkResponse) => {
              if (networkResponse && networkResponse.status === 200) {
                caches.open(CACHE_NAME).then((cache) => {
                  cache.put(event.request, networkResponse.clone())
                })
              }
            }).catch(() => {
              // Игнорируем ошибки обновления
            })
            return response
          }
          // Иначе делаем сетевой запрос
          return fetch(event.request).then((response) => {
            // Проверяем валидность ответа
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response
            }
            // Клонируем ответ и сохраняем в кэш
            const responseToCache = response.clone()
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache)
            })
            return response
          })
        })
        .catch(() => {
          // Если запрос не удался и это навигация, возвращаем офлайн страницу
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html')
          }
        })
    )
  }
})

