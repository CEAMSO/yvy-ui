'use strict';
/**
 * @ngdoc directive
 * @name yvyUiApp.directive:mapaLeaflet
 * @description
 * # mapaLeaflet
 */
angular.module('yvyUiApp')
  .directive('mapaFiltro', function (mapaEstablecimientoFactory, $rootScope) {
    return {
      restrict: 'E',
      replace: false,
      scope: {
        data:'=',
        filtro:'=',
        local:'=',
        periodo: '='
      },
      templateUrl: 'views/templates/template_filtro.html',
      link: function postLink(scope, element, attrs) {

        //Botones, el primer parametro es el ID del filtro, el segundo parametro representa la lista de valores posibles
        var filtrosBotones = {nombre_zona:['RURAL', 'URBANA'], proyecto111:['SI', 'NO'], proyecto822:['SI', 'NO']};

        //Definicion de un array, donde cada indice representa el filtro (Ej: departamento, distrito), donde cada indice esta asociado a un array con los valores posibles para el mismo
        var filtrosSelect = {nombre_departamento:[], nombre_distrito:[], nombre_barrio_localidad:[]};

        /*
        Funcion que se ejecuta por cada parametro nuevo de filtrado. En la misma se reconstruyen los filtros, y posteriormente,
        se actualiza la variable de scope "filtro" (sobre la cual, la directiva "mapa_establecimientos.js" esta realizando un watch
        que permite la aplicacion de los filtros sobre el mapa)
        */
        scope.updateFiltro = function(){
          
          var localFiltro = scope.local;
          var filtroBase = [];
          var f = '';

          //Filtros con Select
          $.each(localFiltro, function(attr, value){
            f = {
              atributo:attr,
              valor:value,
              eval: function(e){
                return (this.valor.length===0 || _.includes(this.valor, e));
              }
            };
            filtroBase.push(f);
          });

          //Filtros con Botones
          var content = [];
          $.each(filtrosBotones, function(attr, value){
            content = get_selected_checkbox( '#filtro_'+attr+' label' );
            if (content.length > 0){
              f = {
                atributo:attr,
                valor:content,
                eval: function(e){
                  return (this.valor==='' || _.includes(this.valor, e));
                }
              };
              filtroBase.push(f);
            }
          });
          scope.filtro = filtroBase;

        };


        /* Funcion que inicializa los filtros de manera dinamica */
        var cargar = function(establecimientos){
          
          //Carga de los distintos valores para cada filtro
          filtrosSelect = _(filtrosSelect).mapValues(function(value, key){
            return _(establecimientos.features).map(function(e){ return e.properties[key]; }).uniq().value().sort();
          }).value();

          if (primeraVez === true) {

            //Append a las listas desplegables
            console.time('loop cargar');
            $.each(filtrosSelect, function(attr, array){ //ciclo por cada filtro existente
              var options = _.reduce(array, function(memo, a){ return memo + '<option value="'+a+'">'+a+'</option>'; }, '');
              document.getElementById('filtro_'+ attr).innerHTML = options;
              $('#filtro_'+attr).select2();
            });
            console.timeEnd('loop cargar');

            //Cargamos los valores de filtros para los botones
            var boton = '';
            $.each(filtrosBotones, function(attr, array){
              boton = '#filtro_'+attr;
              setup_checkbox_values(boton, array);
            });

            //Definimos un onChange sobre cada boton, de modo a que los cambios hechos sobre el filtro se reflejen en el mapa
            $('#filtro_nombre_zona label input, #filtro_proyecto111 label input, #filtro_proyecto822 label input').change(function(){
              var self = $(this);
              var item = self.parent();
              (item.hasClass('active')) ? item.removeClass('active focus'):item.addClass('active');
              scope.$apply(function() {
                scope.updateFiltro();
              });
            });

            primeraVez = false;
          
          }else{
            
            $.each(filtrosSelect, function(attr, array){ //ciclo por cada filtro existente
              $('#filtro_'+attr).find('option').remove().end();
              var options = _.reduce(array, function(memo, a){ return memo + '<option value="'+a+'">'+a+'</option>'; }, '');
              document.getElementById('filtro_'+ attr).innerHTML = options;
            });

          }

        };

        /* Funcion que crea los botones del filtro como selects envueltos*/
        function setup_checkbox_values(selector, filtered){
            
          var values = filtered;            
          _.each(values, function(d){
            var label = sprintf('<label class="btn btn-sm btn-primary filtro-ancho"><input type="checkbox">%s</label>', d);
            $(selector).append(label);
          });

        }

        /* Funcion que obtiene los valores seleccionados del filtro */
        function get_selected_checkbox(selector){
          var labels = $(selector);
          var enabled = [];
          var text = '';
          _.each(labels, function(l){ //Verificamos cada label/boton que compone el filtro
            text = l.innerText || l.textContent;
            if(text){ //Texto del label
              if(l.children[0].checked){ //Si esta chequeado, lo agregamos
                enabled.push(text);
              }
            }
          });
          return enabled;
        }

        function initControl(){
          var panelSlider = L.control.sidebar('left-panel-link', {
            position: 'left'
          });
          panelSlider.on('hidden', function(){
            $('#filtroDepartamento').select2('close');
            $('#filtroDistrito').select2('close');
            $('#filtroBarrioLocalidad').select2('close');
            $('#filtroCodigoEstablecimiento').select2('close');
          });
          
          $rootScope.$broadcast('filter-ready', panelSlider);
        }


        /*********************** INICIO ***********************************/

        var establecimientos = '';
        var primeraVez = true;

        scope.$watch('periodo', function(periodo) {
          if(periodo){
            mapaEstablecimientoFactory.getDatosEstablecimientos({ 'periodo': periodo }).then(function(value){
              establecimientos = value;
              if(scope.local){
                scope.local['periodo']=periodo
              }else{
                scope.local = { periodo:periodo };
                initControl();
              }
              scope.updateFiltro();
              console.time('cargar establecimientos');
              cargar(establecimientos);
              console.timeEnd('cargar establecimientos');
            });
          }
        });

      }
    };
  });