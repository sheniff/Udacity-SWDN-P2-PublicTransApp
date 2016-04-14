'use strict';

/**
 * @ngdoc service
 * @name publicTransAppApp.lines
 * @description
 * # lines
 * Service in the publicTransAppApp.
 */
angular.module('publicTransAppApp')
  .service('lines', function ($http, SFMUNI_TOKEN, BASE_API, idb) {
    var agencyName = 'SF-MUNI';

    // *******
    // Lines
    // *******

    function getLines() {
      return fetchLines()
        .then(getText)
        .then(parseXML)
        .then(parseLinesInfo)
        .then(idb.cacheLines);
    }

    function fetchLines() {
      return $http.get(BASE_API + '/GetRoutesForAgency.aspx', {
        params: {
          token: SFMUNI_TOKEN,
          agencyName: agencyName
        }
      });
    }

    function getText(res) {
      return res.data;
    }

    function parseXML(string) {
      var parser = new DOMParser();
      var xml = parser.parseFromString(string, 'application/xml');
      return Promise.resolve(xml);
    }

    function parseLinesInfo(xml) {
      var lines = xml.querySelectorAll('Route');
      var l = Array.prototype.map.call(lines, function (route) {
        var r = {
          code: route.getAttribute('Code'),
          name: route.getAttribute('Name')
        }, dir;

        dir = route.querySelector('[Code=Inbound]');
        if (dir) {
          r.inbound = {
            code: dir.getAttribute('Code'),
            name: dir.getAttribute('Name')
          };
        }

        dir = route.querySelector('[Code=Outbound]');
        if (dir) {
          r.outbound = {
            code: dir.getAttribute('Code'),
            name: dir.getAttribute('Name')
          };
        }

        return r;
      });

      return Promise.resolve(l);
    }

    // *******
    // Line
    // *******

    function getLine(lineId) {
      return fetchLine(lineId)
        .then(getText)
        .then(parseXML)
        .then(parseLineInfo)
        .then(idb.cacheLine);
    }

    function fetchLine(lineId) {
      return $http.get(BASE_API + '/GetStopsForRoutes.aspx', {
        params: {
          token: SFMUNI_TOKEN,
          routeIDF: agencyName + '~' + lineId + '~Inbound|' + agencyName + '~' + lineId + '~Outbound'
        }
      });
    }

    function parseLineInfo(xml) {
      var routeInfo = xml.querySelector('Route');
      var inboundInfo = xml.querySelector('RouteDirection[Code="Inbound"]');
      var outboundInfo = xml.querySelector('RouteDirection[Code="Outbound"]');

      function parseStops(stops) {
        return Array.prototype.map.call(stops, function (stop) {
          return {
            code: stop.getAttribute('StopCode'),
            name: stop.getAttribute('name')
          };
        });
      }

      var r = {
        code: routeInfo.getAttribute('Code'),
        name: routeInfo.getAttribute('Name'),
        inbound: {
          code: inboundInfo.getAttribute('Code'),
          name: inboundInfo.getAttribute('Name'),
          stops: parseStops(inboundInfo.querySelectorAll('Stop'))
        },
        outbound: {
          code: outboundInfo.getAttribute('Code'),
          name: outboundInfo.getAttribute('Name'),
          stops: parseStops(outboundInfo.querySelectorAll('Stop'))
        }
      };

      return Promise.resolve(r);
    }

    // ************
    // Line times
    // ************

    function getStop(stopId, lineId, direction) {
      return fetchStop(stopId)
        .then(getText)
        .then(parseXML)
        .then(getTimesForLine(lineId, direction))
        .then(idb.cacheStop(stopId, lineId, direction));
    }

    function fetchStop(stopId) {
      return $http.get(BASE_API + '/GetNextDeparturesByStopCode.aspx', {
        params: {
          token: SFMUNI_TOKEN,
          stopcode: stopId
        }
      });
    }

    function getTimesForLine(lineId, direction) {
      return function(departures) {
        var times = departures.querySelectorAll('Route[Code="' + lineId + '"] RouteDirection[Code="' + direction + '"] DepartureTime');

        times = times ? Array.prototype.map.call(times, function(time) { return time.innerHTML; }) : [];

        return Promise.resolve(times);
      };
    }

    return {
      getAll: function() {
        return idb.getLines()
          .catch(getLines);
      },

      get: function(lineId) {
        return idb.getLine(lineId)
          .catch(function() {
            return getLine(lineId);
          });
      },

      getNextDepartures: function(stopId, lineId, direction, bypassCache) {
        if (bypassCache) {
          return getStop(stopId, lineId, direction);
        }

        return idb.getStop(stopId, lineId, direction)
          .catch(function() {
            return getStop(stopId, lineId, direction);
          });
      }
    };
  });
