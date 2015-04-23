'use strict';
/**
 * @ngdoc directive
 * @name yvyUiApp.directive:mapaLeaflet
 * @description
 * # mapaLeaflet
 */
angular.module('yvyUiApp')
  .directive('mapaDetalle', function () {
    return {
      restrict: 'E',
      replace: false,
      scope: {
        detalle:'='
      },
      templateUrl: 'views/template_detalle.html',
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
          angular.element('#mapa-establecimiento-popup').html(definicion);
          
          function onOpen(){
            $('#left-panel').css('margin-left', '280px');
          }

          function onClose(){
            $('#left-panel').css('margin-left', '-70px');
          }
          $('#right-panel').panelslider({
                                side: 'right',
                                duration: 300,
                                clickClose: false,
                                container: $('[ng-view]'),
                                onOpen: onOpen,
                                onClose: onClose,
                                animateCallbacks: false 
                              });
        };
      
        scope.$watch('detalle', function(detalle){

          if(typeof detalle !== 'undefined' && detalle !== ''){

            crearPopup();
          
            var marker = detalle;
            var row = '';
            var atributo = '';

            $.each(marker, function(attr, valor){
              if(attr==='nombre_barrio_localidad'){
                row = '<tr><td class="attr-title">Barrio/Localidad</td><td>'+valor+'</td></tr>';
              }else{
                atributo = _.startCase(attr.replace(/nombre/g, ''));
                row = '<tr><td class="attr-title">'+atributo+'</td><td>'+valor+'</td></tr>';
              }
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