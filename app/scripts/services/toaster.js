'use strict';

/**
 * @ngdoc service
 * @name publicTransAppApp.toaster
 * @description
 * # toaster
 * Service in the publicTransAppApp.
 */
angular.module('publicTransAppApp')
  .service('toaster', function ($mdToast) {

    function showLoading(msg) {
      var toast = $mdToast.simple()
        .textContent(msg || 'Loading...')
        .position('top right')
        .hideDelay(false);

      return $mdToast.show(toast);
    }

    function hideLoading() {
      $mdToast.hide();
    }

    function showRetry(msg, cb) {
      var toast = $mdToast.simple()
        .textContent(msg || 'Could not get data...')
        .action('Retry?')
        .highlightAction(true)
        .position('top right')
        .hideDelay(false);

      $mdToast.show(toast).then(function(response) {
        if(response === 'ok') {
          cb();
        }
      });
    }

    return {
      showLoading: showLoading,
      hideLoading: hideLoading,
      showRetry: showRetry
    };
  });
