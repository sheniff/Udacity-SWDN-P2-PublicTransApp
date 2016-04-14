'use strict';

/**
 * @ngdoc function
 * @name publicTransAppApp.controller:LinesCtrl
 * @description
 * # LinesCtrl
 * Controller of the publicTransAppApp
 */
angular.module('publicTransAppApp')
  .controller('LinesCtrl', function (lines, $mdSidenav, $location, $q) {

    var ctrl = this;

    ctrl.selectLine = function(line) {
      ctrl.selected = line;
      $location.url('/' + line.code);
      $mdSidenav('left').close();
    };

    // load list of lines
    $q.when(lines.getAll())
      .then(function(lines) {
        ctrl.lines = lines;
      });

  });
