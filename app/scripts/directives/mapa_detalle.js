'use strict';
/**
 * @ngdoc directive
 * @name yvyUiApp.directive:mapaLeaflet
 * @description
 * # mapaLeaflet
 */
angular.module('yvyUiApp')
  .directive('mapaDetalle', function ($rootScope) {
    return {
      restrict: 'E',
      replace: false,
      scope: {
        detalle:"="
      },
      template:
      '<div id="right-panel-link" class="right-panel" role="navigation">'+
          '<div id="mapa-establecimiento-popup"></div>'+
      '</div>',
      link: function postLink(scope, element, attrs) {

        var crearPopup = function (){
          var definicion = 
              '<h3><span class="label label-info">Detalles del Establecimiento</span></h3><br/>'+
              '<table id="popupTable" class="table table-striped table-bordered">'+
              '<tbody>'+
              '</tbody>'+
              '</table>'+
              '<br/>'+
              '<a class="btn btn-tag tag" id="right-panel" href="#right-panel-link">¿Finalizar la Consulta?</a>';
          angular.element("#mapa-establecimiento-popup").html(definicion);
          
          function onStartOpen(){
            //$('#left-panel').css('margin-left', '280px');
          }

          function onStartClose(){
            //$('#left-panel').css('margin-left', '-70px');
          }

          $('#right-panel').panelslider({
                                side: 'right',
                                duration: 300,
                                clickClose: false,
                                container: $('[ng-view]'),
                                onOpen: function(){
                                  $rootScope.$broadcast('detail-open');
                                },
                                onStartClose: function(){
                                  $rootScope.$broadcast('detail-close');
                                } 
                              });
        }
      
        scope.$watch('detalle', function(detalle){

          if(typeof detalle !== "undefined" && detalle !== ''){

            crearPopup();
          
            var marker = detalle;
            var row = '';          

            $.each(marker, function(attr, valor){
              if(attr=='barrioLocalidad')
                row = '<tr><td class="attr-title">Barrio/Localidad</td><td>'+valor+'</td></tr>';
              else if(attr=='codigoEstablecimiento')
                row = '<tr><td class="attr-title">Codigo Establecimiento</td><td>'+valor+'</td></tr>';
              else
                row = '<tr><td class="attr-title">'+_.capitalize(attr)+'</td><td>'+valor+'</td></tr>';
              $('#popupTable > tbody:last').append(row);
            });

            $('#right-panel').click();
            scope.detalle=''; //ponemos a vacio para poder seleccionar el mismo marker nuevamente

          }else{
            //nothing to do
          }

        }, true);

        /*********************** INICIO ***********************************/

      }
    };
  });