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
        filtro:"=",
        detalle:"="
      },
      template:
        '<div id="map-container"><div id="map">'+
              '<a class="btn btn-tag btn-tag-slide tag" id="left-panel" href="#left-panel-link">¿Desea Filtrar?</a>'+
        '</div>',
      link: function postLink(scope, element, attrs) {

        var invalidateSize = function(animate){ map.invalidateSize(animate); };
        var target;

        $('#map').data('right-sidebar-visible', false);

        $('#left-panel').panelslider({
                                  side: 'left',
                                  duration: 300,
                                  clickClose: false,
                                  container: $('[ng-view]'),
                                  onOpen: function(){
                                    invalidateSize(true);
                                  },
                                  onClose: function(){
                                    $('#map').css('width', '100%');
                                    invalidateSize(true);
                                  },
                                  onStartClose: function(){
                                    $('#map').css('width', 'calc(100% + 240px)');
                                    invalidateSize(false);
                                  }
                                });        
        
        /* El watch nos permitira filtrar los establecimientos (y por consiguiente, los respectivos Markers) */
        scope.$watch('filtro', function(filtro){
          var establecimientos_visibles = establecimientos;
          $.each(filtro, function(index, value){
            establecimientos_visibles = filtrar_estableciminentos(establecimientos_visibles, value);
          });

          map = draw_map(establecimientos_visibles); //dibujamos el mapa con los establecimientos filtrados           

        }, true);

        scope.$on('detail-open', function(){
          $('#map').css('width', 'calc(100% - 350px)');
          invalidateSize(true);
          map.setZoom(16);
          map.panTo(target.layer.getLatLng());
        });

        scope.$on('detail-close', function(){
          invalidateSize(true);
          map.setView([-23.388, -57.189], 6)
        });

        scope.$on('detail-start-close', function(){
          $('#map').css('width', '100%');
          invalidateSize(true);
        });

        /* Funcion que reduce la lista de establecimientos acorde al filtro seleccionado */
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
        };

        /* Funcion que inicializa el mapa */
        var init_map = function(establecimientos) {
          startLoading();

          L.mapbox.accessToken = 'pk.eyJ1IjoicnBhcnJhIiwiYSI6IkEzVklSMm8ifQ.a9trB68u6h4kWVDDfVsJSg';
          var layers = MECONF.LAYERS();
          var mapbox = layers.MAPBOX.on('load', finishedLoading);
          var osm = layers.OPEN_STREET_MAPS.on('load', finishedLoading);

          var gglHybrid = layers.GOOGLE_HYBRID.on("MapObjectInitialized", setup_gmaps);
          var gglRoadmap = layers.GOOGLE_ROADMAP.on("MapObjectInitialized", setup_gmaps);


          var map = L.map('map', {maxZoom: 18, minZoom: 3, worldCopyJump: true, attributionControl: false})
                  .setView([-23.388, -57.189], 6)
                  .on('baselayerchange', startLoading);

          var baseMaps = {
              "Calles OpenStreetMap": osm,
              "Terreno": mapbox,
              "Satélite": gglHybrid,
              "Calles Google Maps": gglRoadmap
          };

          map.addLayer(gglRoadmap);

          var geoJson = L.mapbox.featureLayer();

          geoJson.on('layeradd', function (e) {
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

          MECONF.geoJsonLayer = geoJson; //Sobre esta variable se aplican los filtros

          MECONF.infoBox = draw_info_box();
          MECONF.infoBox.addTo(map);
          L.control.layers(baseMaps).addTo(map);

          return map;
        };

        /* Funcion que dibuja el mapa de acuerdo a los establecimientos filtrados */
        var draw_map = function(establecimientos){
          MECONF.geoJsonLayer.setGeoJSON(establecimientos);
          MECONF.geoJsonLayer.addTo(map);
          MECONF.infoBox.update();

          MECONF.geoJsonLayer.on('click', draw_popup);
          
          return map;
        };
        
        /* Funcion que calcula la distancia entre dos puntos */
        function two_points_distances() {
          
        }

        /* Funcion que carga el resumen del Popup */
        function draw_popup(t){
          target = t;
          //map.panTo(target.layer.getLatLng()); //funcion que centra el mapa sobre el marker

          scope.$apply(function(){
            scope.detalle = target.layer.feature.properties;
          });

        }

        /* Funcion que dibuja el resumen de los establecimientos */
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
                  var features = _(MECONF.geoJsonLayer.getLayers()).map(function (l) {
                      return l.feature;
                  });
                  msg = get_summary_message(features);
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
              .unique().value().length;

          if (cantidadDepartamentos === 0) {
              cantidadDepartamentos += 1;
          }

          var cantidadEstablecimientos = _(features).chain()
            .map(function (f){
              return f.properties['codigo_establecimiento'];
            })
            .unique().value().length;
          
          return sprintf('6 establecimientos en %s departamentos', cantidadEstablecimientos, cantidadDepartamentos);

          /*var cantidadProyectos = features.length;
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
                  cantidadProyectos, proyectoLabel, cantidadDepartamentos, departamentoLabel, equivalenteLabel, cantidadViviendas, viviendaLabel);*/
        }

        //Funcion que inicializa el Spinner (Loading)
        var startLoading = function() {
          var spinner = new Spinner({
              color: "#ffb885",
              radius: 10,
              width: 5,
              length: 10,
              top: '92%',
              left: '98%'
          }).spin();
          $("#map").append(spinner.el);
        };


        //Funcion que finaliza el Spinner (Loading)
        var finishedLoading = function() {
          $(".spinner").remove();
        };
       
        //Configuracion del Gmaps listener
        var setup_gmaps = function() {
          google.maps.event.addListenerOnce(this._google, 'tilesloaded', finishedLoading);
        };

        /******************************** INICIO **************************************/        
        
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
          '2014': 'images/marker.png',
          '2012': 'images/marker.png'
        };

        var establecimientos = scope.data;
        var map = init_map(establecimientos);

      }//link: function postLink(scope, element, attrs) {
    };
  });
