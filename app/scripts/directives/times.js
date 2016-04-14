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
      intervalId,
      firstFetchAt,
      liveTimesIntervalId;

    ctrl.fetch = function(bypassCache) {
      lines.getNextDepartures(ctrl.stop, ctrl.line, ctrl.direction, bypassCache)
        .then(function(times) {
          if(times && times.length) {

            ctrl.printLiveTimes(times);

            // automatically update times every 10 seconds
            $interval.cancel(liveTimesIntervalId);

            liveTimesIntervalId = $interval(function() {
              return ctrl.printLiveTimes(this);
            }.bind(times), 10000);

          } else {
            ctrl.print('No expected buses for now...');
          }
        });
    };

    ctrl.printLiveTimes = function(times) {
      var now = new Date().getTime();
      firstFetchAt = firstFetchAt || now;
      var elapsedMins = Math.floor((now - firstFetchAt) / 60000);
      var result = times.map(function(t) { return t - elapsedMins; })
                      .filter(function(t) { return t > 0; })
                      .map(function(t) { return t + ' mins'; })
                      .join(', ');

      if(!result.length) {
        result = 'No expected buses for now...';
      }

      ctrl.print(result);
    };

    ctrl.init = function() {
      ctrl.print('Loading...');
      ctrl.fetch();
      intervalId = $interval(function() {
        return ctrl.fetch(true);
      }, 60000);  // refresh every minute
    };

    ctrl.destroy = function() {
      $interval.cancel(intervalId);
      $interval.cancel(liveTimesIntervalId);
    };
  });
