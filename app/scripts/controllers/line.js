'use strict';

/**
 * @ngdoc function
 * @name publicTransAppApp.controller:LineCtrl
 * @description
 * # LineCtrl
 * Controller of the publicTransAppApp
 */
angular.module('publicTransAppApp')
  .controller('LineCtrl', function ($routeParams, $q, lines, toaster) {
    var ctrl = this;

    ctrl.lineId = $routeParams.lineId;

    function init() {
      ctrl.loading = true;
      toaster.showLoading();

      $q.when(lines.get(ctrl.lineId))
        .then(function(routes) {
          ctrl.routes = routes;
          toaster.hideLoading();
        })
        .catch(function() {
          toaster.showRetry('Couldn\'t update data...', init);
        })
        .finally(function() {
          ctrl.loading = false;
        });
    }

    // fetch line info if lineId is given
    if (angular.isDefined(ctrl.lineId)) {
      init();
    }
  });
