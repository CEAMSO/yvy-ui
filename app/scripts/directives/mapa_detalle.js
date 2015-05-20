'use strict';
/**
 * @ngdoc directive
 * @name yvyUiApp.directive:mapaLeaflet
 * @description
 * # mapaLeaflet
 */
angular.module('yvyUiApp')
  .directive('mapaDetalle', function ($rootScope, mapaEstablecimientoFactory) {
    return {
      restrict: 'E',
      replace: false,
      scope: {
        detalle:'='
      },
      templateUrl: 'views/templates/template_detalle.html',
      link: function postLink(scope, element, attrs) {
        var detailOpen = false;
        var crearPopup = function (){
          
          function onOpen(){
            $('#left-panel').css('margin-left', '280px');
          }

          function onClose(){
            $('#left-panel').css('margin-left', '-70px');
          }
          $('#right-panel').panelslider({
                                side: 'right',
                                duration: 1,
                                clickClose: false,
                                container: $('[ng-view]'),
                                onStartOpen: function(){
                                  $rootScope.$broadcast('detail-start-open');
                                  $('#left-panel').css('margin-left', '310px');
                                },
                                onOpen: function(){
                                  $rootScope.$broadcast('detail-open');
                                  detailOpen = true;
                                },
                                onStartClose: function(){
                                  $('#left-panel').css('margin-left', '-40px');
                                  $rootScope.$broadcast('detail-start-close');
                                },
                                onClose: function(){
                                  $rootScope.$broadcast('detail-close');
                                  detailOpen = false;
                                } 
                              });
        };
      
        scope.$watch('detalle', function(detalle){

          if(typeof detalle !== 'undefined' && detalle !== ''){
            mapaEstablecimientoFactory.getInstitucionesPorEstablecimiento(detalle)
              .then(function(data){
                scope.instituciones = data;
              });

            console.log(scope.instituciones);
            crearPopup();

            if(!detailOpen){
              $('#right-panel').click();
            }
            //scope.detalle=''; //ponemos a vacio para poder seleccionar el mismo marker nuevamente

          }else{
            //nothing to do
          }

        }, true);

        /*********************** INICIO ***********************************/

      }
    };
  });
