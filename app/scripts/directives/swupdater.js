'use strict';

/**
 * @ngdoc directive
 * @name publicTransAppApp.directive:swupdater
 * @description
 * # swupdater
 */
angular.module('publicTransAppApp')
  .directive('swupdater', function ($mdToast) {
    return {
      restrict: 'E',
      link: function postLink() {

        function init() {
          if(navigator.serviceWorker) {
            navigator.serviceWorker.register('/sw.js').then(function(reg) {
              console.log('[SWupdater] working!');

              if(!navigator.serviceWorker.controller) {
                return;
              }

              if(reg.waiting) {
                _updateReady(reg.waiting);
                return;
              }

              if(reg.installing) {
                _trackInstalling(reg.installing);
                return;
              }

              reg.addEventListener('updatefound', function() {
                _trackInstalling(reg.installing);
              });

            }).catch(function() {
              console.log('[SWupdater] failed loading...');
            });
          }
        }

        // show a message indicating there's something pending
        function _updateReady(worker) {
          var toast = $mdToast.simple()
            .textContent('New version available')
            .action('Refresh')
            .highlightAction(true)
            .position('top right')
            .hideDelay(false);

          $mdToast.show(toast).then(function(response) {
            if( response === 'ok' ) {
              worker.postMessage({ action: 'skipWaiting' });
            }
          });
        }

        // track installing: check when statechange event is installed to notify the update
        function _trackInstalling(worker) {
          worker.addEventListener('statechange', function() {
            if (worker.state === 'installed') {
              _updateReady(worker);
            }
          });
        }

        // init
        init();
      }
    };
  });
