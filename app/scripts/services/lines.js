'use strict';

/**
 * @ngdoc service
 * @name publicTransAppApp.lines
 * @description
 * # lines
 * Service in the publicTransAppApp.
 */
angular.module('publicTransAppApp')
  .service('lines', function ($http, SFMUNI_TOKEN, BASE_API) {

    function fetchLines() {
      return $http.get(BASE_API + '/GetRoutesForAgency.aspx', {
        params: {
          token: SFMUNI_TOKEN,
          agencyName: 'SF-MUNI'
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
          r.inbound = dir.getAttribute('Name');
        }

        dir = route.querySelector('[Code=Outbound]');
        if (dir) {
          r.outbound = dir.getAttribute('Name');
        }

        return r;
      });

      return Promise.resolve(l);
    }

    return {
      getAll: function() {
        return fetchLines()
          .then(getText)
          .then(parseXML)
          .then(parseLinesInfo);
      }
    };
  });
