'use strict';
/**
 * @ngdoc directive
 * @name yvyUiApp.directive:mapaLeaflet
 * @description
 * # mapaLeaflet
 */
angular.module('yvyUiApp')
  .directive('mapaDetalle', function ($rootScope, mapaEstablecimientoFactory, $timeout) {
    return {
      restrict: 'E',
      replace: false,
      scope: {
        detalle:'='
      },
      templateUrl: 'views/templates/template_detalle.html',
      link: function postLink(scope, element, attrs) {
        var detailOpen = false;
        var panelslider, detalleHolder;
        var crearPopup = function (){
          panelslider = L.control.sidebar('right-panel-link', {
            position: 'right',
            autoPan: false
          });

          $rootScope.$broadcast('detail-ready', panelslider);

        };
                  
        crearPopup();
        scope.$watch('detalle', function(detalle){
          console.log('watch detalle!');
          if(detalle){
            detalleHolder = detalle;
            mapaEstablecimientoFactory.getInstitucionesPorEstablecimiento(detalle)
              .then(function(data){
                scope.instituciones = data;
                if(!detailOpen){
                  $timeout(function(){
                    //$('#right-panel').click();
                    console.log('abriendo detalle!');
                    panelslider.show();
                    scope.$apply(function(){
                      scope.detalle = detalleHolder;
                    });
                  });
                }
              });
          }

        });

        panelslider.on('hidden', function () {
          scope.$apply(function(){
            scope.detalle = null;
          })
        });

        /*********************** INICIO ***********************************/

      }
    };
  });
