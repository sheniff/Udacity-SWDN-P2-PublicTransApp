'use strict';

/**
 * @ngdoc overview
 * @name publicTransAppApp
 * @description
 * # publicTransAppApp
 *
 * Main module of the application.
 */
angular
  .module('publicTransAppApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngMaterial'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/:lineId?', {
        templateUrl: 'views/line.html',
        controller: 'LineCtrl',
        controllerAs: 'line'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .config(function($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $httpProvider.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
  })
  .config(function($mdThemingProvider, $mdIconProvider){
    $mdIconProvider
      .defaultIconSet('./images/svg/avatars.svg', 128)
      .icon('menu', './images/svg/menu.svg', 24);
      $mdThemingProvider.theme('default')
        .primaryPalette('brown')
        .accentPalette('red');
  })
  .constant('SFMUNI_TOKEN', 'ae308c6e-f5af-407e-ad91-c9259aeb9580')
  .constant('BASE_API', 'https://crossorigin.me/http://services.my511.org/Transit2.0');
  // .constant('BASE_API', 'https://jsonp.afeld.me/?url=http://services.my511.org/Transit2.0');
  // .constant('BASE_API', 'http://services.my511.org/Transit2.0');
