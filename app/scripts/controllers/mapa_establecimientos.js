'use strict';

/**
 * @ngdoc function
 * @name yvyUiApp.controller:MapaleafletCtrl
 * @description
 * # MapaleafletCtrl
 * Controller of the yvyUiApp
 */
angular.module('yvyUiApp')
  .controller('MapaEstablecimientosCtrl', function ($scope, mapaEstablecimientoFactory) {

    $scope.periodo = '';
    var parametro = {};

    console.time('servicio');
    console.time('rest');

    parametro = { tipo_consulta:'01' }; //Cluster por departamento

    mapaEstablecimientoFactory.getDatosCluster(parametro).then(
      
      mapaEstablecimientoFactory.getDatosEstablecimientos({ periodo:'2014' }).then(function(data){
        $scope.periodo = '2014';
        console.time('scope notified');
        parametro = { tipo_consulta:'02' }; //Cluster por distrito

        mapaEstablecimientoFactory.getDatosCluster(parametro);

        parametro = { tipo_consulta:'03' }; //Cluster por barrio/localidad

        mapaEstablecimientoFactory.getDatosCluster(parametro);

        parametro = { tipo_consulta:'11', periodo:'2012' };

        mapaEstablecimientoFactory.getDatosEstablecimientos(parametro).then(function(data){
          //console.log('Establecimientos 2012');
        });
      })
      
    )

    $scope.updateEstablecimientos = function(periodo){
      $scope.periodo = periodo;
    };
    
  });