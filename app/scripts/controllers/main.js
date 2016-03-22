'use strict';

/**
 * @ngdoc function
 * @name publicTransAppApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the publicTransAppApp
 */
angular.module('publicTransAppApp')
  .controller('MainCtrl', function ($mdSidenav) {

    var ctrl = this;

    ctrl.toggleList = function() {
      $mdSidenav('left').toggle();
    };

  });
