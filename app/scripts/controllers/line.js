'use strict';

/**
 * @ngdoc function
 * @name publicTransAppApp.controller:LineCtrl
 * @description
 * # LineCtrl
 * Controller of the publicTransAppApp
 */
angular.module('publicTransAppApp')
  .controller('LineCtrl', function ($routeParams, lines) {
    var ctrl = this;

    ctrl.routeId = $routeParams.routeId;

    // fetch line info if routeId is given
    if (angular.isDefined(ctrl.routeId)) {
      ctrl.loading = true;

      lines.getRoute(ctrl.routeId)
        .then(function(routes) {
          ctrl.routes = routes;
        })
        .finally(function() {
          ctrl.loading = false;
        });
    }

    // if app is offline, notify user (toast) and show latest available info

  });
