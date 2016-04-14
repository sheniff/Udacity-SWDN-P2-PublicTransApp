'use strict';

/**
 * @ngdoc function
 * @name publicTransAppApp.controller:LineCtrl
 * @description
 * # LineCtrl
 * Controller of the publicTransAppApp
 */
angular.module('publicTransAppApp')
  .controller('LineCtrl', function ($routeParams, $q, lines) {
    var ctrl = this;

    ctrl.lineId = $routeParams.lineId;

    // fetch line info if lineId is given
    if (angular.isDefined(ctrl.lineId)) {
      ctrl.loading = true;

      $q.when(lines.get(ctrl.lineId))
        .then(function(routes) {
          ctrl.routes = routes;
        })
        .finally(function() {
          ctrl.loading = false;
        });
    }

    // if app is offline, notify user (toast) and show latest available info

  });
