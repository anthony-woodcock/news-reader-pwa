const staticCacheName = 'news-app-v1'

self.addEventListener('install', event => {
    console.log('[Service Worker] Installed')

    caches.open(staticCacheName)
        .then(cache => {
            cache.addAll([
                '/',
                '/index.html',
                '/style.css',
                '/key.js',
                '/js/NewsController.js'
            ])
        })
})

self.addEventListener('activate', event => {
    console.log('[Service Worker] Activated')
  
    caches.keys()
        .then(cacheList => {
            return Promise.all(
                cacheList
                .filter(cacheName => cacheName !== staticCacheName)
                .map(cacheName => caches.delete(cacheName))
        )
    })
    self.clients.claim()
})

self.addEventListener('fetch', event => {
    console.log('[Service Worker] Fetch Event')
    
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request)
            })
    )
})

