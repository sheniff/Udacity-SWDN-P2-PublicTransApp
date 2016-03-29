// TODO: REMEMBER TO MAKE MINUTES TO DECREASE AUTOMATICALLY!
// TO PRETEND IT WORKS EVEN WITHOUT CONNECTION!

// TODO: CONSIDER USING VIRTUAL-REPEAT FROM MATERIAL ANGULAR TO SAVE CALLS

'use strict';

/**
 * @ngdoc directive
 * @name publicTransAppApp.directive:times
 * @description
 * # times
 */
angular.module('publicTransAppApp')
  .directive('times', function () {
    return {
      restrict: 'E',
      scope: true,
      bindToController: {
        stop: '@',
        line: '@',
        direction: '@'
      },
      controller: 'TimesCtrl as ctrl',
      link: function postLink(scope, element, attrs, ctrl) {
        ctrl.print = function(text) {
          element.text(text);
        };

        // destroy interval fetching when destroying the directive
        element.on('$destroy', ctrl.destroy);

        // init
        ctrl.init();
      }
    };
  })
  .controller('TimesCtrl', function(lines, $interval) {
    var ctrl = this,
      intervalId;

    ctrl.fetch = function() {
      lines.getNextDepartures(ctrl.stop, ctrl.line, ctrl.direction)
        .then(function(times) {
          if(times.length) {
            ctrl.print(times.map(function(t) { return t + ' mins'; }).join(', '));
          } else {
            ctrl.print('No expected buses for now...');
          }
        });
    };

    ctrl.init = function() {
      ctrl.print('Loading...');
      ctrl.fetch();
      intervalId = $interval(ctrl.fetch, 60000);  // refresh every minute
    };

    ctrl.destroy = function() {
      $interval.cancel(intervalId);
    };
  });
