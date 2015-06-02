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

          panelslider = $('#right-panel').panelslider({
                                side: 'right',
                                duration: 1,
                                clickClose: false,
                                container: $('[ng-view]'),
                                onStartOpen: function(){
                                  $rootScope.$broadcast('detail-start-open');
                                  $('#left-panel').css('margin-left', '410px');
                                  $('.leaflet-control-zoom').css('margin-left', '460px');
                                },
                                onOpen: function(){
                                  $rootScope.$broadcast('detail-open');
                                  detailOpen = true;
                                },
                                onStartClose: function(){
                                  $('#left-panel').css('margin-left', '-40px');
                                  $('.leaflet-control-zoom').css('margin-left', '10px');
                                  $rootScope.$broadcast('detail-start-close');
                                },
                                onClose: function(){
                                  $rootScope.$broadcast('detail-close');
                                  detailOpen = false;
                                } 
                              });
        };
                  
        crearPopup();
        scope.$watch('detalle', function(detalle){

          if(detalle){
            detalleHolder = detalle;
            mapaEstablecimientoFactory.getInstitucionesPorEstablecimiento(detalle)
              .then(function(data){
                scope.instituciones = data;
                if(!detailOpen){
                  $timeout(function(){
                    $('#right-panel').click();
                    scope.$apply(function(){
                      scope.detalle = detalleHolder;
                    });
                  });
                }
              });
          }

        });

        scope.unset = function(){
          scope.detalle = null;
        }

        /*********************** INICIO ***********************************/

      }
    };
  });
