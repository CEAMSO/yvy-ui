'use strict';
/**
 * @ngdoc directive
 * @name yvyUiApp.directive:mapaLeaflet
 * @description
 * # mapaLeaflet
 */
angular.module('yvyUiApp')
  .directive('mapaEstablecimientos', function () {
    return {
      restrict: 'E',
      replace: false,
      scope: {
        data:"=",
        filtro:"="
      },
      template: '<div id="loader"></div>'+
      '<div id="map"></div>'+
      '<div id="mapa-establecimientos"></div>',
      link: function postLink(scope, element, attrs) {
        
        /*
        El watch nos permitira filtrar los establecimientos (y por consiguiente, los respectivos Markers)
        */
        scope.$watch('filtro', function(filtro){
          var establecimientos_visibles = establecimientos;
          $.each(filtro, function(index, value){
              establecimientos_visibles = filtrar_estableciminentos(establecimientos_visibles, value);
          });

          map = draw_map(establecimientos_visibles); //dibujamos el mapa con los establecimientos filtrados           

          //Lista de establecimientos filtrados
          var definicion = 
          '<b>Directiva Mapa</b><br/>'+
          '<b>Tamaño:</b><br/>'+establecimientos_visibles.features.length;
          $.each(establecimientos_visibles.features, function(index,value){
            definicion+= '<li>'+ value.properties.periodo + ' - ' + value.properties.departamento + ' - ' + value.properties.distrito+ ' - ' + value.properties.barrioLocalidad + ' - ' + value.properties.zona + ' - ' + value.properties.codigoEstablecimiento + ' - ' + value.properties.proyecto111 +'</li>';
          });
          angular.element("#mapa-establecimientos").html(definicion);

        }, true); //scope.$watch('filtro', function(filtro){

        /*
        Funcion que reduce la lista de establecimientos acorde al filtro seleccionado
        */
        var filtrar_estableciminentos = function(establecimientos, filtro){
          var e =  
          { "type" : "FeatureCollection",
            "features" : []
          };
          $.each(establecimientos.features, function(index, value){
            if (filtro.eval(value.properties[filtro.atributo])){
              e.features.push(value);
            }
          });
          return e;
        }; //var filtrar_estableciminentos = function(establecimientos, filtro){

        //Funcion que inicializa el mapa  
        var init_map = function(establecimientos) {
          startLoading();

          L.mapbox.accessToken = 'pk.eyJ1IjoicnBhcnJhIiwiYSI6IkEzVklSMm8ifQ.a9trB68u6h4kWVDDfVsJSg';
          var layers = MECONF.LAYERS();
          var mapbox = layers.MAPBOX.on('load', finishedLoading);
          var osm = layers.OPEN_STREET_MAPS.on('load', finishedLoading);

          var gglHybrid = layers.GOOGLE_HYBRID.on("MapObjectInitialized", setup_gmaps);
          var gglRoadmap = layers.GOOGLE_ROADMAP.on("MapObjectInitialized", setup_gmaps);


          var map = L.map('map', {maxZoom: 18, minZoom: 3, worldCopyJump: true, attributionControl: false})
                  .setView([-23.388, -60.189], 7)
                  .on('baselayerchange', startLoading);

          var baseMaps = {
              "Calles OpenStreetMap": osm,
              "Terreno": mapbox,
              "Satélite": gglHybrid,
              "Calles Google Maps": gglRoadmap
          };

          map.addLayer(gglRoadmap);

          MECONF.geoJson = L.mapbox.featureLayer();

          MECONF.geoJson.on('layeradd', function (e) {
              var marker = e.layer,
                      feature = marker.feature;

              var img = MECONF.ESTADO_TO_ICON[feature.properties['periodo']];
              if (img) {
                  marker.setIcon(L.icon({
                      iconUrl: img,
                      iconSize: [32, 32]
                  }));
              }else{
                //nothing to do
              }
          });

          MECONF.infoBox = draw_info_box();
          MECONF.infoBox.addTo(map);
          L.control.layers(baseMaps).addTo(map);

          return map;
        };

        //Funcion que dibuja el mapa de acuerdo a los establecimientos filtrados
        var draw_map = function(establecimientos){
          MECONF.geoJson.setGeoJSON(establecimientos);
          MECONF.geoJson.addTo(map);
          MECONF.infoBox.update();
          
          return map;
        };
        
        //Funcion que calcula la distancia entre dos puntos
        function two_points_distances() {
          var info = L.control();
          info.onAdd = function (map) {
            this._div = L.DomUtil.create('div', 'distance-box'); // create a div with a class "info"
            this.update();
            return this._div;  
          }
          return info;
        }

        //Funcion que dibuja el resumen de los establecimientos
        function draw_info_box() {
          var info = L.control();

          info.onAdd = function (map) {
              this._div = L.DomUtil.create('div', 'info-box'); // create a div with a class "info"
              this.update();
              return this._div;
          };

          // method that we will use to update the control based on feature properties passed
          info.update = function (f) {
              var msg = this._div.innerHTML;
              if (f instanceof Array) {
                  msg = get_summary_message(f);
              } else if (f) {
                  msg = sprintf('Mostrando un asentamiento del proyecto %s con %s viviendas',
                          f.properties['Proyecto'], f.properties['Cantidad de Viviendas']);
              } else {
                  /*var features = _(MECONF.geoJsonLayer.getLayers()).map(function (l) {
                      return l.feature;
                  });
                  msg = get_summary_message(features);*/
                  msg = 'Esto es una prueba';
              }

              this._div.innerHTML = msg;
          };

          return info;
        }

        function get_summary_message(features) {
          var cantidadDepartamentos = _(features).chain()
              .map(function (f) {
                  return f.properties['departamento'];
              })
              .filter(function (e) {
                  return !(e === "Capital");
              })
              .unique().value().length;

          if (cantidadDepartamentos === 0) {
              cantidadDepartamentos += 1;
          }

          var cantidadProyectos = features.length;
          var cantidadViviendas = _(features).chain().filter(function (f) {
              return !isNaN(f.properties['Cantidad de Viviendas'])
          }).value()
                  .reduce(function (cont, f) {
                      return cont + parseInt(f.properties['Cantidad de Viviendas'])
                  }, 0);

          var departamentoLabel = cantidadDepartamentos > 1 ? 'departamentos' : 'departamento';
          var equivalenteLabel = cantidadProyectos > 1 ? 'equivalentes' : 'equivalente';
          var proyectoLabel = cantidadProyectos > 1 ? 'obras' : 'obra';
          var viviendaLabel = cantidadViviendas > 1 ? 'viviendas' : 'vivienda';
          return sprintf('%s %s de %s %s, %s a %s %s.',
                  cantidadProyectos, proyectoLabel, cantidadDepartamentos, departamentoLabel, equivalenteLabel, cantidadViviendas, viviendaLabel);
        }

        //Funcion que inicializa el Spinner (Loading)
        var startLoading = function() {
          var spinner = new Spinner({
              color: "#8c0505",
              radius: 30,
              width: 15,
              length: 20
          }).spin();
          $("#loader").removeClass().append(spinner.el);
        };


        //Funcion que finaliza el Spinner (Loading)
        var finishedLoading = function() {
          // first, toggle the class 'done', which makes the loading screen
          // fade out
          var loader = $("#loader");
          loader.addClass('done');
          setTimeout(function () {
              // then, after a half-second, add the class 'hide', which hides
              // it completely and ensures that the user can interact with the
              // map again.
              loader.addClass('hide');
              loader.empty();
          }, 200);
        };
       
        //Configuracion del Gmaps listener
        var setup_gmaps = function() {
          google.maps.event.addListenerOnce(this._google, 'tilesloaded', finishedLoading);
        };

        /*
        INICIO
        */
        var establecimientos = scope.data;
        
        //Detalles de la configuracion del mapa
        var MECONF = MECONF || {};

        MECONF.LAYERS = function () {
            var mapbox = L.tileLayer(
                    'http://api.tiles.mapbox.com/v4/rparra.jmk7g7ep/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoicnBhcnJhIiwiYSI6IkEzVklSMm8ifQ.a9trB68u6h4kWVDDfVsJSg');
            var osm = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {minZoom: 3});
            var gglHybrid = new L.Google("HYBRID");
            var gglRoadmap = new L.Google("ROADMAP");
            return {
                MAPBOX: mapbox,
                OPEN_STREET_MAPS: osm,
                GOOGLE_HYBRID: gglHybrid,
                GOOGLE_ROADMAP: gglRoadmap
            }
        };

        MECONF.ESTADO_TO_ICON = {
          '2014': 'images/yeoman.png',
          '2012': 'images/yeoman.png'
        };

        var map = init_map(establecimientos);

      }//link: function postLink(scope, element, attrs) {
    };
  });
