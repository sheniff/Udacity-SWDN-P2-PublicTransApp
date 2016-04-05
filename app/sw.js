var staticCacheName = 'public-trans-app-v6';

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(staticCacheName).then(function(cache) {
      return cache.addAll([
        '/',
        'images/yeoman.png',
        'images/svg/menu.svg',
        'scripts/vendor.js',
        'scripts/scripts.js',
        'styles/vendor.css',
        'styles/main.css',
        'http://fonts.googleapis.com/css?family=Roboto:400,500,700,400italic'
      ]);
    }).then(function() {
      console.log('[sw] static files cached!');
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName.startsWith('public-trans-app') &&
                  cacheName !== staticCacheName;
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    }).then(function() {
      console.log('[sw] All the old caches has been deleted');
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('message', function(event) {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
