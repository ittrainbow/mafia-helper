const CACHE_NAME = 'mafia-helper-v1'
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon-mafia.ico'
]

// Установка service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache')
        return cache.addAll(urlsToCache)
      })
  )
  // Активируем новый service worker сразу
  self.skipWaiting()
})

// Активация service worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  // Берем контроль над всеми страницами
  return self.clients.claim()
})

// Перехват запросов
self.addEventListener('fetch', (event) => {
  // Пропускаем запросы к Firebase Storage
  if (event.request.url.includes('firebase') || event.request.url.includes('googleapis')) {
    return
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Возвращаем из кеша, если есть
        if (response) {
          return response
        }
        // Иначе делаем сетевой запрос
        return fetch(event.request).then((response) => {
          // Проверяем валидность ответа
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response
          }
          // Клонируем ответ
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
})

