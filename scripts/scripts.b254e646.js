"use strict";angular.module("publicTransAppApp",["ngAnimate","ngAria","ngCookies","ngMessages","ngResource","ngRoute","ngSanitize","ngMaterial"]).config(["$routeProvider",function(a){a.when("/:lineId?",{templateUrl:"views/line.html",controller:"LineCtrl",controllerAs:"line"}).otherwise({redirectTo:"/"})}]).config(["$mdThemingProvider","$mdIconProvider",function(a,b){b.defaultIconSet("./images/svg/avatars.373ad909.svg",128).icon("menu","./images/svg/menu.b8871cf8.svg",24),a.theme("default").primaryPalette("brown").accentPalette("red")}]).constant("SFMUNI_TOKEN","ae308c6e-f5af-407e-ad91-c9259aeb9580").constant("BASE_API","https://cors.5apps.com/?uri=http://services.my511.org/Transit2.0"),angular.module("publicTransAppApp").controller("MainCtrl",["$mdSidenav",function(a){var b=this;b.toggleList=function(){a("left").toggle()}}]),angular.module("publicTransAppApp").controller("LinesCtrl",["lines","$mdSidenav","$location","$q",function(a,b,c,d){var e=this;e.selectLine=function(a){e.selected=a,c.url("/"+a.code),b("left").close()},d.when(a.getAll()).then(function(a){e.lines=a})}]),angular.module("publicTransAppApp").controller("LineCtrl",["$routeParams","$q","lines",function(a,b,c){var d=this;d.lineId=a.lineId,angular.isDefined(d.lineId)&&(d.loading=!0,b.when(c.get(d.lineId)).then(function(a){d.routes=a})["finally"](function(){d.loading=!1}))}]),angular.module("publicTransAppApp").service("lines",["$http","$httpParamSerializer","SFMUNI_TOKEN","BASE_API","idb",function(a,b,c,d,e){function f(){return g().then(h).then(i).then(j).then(e.cacheLines)}function g(){return r("/GetRoutesForAgency.aspx",{params:{token:c,agencyName:q}})}function h(a){return a.data}function i(a){var b=new DOMParser,c=b.parseFromString(a,"application/xml");return Promise.resolve(c)}function j(a){var b=a.querySelectorAll("Route"),c=Array.prototype.map.call(b,function(a){var b,c={code:a.getAttribute("Code"),name:a.getAttribute("Name")};return b=a.querySelector("[Code=Inbound]"),b&&(c.inbound={code:b.getAttribute("Code"),name:b.getAttribute("Name")}),b=a.querySelector("[Code=Outbound]"),b&&(c.outbound={code:b.getAttribute("Code"),name:b.getAttribute("Name")}),c});return Promise.resolve(c)}function k(a){return l(a).then(h).then(i).then(m).then(e.cacheLine)}function l(a){return r("/GetStopsForRoutes.aspx",{params:{token:c,routeIDF:q+"~"+a+"~Inbound|"+q+"~"+a+"~Outbound"}})}function m(a){function b(a){return Array.prototype.map.call(a,function(a){return{code:a.getAttribute("StopCode"),name:a.getAttribute("name")}})}var c=a.querySelector("Route"),d=a.querySelector('RouteDirection[Code="Inbound"]'),e=a.querySelector('RouteDirection[Code="Outbound"]'),f={code:c.getAttribute("Code"),name:c.getAttribute("Name"),inbound:{code:d.getAttribute("Code"),name:d.getAttribute("Name"),stops:b(d.querySelectorAll("Stop"))},outbound:{code:e.getAttribute("Code"),name:e.getAttribute("Name"),stops:b(e.querySelectorAll("Stop"))}};return Promise.resolve(f)}function n(a,b,c){return o(a).then(h).then(i).then(p(b,c)).then(e.cacheStop(a,b,c))}function o(a){return r("/GetNextDeparturesByStopCode.aspx",{params:{token:c,stopcode:a}})}function p(a,b){return function(c){var d=c.querySelectorAll('Route[Code="'+a+'"] RouteDirection[Code="'+b+'"] DepartureTime');return d=d?Array.prototype.map.call(d,function(a){return a.innerHTML}):[],Promise.resolve(d)}}var q="SF-MUNI",r=function(c,e){var f=d+encodeURIComponent(c+"?"+b(e.params));return delete e.params,a.get(f,e)};return{getAll:function(){return e.getLines()["catch"](f)},get:function(a){return e.getLine(a)["catch"](function(){return k(a)})},getNextDepartures:function(a,b,c,d){return d?n(a,b,c):e.getStop(a,b,c)["catch"](function(){return n(a,b,c)})}}}]),angular.module("publicTransAppApp").directive("times",function(){return{restrict:"E",scope:!0,bindToController:{stop:"@",line:"@",direction:"@"},controller:"TimesCtrl as ctrl",link:function(a,b,c,d){d.print=function(a){b.text(a)},b.on("$destroy",d.destroy),d.init()}}}).controller("TimesCtrl",["lines","$interval",function(a,b){var c,d,e,f=this;f.fetch=function(c){a.getNextDepartures(f.stop,f.line,f.direction,c).then(function(a){a&&a.length?(f.printLiveTimes(a),b.cancel(e),e=b(function(){return f.printLiveTimes(this)}.bind(a),1e4)):f.print("No expected buses for now...")})},f.printLiveTimes=function(a){var b=(new Date).getTime();d=d||b;var c=Math.floor((b-d)/6e4),e=a.map(function(a){return a-c}).filter(function(a){return a>0}).map(function(a){return a+" mins"}).join(", ");e.length||(e="No expected buses for now..."),f.print(e)},f.init=function(){f.print("Loading..."),f.fetch(),c=b(function(){return f.fetch(!0)},6e4)},f.destroy=function(){b.cancel(c),b.cancel(e)}}]),angular.module("publicTransAppApp").directive("swupdater",["$mdToast","$window",function(a,b){return{restrict:"E",link:function(){function c(){navigator.serviceWorker&&navigator.serviceWorker.controller&&navigator.serviceWorker.getRegistration().then(function(a){return console.log("[SWupdater] working!"),a.waiting?void d(a.waiting):a.installing?void e(a.installing):(a.addEventListener("updatefound",function(){e(a.installing)}),void navigator.serviceWorker.addEventListener("controllerchange",function(){b.location.reload()}))})["catch"](function(){console.log("[SWupdater] failed loading...")})}function d(b){var c=a.simple().textContent("New version available").action("Refresh").highlightAction(!0).position("top right").hideDelay(!1);a.show(c).then(function(a){"ok"===a&&b.postMessage({action:"skipWaiting"})})}function e(a){a.addEventListener("statechange",function(){"installed"===a.state&&d(a)})}c()}}}]),angular.module("publicTransAppApp").factory("idb",["$log",function(a){function b(){return navigator.serviceWorker?idb.open("public-trans-app",1,function(a){var b;switch(a.oldVersion){case 0:b=a.createObjectStore("lines",{keyPath:"code"}),b.createIndex("by-name","name")}}):Promise.resolve()}var c=b();return{getDB:function(){return c},cacheLines:function(b){return b?c.then(function(c){if(c){var d=c.transaction("lines","readwrite"),e=d.objectStore("lines");b.forEach(function(a){e.put(a)}),a.log("[idb] Lines cached")}return Promise.resolve(b)}):Promise.resolve(b)},getLines:function(){return c.then(function(b){return b?b.transaction("lines").objectStore("lines").getAll().then(function(b){return b&&b.length?(a.log("[idb] Serving cached lines..."),Promise.resolve(b)):(a.log("[idb] No cached lines found..."),Promise.reject())}):Promise.reject()})},clearLines:function(){return c.then(function(a){return a?a.transaction("lines").objectStore("lines").openCursor().then(function b(a){return a?(a["delete"](),a["continue"]().then(b)):void 0}):Promise.resolve()})},cacheLine:function(b){return b?c.then(function(c){return c&&(c.transaction("lines","readwrite").objectStore("lines").put(b),a.log("[idb] Line cached",b)),Promise.resolve(b)}):Promise.resolve(b)},getLine:function(b){return c.then(function(c){return c?c.transaction("lines").objectStore("lines").get(b).then(function(b){return b?b.inbound&&!b.inbound.stops||b.outbound&&!b.outbound.stops?(a.log("[idb] Stop info not found for this line..."),Promise.reject()):(a.log("[idb] Serving cached line including stops...",b),Promise.resolve(b)):(a.log("[idb] No cached line found..."),Promise.reject())}):Promise.reject()})},cacheStop:function(b,d,e){return function(f){return f&&b&&d&&e?c.then(function(c){function g(c){if(!c)return a.log("[idb] No cached line found to cache stop times..."),Promise.resolve(f);if(e=c[e.toLowerCase()],e&&e.stops&&e.stops.length){var g=e.stops.find(function(a){return a.code===b});g?(g.times=f,g.lastFetch=(new Date).getTime(),h.put(c)):a.log("[idb] Invalid stop to cache stop times...",b,d,e,c)}else a.log("[idb] Invalid direction to cache stop times...",b,d,e,c);return Promise.resolve(f)}if(!c)return Promise.resolve(f);var h=c.transaction("lines","readwrite").objectStore("lines");return h.get(d).then(g)}):Promise.resolve(f)}},getStop:function(b,c,d){return this.getLine(c).then(function(e){if(d=e[d.toLowerCase()],d&&d.stops&&d.stops.length){var f=d.stops.find(function(a){return a.code===b});if(f&&f.times){a.log("[idb] found cached times...",b,f.times,f.lastFetch);var g=(new Date).getTime(),h=Math.floor((g-(f.lastFetch||g))/6e4);return Promise.resolve(f.times.map(function(a){return a-h}).filter(function(a){return a>0}))}a.log("[idb] no cached times for stop...",b,c,d,e)}else a.log("[idb] Invalid direction for stop times...",b,c,d,e);return Promise.reject()})}}}]),angular.module("publicTransAppApp").run(["$templateCache",function(a){a.put("views/line.html",'<div id="routeInfo" ng-show="line.lineId"> <md-progress-linear ng-show="line.loading" md-mode="indeterminate"></md-progress-linear> <md-tabs> <md-tab label="Route {{ line.lineId }}" ng-disabled="true"> <md-content class="md-padding"></md-content> </md-tab> <md-tab label="Inbound"> <md-list flex> <md-subheader class="md-no-sticky">{{ line.routes.inbound.name }}</md-subheader> <md-list-item class="md-2-line" ng-repeat="stop in line.routes.inbound.stops"> <div class="md-list-item-text" layout="column"> <h3>{{ stop.name }}</h3> <p><times stop="{{stop.code}}" line="{{line.routes.code}}" direction="{{line.routes.inbound.code}}"></times></p> </div> </md-list-item> </md-list> </md-tab> <md-tab label="Outbound"> <md-list flex> <md-subheader class="md-no-sticky">{{ line.routes.outbound.name }}</md-subheader> <md-list-item class="md-2-line" ng-repeat="stop in line.routes.outbound.stops"> <div class="md-list-item-text" layout="column"> <h3>{{ stop.name }}</h3> <p><times stop="{{stop.code}}" line="{{line.routes.code}}" direction="{{line.routes.outbound.code}}"></times></p> </div> </md-list-item> </md-list> </md-tab> </md-tabs> </div> <div id="welcome" ng-hide="line.lineId"> <div class="jumbotron"> <h1>\'Allo, \'Allo!</h1> <p class="lead"> <img src="images/yeoman.8cb970fb.png" alt="I\'m Yeoman"><br> Welcome! Select one line in the side menu to start! </p> </div> </div>'),a.put("views/sidenav.html",'<md-sidenav md-is-locked-open="$mdMedia(\'gt-sm\')" class="md-whiteframe-z2" md-component-id="left"> <md-list flex ng-controller="LinesCtrl as lc"> <md-subheader class="md-no-sticky">{{ lc.lines.length }} lines available</md-subheader> <md-list-item ng-click="lc.selectLine(line)" class="md-3-line" ng-repeat="line in lc.lines" ng-class="{\'selected\' : line === lc.selected }"> <div class="md-list-item-text" layout="column"> <h3>{{ line.name }}</h3> <p>{{ line.inbound.name }}</p> <p>{{ line.outbound.name }}</p> </div> </md-list-item> </md-list> </md-sidenav>')}]);