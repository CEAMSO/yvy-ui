'use strict';

/**
 * @ngdoc function
 * @name yvyUiApp.controller:MapaleafletCtrl
 * @description
 * # MapaleafletCtrl
 * Controller of the yvyUiApp
 */
angular.module('yvyUiApp')
  .controller('MapaEstablecimientosCtrl', function ($scope, establecimientosFactory) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    //Obtenemos todos los establecimientos
    $scope.data = establecimientosFactory.getEstablecimientos();
  });
