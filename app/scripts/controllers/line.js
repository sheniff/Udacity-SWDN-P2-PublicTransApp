'use strict';

/**
 * @ngdoc function
 * @name publicTransAppApp.controller:LineCtrl
 * @description
 * # LineCtrl
 * Controller of the publicTransAppApp
 */
angular.module('publicTransAppApp')
  .controller('LineCtrl', function ($routeParams) {
    var ctrl = this;

    ctrl.routeId = $routeParams.routeId;
  });
