'use strict';

/**
 * @ngdoc service
 * @name publicTransAppApp.idb
 * @description
 * # idb
 * Factory in the publicTransAppApp.
 */
angular.module('publicTransAppApp')
  .factory('idb', function ($log) {

    function openDatabase() {
      if (!navigator.serviceWorker) {
        return Promise.resolve();
      }

      return idb.open('public-trans-app', 1, function(upgradeDb) {
        var store;

        switch (upgradeDb.oldVersion) {
          case 0:
            store = upgradeDb.createObjectStore('lines', { keyPath: 'code' });
            store.createIndex('by-name', 'name');
        }
      });
    }

    var _dbPromise = openDatabase();

    // Public API here
    return {
      getDB: function () {
        return _dbPromise;
      },

      // *******
      // Lines
      // *******

      cacheLines: function(lines) {
        if (!lines) {
          return Promise.resolve(lines);
        }

        return _dbPromise.then(function(db) {
          if (db) {
            var tx = db.transaction('lines', 'readwrite');
            var store = tx.objectStore('lines');
            lines.forEach(function(line) {
              store.put(line);
            });

            $log.log('[idb] Lines cached');
          }

          return Promise.resolve(lines);
        });
      },

      getLines: function() {
        return _dbPromise.then(function(db) {
          if (!db) {
            return Promise.reject();
          }

          return db.transaction('lines').objectStore('lines')
            .getAll()
            .then(function(lines) {
              if (!lines || !lines.length) {
                $log.log('[idb] No cached lines found...');
                return Promise.reject();
              }

              $log.log('[idb] Serving cached lines...');
              return Promise.resolve(lines);
            });
        });
      },

      clearLines: function() {
        return _dbPromise.then(function(db) {
          if (!db) {
            return Promise.resolve();
          }

          return db.transaction('lines').objectStore('lines')
            .openCursor()
            .then(function deleteItem(cursor) {
              if (!cursor) { return; }
              cursor.delete();
              return cursor.continue().then(deleteItem);
            });
        });
      },

      // *******
      // Line
      // *******

      cacheLine: function(line) {
        if (!line) {
          return Promise.resolve(line);
        }

        return _dbPromise.then(function(db) {
          if (db) {
            db.transaction('lines', 'readwrite')
              .objectStore('lines')
              .put(line);

            $log.log('[idb] Line cached', line);
          }

          return Promise.resolve(line);
        });
      },

      getLine: function(id) {
        return _dbPromise.then(function(db) {
          if (!db) {
            return Promise.reject();
          }

          return db.transaction('lines').objectStore('lines')
            .get(id)
            .then(function(line) {
              if (!line) {
                $log.log('[idb] No cached line found...');
                return Promise.reject();
              }

              if (line.inbound && !line.inbound.stops || line.outbound && !line.outbound.stops) {
                $log.log('[idb] Stop info not found for this line...');
                return Promise.reject();
              }

              $log.log('[idb] Serving cached line including stops...', line);
              return Promise.resolve(line);
            });
        });
      },

      // ************
      // Line times
      // ************

      cacheStop: function(stopId, lineId, direction) {
        return function cache(times) {
          if (!times || !stopId || !lineId || !direction) {
            return Promise.resolve(times);
          }

          return _dbPromise.then(function(db) {
            if (!db) {
              return Promise.resolve(times);
            }

            var store = db.transaction('lines', 'readwrite').objectStore('lines');

            function storeTimes(line) {
              if (!line) {
                $log.log('[idb] No cached line found to cache stop times...');
                return Promise.resolve(times);
              }

              direction = line[direction.toLowerCase()];

              if (direction && direction.stops && direction.stops.length) {
                var stop = direction.stops.find(function(e){ return e.code === stopId; });

                if(stop) {
                  stop.times = times;
                  stop.lastFetch = new Date().getTime();
                  store.put(line);

                } else {
                  $log.log('[idb] Invalid stop to cache stop times...', stopId, lineId, direction, line);
                }
              } else {
                $log.log('[idb] Invalid direction to cache stop times...', stopId, lineId, direction, line);
              }

              return Promise.resolve(times);
            }

            return store.get(lineId).then(storeTimes);
          });
        };
      },

      getStop: function(stopId, lineId, direction) {
        return this.getLine(lineId).then(function(line) {

          direction = line[direction.toLowerCase()];

          if (direction && direction.stops && direction.stops.length) {
            var stop = direction.stops.find(function(e){ return e.code === stopId; });

            if(stop && stop.times) {
              $log.log('[idb] found cached times...', stopId, stop.times, stop.lastFetch);

              // compute current valid times based on *when* were they cached
              var now = new Date().getTime();
              var minutesElapsed = Math.floor((now - (stop.lastFetch || now)) / 60000);

              return Promise.resolve(
                stop.times
                  .map(function(time) { return time - minutesElapsed; })
                  .filter(function(time) { return time > 0; })
              );
            } else {
              $log.log('[idb] no cached times for stop...', stopId, lineId, direction, line);
            }
          } else {
            $log.log('[idb] Invalid direction for stop times...', stopId, lineId, direction, line);
          }

          return Promise.reject();
        });
      }
    };
  });
