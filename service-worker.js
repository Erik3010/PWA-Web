const CACHE_NAME = 'firstpwa-v2';
let urlsToCache = [
    '/',
    '/nav.html',
    '/index.html',
    '/article.html',
    '/pages/home.html',
    '/pages/about.html',
    '/pages/contact.html',
    '/materialize/css/materialize.min.css',
    '/materialize/js/materialize.min.js',
    '/js/nav.js',
    '/js/api.js',
    '/icon.png'
]

// *menambahkan asset yang diinginkan ke cache storega
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(urlsToCache)
        })
    )
})

// *cek apakah assset sudah ada di catce atau tidak
// *jika tidak ada maka akan menggunakan fetch
self.addEventListener('fetch', event => {
    let base_url = "https://readerapi.codepolitan.com/";

    if(event.request.url.indexOf(base_url) > -1) {
        event.respondWith(
            caches.open(CACHE_NAME).then(cache => {
                return fetch(event.request).then(res => {
                    cache.put(event.request.url, res.clone());
                    return res;
                })
            })
        )
    }else{
        event.respondWith(
            caches.match(event.request, {ignoreSearch: true}).then(res => {
                return res || fetch(event.request)
            })
        )
    }
})

// *delete cache agar tidak menumpuk pada penyimpanan user
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if(cacheName != CACHE_NAME) {
                        console.log('ServiceWorker: cache ' + cacheName + ' dihapus')
                        return caches.delete(cacheName);
                    }
                })
            )
        })
    )
})