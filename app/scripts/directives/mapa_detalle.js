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
        detalle:'='
      },
      templateUrl: 'views/templates/template_detalle.html',
      link: function postLink(scope, element, attrs) {
        var detailOpen = false;
        var crearPopup = function (){
          var definicion = 
              '<a class="btn btn-tag tag-red" id="right-panel" href="#right-panel-link" title="Cerrar el detalle">X</a>'+
              '<br/><br/>'+
              '<h4>'+
                '<span class="label label-primary">Detalles del Establecimiento</span>'+
              '</h4>'+
              '<table id="popupTable" class="table table-striped table-bordered">'+
              '<tbody>'+
              '</tbody>'+
              '</table>';
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
            console.log(detalle);

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

            if(!detailOpen){
              $('#right-panel').click();
            }
            scope.detalle=''; //ponemos a vacio para poder seleccionar el mismo marker nuevamente

          }else{
            //nothing to do
          }

        }, true);

        /*********************** INICIO ***********************************/

      }
    };
  });
