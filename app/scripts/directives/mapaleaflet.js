'use strict';
/**
 * @ngdoc directive
 * @name yvyUiApp.directive:mapaLeaflet
 * @description
 * # mapaLeaflet
 */
angular.module('yvyUiApp')
  .directive('mapaLeaflet', function () {
    return {
      template: '<div id="mapa-leaflet"></div>',
      scope: {
        height: '@',
        lon: '@',
        lat: '@',
        zoom: '@'
      },
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        angular.element(document.getElementById('mapa-leaflet')).css('height', scope.height);
        if(!scope.lon)
          scope.lon = 0.0
        if(!scope.lat)
          scope.lat = 0.0
        if(!scope.zoom)
          scope.zoom = 10
        scope.map = L.map('mapa-leaflet')
          .setView([scope.lon, scope.lat], scope.zoom);
        var mapLink =
          '<a href="http://openstreetmap.org">OpenStreetMap</a>';
        L.tileLayer(
          'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; ' + mapLink +
            ' Contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © ' + mapLink,
            maxZoom: 18
          }).addTo(scope.map);
      }
    };
  });
