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

    $scope.ready = false;
    var parametro = {};

    parametro = { tipo_consulta:'01' }; //Cluster por departamento

    mapaEstablecimientoFactory.getDatosCluster(parametro);

    parametro = { tipo_consulta:'11' }; //Todos los establecimentos con periodo 2014

    console.time('servicio');
    console.time('rest');
    mapaEstablecimientoFactory.getDatosEstablecimientos(parametro).then(function(data){
      $scope.ready = true;
      console.time('scope notified');
      parametro = { tipo_consulta:'02' }; //Cluster por distrito

      mapaEstablecimientoFactory.getDatosCluster(parametro);

      parametro = { tipo_consulta:'03' }; //Cluster por barrio/localidad

      mapaEstablecimientoFactory.getDatosCluster(parametro);

      //parametro = { tipo_consulta:'12' };
      //mapaEstablecimientoFactory.getDatosInstituciones(parametro);

      //parametro = { tipo_consulta:'13', establecimiento:'1101034' };
      //mapaEstablecimientoFactory.getDatosInstituciones(parametro);
      
    }); 
    
  });
