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
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    var parametro = {};

    parametro = { tipo_consulta:'01' }; //Cluster por departamento

    mapaEstablecimientoFactory.getDatosCluster(parametro).then(function(data){
      localStorage['cluster_departamento'] = JSON.stringify(data.data);
    }); 

    parametro = { tipo_consulta:'02' }; //Cluster por distrito

    mapaEstablecimientoFactory.getDatosCluster(parametro).then(function(data){
      localStorage['cluster_distrito'] = JSON.stringify(data.data);
    }); 

    parametro = { tipo_consulta:'03' }; //Cluster por barrio/localidad

    mapaEstablecimientoFactory.getDatosCluster(parametro).then(function(data){
      localStorage['cluster_barrio_localidad'] = JSON.stringify(data.data);
    });

    parametro = { tipo_consulta:'11' }; //Todos los establecimentos con periodo 2014

    mapaEstablecimientoFactory.getDatosEstablecimientos(parametro).then(function(data){
      $scope.data = data.data;
    }); 

    $scope.getInstituciones = function(establecimientos){
      if( typeof establecimientos !== "undefined" || establecimientos=='' ) {

        parametro = { tipo_consulta:'12', establecimientos:JSON.stringify(establecimientos) }; //Todos los instituciones en base a los establecimientos filtrados
        mapaEstablecimientoFactory.getDatosEstablecimientos(parametro).then(function(data){
          
          //console.log(data.data); //lista de instituciones
          return data.data; //lista de instituciones
          
          /* Group By por departamento*/
          /*
          var i = data.data;
          var p = _.groupBy(i, 'nombre_departamento');
          console.log(p);
          */
        });

      }else{
        console.log('No existen establecimientos');
      }
    };
    
  });
