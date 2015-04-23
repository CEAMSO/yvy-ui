'use strict';
/**
 * @ngdoc directive
 * @name yvyUiApp.directive:mapaLeaflet
 * @description
 * # mapaLeaflet
 */
angular.module('yvyUiApp')
  .directive('mapaFiltro', function () {
    return {
      restrict: 'E',
      replace: false,
      scope: {
        data:'=',
        filtro:'=',
        local:'='
      },
      template:
      '<div id="left-panel-link" class="left-panel" role="navigation">'+
        '<div id="mapa-filtro">'+
          '<h4>Periodo</h4>'+
          '<div id="filtro_periodo" class="btn-group-vertical" data-toggle="buttons"></div>'+
          '<h4>Codigo Establecimiento</h4>'+
          '<select multiple id="filtro_codigo_establecimiento" name="filtro_codigo_establecimiento" class="filtro-ancho" ng-model="local.codigo_establecimiento" ng-change="updateFiltro(local)"></select><br/>'+
          '<h4>Departamento</h4>'+
          '<select multiple id="filtro_nombre_departamento" name="filtro_nombre_departamento" class="filtro-ancho" ng-model="local.nombre_departamento" ng-change="updateFiltro(local)"></select><br/>'+
          '<h4>Distrito</h4>'+
          '<select multiple id="filtro_nombre_distrito" name="filtro_nombre_distrito" class="filtro-ancho" ng-model="local.nombre_distrito" ng-change="updateFiltro(local)"></select><br/>'+
          '<h4>Barrio/Localidad</h4>'+
          '<select multiple id="filtro_nombre_barrio_localidad" name="filtro_nombre_barrio_localidad" class="filtro-ancho" ng-model="local.nombre_barrio_localidad" ng-change="updateFiltro(local)"></select><br/>'+
          '<h4>Zona</h4>'+
          '<div id="filtro_nombre_zona" class="btn-group-vertical" data-toggle="buttons"></div>'+
          '<h4>Proyecto 111</h4>'+
          '<div id="filtro_proyecto111" class="btn-group-vertical" data-toggle="buttons"></div>'+
          '<h4>Proyecto 822</h4>'+
          '<div id="filtro_proyecto822" class="btn-group-vertical" data-toggle="buttons"></div>'+
        '</div>'+
        '<br/>'+
      '</div>',
      link: function postLink(scope, element, attrs) {
        //Botones, el primer parametro es el ID del filtro, el segundo parametro representa la lista de valores posibles
        var filtrosBotones = {periodo: ['2014', '2012'], nombre_zona:['RURAL', 'URBANA'], proyecto111:['SI', 'NO'], proyecto822:['SI', 'NO']};

        //Definicion de un array, donde cada indice representa el filtro (Ej: departamento, distrito), donde cada indice esta asociado a un array con los valores posibles para el mismo
        var filtrosSelect = {codigo_establecimiento:[] , nombre_departamento:[], nombre_distrito:[], nombre_barrio_localidad:[]};

        /* Funcion que inicializa los filtros de manera dinamica */
        var cargar = function(establecimientos){
          
          //Carga de los distintos valores para cada filtro
          var result = true;
          $.each(establecimientos.features, function(index, e){
            $.each(e.properties, function(attr, val){
              if(_.has(filtrosSelect, attr)){
                result = _.includes(filtrosSelect[attr], val); //Verifica si el campo ya fue cargado anteriormente. True -> Si, False -> No.
                if (result===false){ filtrosSelect[attr].push(val); } 
              }
            });
          });

          //Ordenacion de los valores de cada filtro
          $.each(filtrosSelect, function(index, value){
              value.sort();
          });

          //Append a las listas desplegables
          var firstTime;
          $.each(filtrosSelect, function(attr, array){ //ciclo por cada filtro existe
            firstTime=true;
            $.each(array, function(index, a){
              $('#filtro_'+attr).append('<option value="'+a+'">'+a+'</option>');
            });
          });

          //Convertimos a Select2 cada filtro correspondiente a una lista desplegable
          $.each(filtrosSelect, function(attr, array){
            $('#filtro_'+attr).select2();
          });
          
          //Cargamos los valores de filtros para los botones
          var boton = '';
          $.each(filtrosBotones, function(attr, array){
            boton = '#filtro_'+attr;
            setup_checkbox_values(boton, array);
          });

          // Convertimos el grupo de checboxes de periodo en algo similar a un grupo de radio buttons
          $('#filtro_periodo label.btn').click(function(){
            var self = $(this);
            $(this).children('input:checkbox').each(function(){
              if(!this.checked){
                self.siblings('label.btn').each(function(){
                  $(this).children('input:checkbox').each(function(){
                    $(this).attr('checked', false);
                    $(this).parent().removeClass('active');
                  });
                });
              }else{
                //VER COMO MANTENER SELECCIONADO AL MENOS
                //this.parentNode.classList.add('active');
                //this.checked=true;
              }
            });
          });

          //Dejamos seleccionado 2014 como valor por defecto del PERIODO
          _.each($('#filtro_periodo label'), function(l){
            if(l.innerText==='2014'){
              l.classList.add('active');
              l.children[0].checked=true;
            }
          });

          scope.local={periodo:'2014'};
          scope.updateFiltro(scope.local);

          //Definimos un onChange sobre cada boton, de modo a que los cambios hechos sobre el filtro se reflejen en el mapa
          $('#filtro_nombre_zona label input, #filtro_proyecto111 label input, #filtro_proyecto822 label input').change(function(){
            scope.$apply(function () {
              scope.updateFiltro(scope.local);
            });
          });

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
          _.each(labels, function(l){ //Verificamos cada label/boton que compone el filtro
            if(l.innerText){ //Texto del label
              if (l.children[0].checked){ //Si esta chequeado, lo agregamos
                enabled.push(l.innerText);
              }
            }
          });
          return enabled;
        }

        /*
        Funcion que se ejecuta por cada parametro nuevo de filtrado. En la misma se reconstruyen los filtros, y posteriormente,
        se actualiza la variable de scope "filtro" (sobre la cual, la directiva "mapa_establecimientos.js" esta realizando un watch
        que permite la aplicacion de los filtros sobre el mapa)
        */
        scope.updateFiltro = function(localFiltro){

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

        /*********************** INICIO ***********************************/

        var establecimientos = '';

        var unwatch =  scope.$watch('data', function(data) {
          if(data){
            unwatch(); //Remove the watch
            establecimientos = data;
            cargar(establecimientos);
          }
        });

      }
    };
  });