var staticCacheName = 'public-trans-app-v832321209';

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(staticCacheName).then(function(cache) {
      return cache.addAll([
        '/Udacity-SWDN-P2-PublicTransApp/',
        'images/yeoman.8cb970fb.png',
        'images/svg/menu.b8871cf8.svg',
        'scripts/vendor.ae7419b1.js',
        'scripts/scripts.fc03b4c1.js',
        'styles/vendor.2b6cccfc.css',
        'styles/main.35a6ce88.css',
        'https://fonts.googleapis.com/css?family=Roboto:400,500,700,400italic'
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
