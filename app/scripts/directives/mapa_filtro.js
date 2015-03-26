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
        data:"=",
        filtro:"=",
        local:"="
      },
      template:
      '<div id="left-panel-link" class="left-panel" role="navigation">'+
        '<div id="mapa-filtro">'+
          '<h4>Periodo</h4>'+
          '<select id="filtroPeriodo" name="filtroPeriodo" ng-model="local.periodo" ng-change="updateFiltro(local)"></select><br/>'+
          '<h4>Departamento</h4>'+
          '<select id="filtroDepartamento" name="filtroDepartamento" ng-model="local.departamento" ng-change="updateFiltro(local)"></select><br/>'+
          '<h4>Distrito</h4>'+
          '<select id="filtroDistrito" name="filtroDistrito" ng-model="local.distrito" ng-change="updateFiltro(local)"></select><br/>'+
          '<h4>Barrio/Localidad</h4>'+
          '<select id="filtroBarrioLocalidad" name="filtroBarrioLocalidad" ng-model="local.barrioLocalidad" ng-change="updateFiltro(local)"></select><br/>'+
          '<h4>Zona</h4>'+
          '<select id="filtroZona" name="filtroZona" ng-model="local.zona" ng-change="updateFiltro(local)"></select><br/>'+
          '<h4>Proyecto 111</h4>'+
          '<select id="filtroProyecto111" name="filtroProyecto111" ng-model="local.proyecto111" ng-change="updateFiltro(local)"></select><br/>'+
          '<h4>Proyecto 822</h4>'+
          '<select id="filtroProyecto822" name="filtroProyecto822" ng-model="local.proyecto822" ng-change="updateFiltro(local)"></select><br/>'+
        '</div>'+
      '</div>',
      link: function postLink(scope, element, attrs) {

        /*
        Funcion que inicializa los filtros de manera dinamica
        */
        var cargar = function(establecimientos){
          //Definicion de un array, donde cada indice representa el filtro (Ej: periodo, departamento), donde cada indice esta asociado a un array con los valores posibles para el mismo
          var filtros = {periodo:[], departamento:[], distrito:[], barrioLocalidad:[], zona:[], proyecto111:[], proyecto822:[]};

          //Carga de los distintos valores para cada filtro
          var result = true;
          $.each(establecimientos.features, function(index, e){
            $.each(e.properties, function(attr, val){
              result = _.includes(filtros[attr], val); //Verifica si el campo ya fue cargado anteriormente. True -> Si, False -> No.
              if (result===false) filtros[attr].push(val);
            });
          });

          //Ordenacion de los valores de cada filtro
          $.each(filtros, function(index, value){
            if(index==='periodo'){
              value.reverse();
            }else{
              value.sort();
            }
          });

          //Append a las listas desplegables
          var firstTime;
          $.each(filtros, function(attr, array){ //ciclo por cada filtro existe
            firstTime=true;
            $.each(array, function(index, a){
              if(attr!=='periodo' && firstTime===true){ //ciclo que añade los valores posibles del filtro
                $('#'+_.camelCase('filtro '+attr)).append('<option value="">---</option>');
                firstTime=false;
              }
              $('#'+_.camelCase('filtro '+attr)).append('<option value="'+a+'">'+a+'</option>');
            });
          });

          $.each(filtros, function(attr, array){
            $('#'+_.camelCase('filtro '+attr)).select2( {dropdownAutoWidth:true} );
          });

        };//var cargar = function(establecimientos){        

        /*
        Funcion que se ejecuta por cada parametro nuevo de filtrado. En la misma se reconstruyen los filtros, y posteriormente,
        se actualiza la variable de scope "filtro" (sobre la cual, la directiva "mapa_establecimientos.js" esta realizando un watch
        que permite la aplicacion de los filtros sobre el mapa)
        */
        scope.updateFiltro = function(localFiltro){
          var filtroBase = [];
          var f = '';
          $.each(localFiltro, function(index, value){
            f = {
              atributo:index,
              valor:value,
              eval: function(e){
                return (this.valor==='' || this.valor===e)
              }
            };
            filtroBase.push(f);
          });
          scope.filtro = filtroBase;
        }//scope.updateFiltro = function(){

        /*
        INICIO
        */
        var establecimientos = scope.data;
        cargar(establecimientos);
        scope.local={periodo:'2014'};
        scope.updateFiltro(scope.local);

      }//link: function postLink(scope, element, attrs) {
    };
  });
