'use strict';

/**
 * @ngdoc function
 * @name publicTransAppApp.controller:LinesCtrl
 * @description
 * # LinesCtrl
 * Controller of the publicTransAppApp
 */
angular.module('publicTransAppApp')
  .controller('LinesCtrl', function (lines, $mdSidenav, $location, $q, toaster) {

    var ctrl = this;

    ctrl.selectLine = function(line) {
      ctrl.selected = line;
      $location.url('/' + line.code);
      $mdSidenav('left').close();
    };

    function init() {
      // load list of lines
      toaster.showLoading();

      $q.when(lines.getAll())
        .then(function(lines) {
          ctrl.lines = lines;
          toaster.hideLoading();
        })
        .catch(function() {
          toaster.showRetry('Could not get data...', init);
        });
    }

    init();
  });
