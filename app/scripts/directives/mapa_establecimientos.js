'use strict';
/**
 * @ngdoc directive
 * @name yvyUiApp.directive:mapaLeaflet
 * @description
 * # mapaLeaflet
 */
angular.module('yvyUiApp')
  .directive('mapaEstablecimientos', function (mapaEstablecimientoFactory) {
    return {
      restrict: 'E',
      replace: false,
      scope: {
        data:'=',
        filtro:'=',
        detalle:'=',
        ready: '='
      },
      templateUrl: 'views/templates/template_mapa.html',
      link: function postLink(scope, element, attrs) {

        var invalidateSize = function(animate){ map.invalidateSize(animate); };
        var target, result, rightPanelOpen, currentZoom;

        $('#map').data('right-sidebar-visible', false);

        $('#left-panel').panelslider({
                                  side: 'left',
                                  duration: 300,
                                  clickClose: false,
                                  container: $('[ng-view]'),
                                  onOpen: function(){
                                    //invalidateSize(true);
                                  },
                                  onClose: function(){
                                    var width = rightPanelOpen ? 'calc(100% - 350px)' : '100%'
                			              $('#filtroDepartamento').select2('close');
                          			    $('#filtroDistrito').select2('close');
                          			    $('#filtroBarrioLocalidad').select2('close');
                				            $('#filtroCodigoEstablecimiento').select2('close');
                                    $('#map').css('width', width);
                                    invalidateSize(true);
                                  },
                                  onStartClose: function(){
                                    $('#map').css('width', 'calc(100% + 240px)');
                                    invalidateSize(false);
                                  }
                                });        
        
        /* El watch nos permitira filtrar los establecimientos (y por consiguiente, los respectivos Markers) */
        scope.$watch('filtro', function(filtro){
          
          if(filtro){
            var establecimientos_visibles = establecimientos;
            $.each(filtro, function(index, value){
              establecimientos_visibles = filtrar_establecimientos(establecimientos_visibles, value);
            });
            MECONF.establecimientosVisibles = establecimientos_visibles;
            result = draw_map(filtro);
            map = result.map; //dibujamos el mapa con los establecimientos filtrados
            if(MECONF.geoJsonLayer.getLayers().length){
              map.off('zoomend', updateMap);
              map.off('move', updateMap);
              map.on('moveend', addUpdateHandlers);
              map.fitBounds(MECONF.geoJsonLayer.getBounds(), {maxZoom: result.maxZoom, paddingTopLeft: [0, 50]});
            }else{
              map.setView([-23.388, -57.189], 6, {animate: true});
            }
          }

        });

        var addUpdateHandlers = function(){
          //map.on('zoomend', updateMap);
          map.on('move', updateMap);
          map.off('moveend', addUpdateHandlers);
        }

        scope.$on('detail-open', function(){
          rightPanelOpen = true;
          $('#map').css('width', 'calc(100% - 350px)');
          invalidateSize(true);
          //map.setZoom(16);
          //map.panTo(target.layer.getLatLng());
        });

        scope.$on('detail-start-open', function(){
          map.off('zoomend', updateMap);
          map.off('move', updateMap);
          map.on('moveend', addUpdateHandlers);
          map.setZoom(16, {animate: true});
          map.panTo(target.layer.getLatLng());
        });

        scope.$on('detail-close', function(){
          rightPanelOpen = false;
          invalidateSize(true);
          MECONF.infoBox.update(MECONF.establecimientosVisibles.features);
          //map.setView([-23.388, -57.189], 6, {animate: true});
        });

        scope.$on('detail-start-close', function(){
/*          map.off('zoomend', updateMap);
          map.off('move', updateMap);
          map.on('moveend', addUpdateHandlers);
*/        $('#map').css('width', '100%');
          //invalidateSize(true);
        });

        /* Funcion que reduce la lista de establecimientos acorde al filtro seleccionado */
        var filtrar_establecimientos = function(establecimientos, filtro){
          var e =  
          { 'type' : 'FeatureCollection',
            'features' : []
          };
          $.each(establecimientos.features, function(index, value){
            if (filtro.eval(value.properties[filtro.atributo])){
              e.features.push(value);
            }
          });
          return e;
        };

        /* Funcion que inicializa el mapa */
        var init_map = function() {
          console.time('dibujo');
          console.time('init_map');
          startLoading();

          L.mapbox.accessToken = 'pk.eyJ1IjoicnBhcnJhIiwiYSI6IkEzVklSMm8ifQ.a9trB68u6h4kWVDDfVsJSg';
          var layers = MECONF.LAYERS();
          var mapbox = layers.MAPBOX.on('load', tilesLoaded);
          var osm = layers.OPEN_STREET_MAPS.on('load', tilesLoaded);

          var gglHybrid = layers.GOOGLE_HYBRID.on('MapObjectInitialized', setup_gmaps);
          var gglRoadmap = layers.GOOGLE_ROADMAP.on('MapObjectInitialized', setup_gmaps);


          var map = L.map('map', {maxZoom: 18, minZoom: 3, worldCopyJump: true, attributionControl: false})
                  .setView([-23.388, -57.189], 6)
                  .on('baselayerchange', startLoading);

          var baseMaps = {
              'Calles OpenStreetMap': osm,
              'Terreno': mapbox,
              'Satélite': gglHybrid,
              'Calles Google Maps': gglRoadmap
          };

          map.addLayer(gglRoadmap);

          

          L.control.layers(baseMaps).addTo(map);
          console.timeEnd('init_map');

          return map;
        };

        var draw_markers = function(){
          var geoJson = L.mapbox.featureLayer();

          geoJson.on('layeradd', function (e) {
              var icon, color, marker = e.layer,
                      feature = marker.feature;

              var img = MECONF.ESTADO_TO_ICON[feature.properties['periodo']];
              if (img) {
                color = 'orange';
                icon = L.AwesomeMarkers.icon({
                  icon: 'home',
                  markerColor: color,
                  prefix: 'glyphicon'
                });
              }else{
                color = 'blue';
                icon = L.AwesomeMarkers.icon({
                  icon: '',
                  markerColor: color,
                  prefix: 'fa',
                  html: feature.properties.cantidad
                });

              }
              marker.setIcon(icon);
          });

          MECONF.geoJsonLayer = geoJson; //Sobre esta variable se aplican los filtros
          MECONF.geoJsonLayer.on('click', draw_popup);
          MECONF.geoJsonLayer.addTo(map);


          MECONF.infoBox = draw_info_box();
          MECONF.infoBox.addTo(map);

          //map.on('zoomend', updateMap);
          map.on('move', updateMap);

        }

        var updateMap = _.throttle(function(){ draw_map(); }, 100);

        /* Funcion que dibuja el mapa de acuerdo a los establecimientos filtrados y al zoom actual */
        var draw_map = function(filtros){
          console.time('draw_map');
          var maxZoom, e, filterByDepartamento, filterByDistrito, filterByLocalidad, levelZoom = map.getZoom();
          var redrawClusters = filtros || levelZoom !== currentZoom;
          if(filtros){
            filterByLocalidad = _.filter(filtros, function(f){ return f.atributo === 'nombre_barrio_localidad' && f.valor.length; }).length > 0;
            filterByDistrito = _.filter(filtros, function(f){ return f.atributo === 'nombre_distrito' && f.valor.length; }).length > 0 && !filterByLocalidad; 
            filterByDepartamento = _.filter(filtros, function(f){ return f.atributo === 'nombre_departamento' && f.valor.length; }).length > 0 && !filterByDistrito;
            
            if(filterByDepartamento) maxZoom = MECONF.nivelesZoom['departamento'] - 1; 
            if(filterByDistrito) maxZoom = MECONF.nivelesZoom['distrito'] - 1; 
            if(filterByLocalidad) maxZoom = MECONF.nivelesZoom['barrio_localidad'] - 1; 
            if(!filterByDepartamento && !filterByDistrito && !filterByLocalidad){
              maxZoom = MECONF.nivelesZoom['departamento'] - 1;
            }
            levelZoom = maxZoom;
          }

          console.log('levelZoom: ' + levelZoom);
          console.time('filtrado');
          if(redrawClusters){
            if (levelZoom < MECONF.nivelesZoom['departamento']) { //cluster por departamento (por defecto)
              e = filtrar_cluster('departamento');
              console.log('cluster by departamento');
            } else if ((levelZoom >= MECONF.nivelesZoom['departamento'] && levelZoom < MECONF.nivelesZoom['distrito'])) { //cluster por distrito
              e = filtrar_cluster('distrito');
              console.log('cluster by distrito');

            } else if ((levelZoom >= MECONF.nivelesZoom['distrito'] && levelZoom < MECONF.nivelesZoom['barrio_localidad'])) { //cluster por barrio/localidad
              console.log('cluster by localidad');
              e = filtrar_cluster('barrio_localidad');
            }else{
              console.log('no cluster');
              e = _.clone(MECONF.establecimientosVisibles);
            }
            e.allFeatures = e.features;
          }else{
            e = MECONF.geoJsonLayer.getGeoJSON();
          }
          
          console.timeEnd('filtrado');

          if( levelZoom < MECONF.nivelesZoom['barrio_localidad'] && filtros ){
            var codigos_establecimientos = _.pluck(MECONF.establecimientosVisibles.features, 'properties');
            codigos_establecimientos =  _.pluck(codigos_establecimientos, 'codigo_establecimiento');
            //scope.$parent.getInstituciones(codigos_establecimientos); //El controller se encarga de cargar la Lista de Detalles
          }
          
          //console.log('A MOSTRAR:');
          //console.log(e);
          //BORRAR BORRAR BORRAR BORRAR BORRAR
          //e = MECONF.establecimientosVisibles;//DESPUES TENGO QUE BORRAR
          //BORRAR BORRAR BORRAR BORRAR BORRAR
          var bounds = map.getBounds();
          if(!filtros){
            e.features = _.filter(e.allFeatures, function(punto){
              var latLon = [punto.geometry.coordinates[1], punto.geometry.coordinates[0]];
              return bounds.contains(latLon);
            });
          }

          //console.log(e);
          MECONF.infoBox.update(MECONF.establecimientosVisibles.features);
          console.time('geojson');
          MECONF.geoJsonLayer.setGeoJSON(e);
          console.timeEnd('geojson');

          console.timeEnd('draw_map');
          currentZoom = levelZoom;
          return {map: map, maxZoom: maxZoom };
        };

        /* Funcion que filtra el cluster a mostrar, ya sea por Departamentos/Distritos/BarrioLocalidad */
        var filtrar_cluster = function(tipo){
          var tipo_cluster = 'cluster_'+tipo;
          //Reemplazar por llamada al service
          console.time('cluster index');
          //build a cluster index
          var clusterIndex = mapaEstablecimientoFactory.getClusterIndex(tipo_cluster);
          console.log(clusterIndex);
          console.timeEnd('cluster index');

          var e =  
          { 'type' : 'FeatureCollection',
            'features' : []
          };

          var keyAccesor;
          switch(tipo){
            case 'departamento':
              keyAccesor = function(f){ return _.deburr(f.properties['nombre_departamento']); };
              break;
            case 'distrito':
              keyAccesor = function(f){ return _.deburr(f.properties['nombre_departamento']) + _.deburr(f.properties['nombre_distrito']); };
              break;
            case 'barrio_localidad':
              keyAccesor = function(f){ return _.deburr(f.properties['nombre_departamento']) + _.deburr(f.properties['nombre_distrito']) + _.deburr(f.properties['nombre_barrio_localidad']); };
              break;
          }

          console.time('cluster features');
          _.each(MECONF.establecimientosVisibles.features, function(f){
            var key = keyAccesor(f);
            if(clusterIndex[key]){
              clusterIndex[key].properties.cantidad++;
              clusterIndex[key].properties.targetChild = f;
            } 
          });
          console.timeEnd('cluster features');

          console.time('cluster filter');
          e.features = _(clusterIndex).values().filter(function(f){ return f.properties.cantidad; }).value();
          console.timeEnd('cluster filter');
          console.log(e);
          return e;

        };
        
        /* Funcion que calcula la distancia entre dos puntos */
        function two_points_distances() {
          
        }

        /* Funcion que carga el resumen del Popup */
        function draw_popup(t){
          target = t;
          console.log(target);
          //map.panTo(target.layer.getLatLng()); //funcion que centra el mapa sobre el marker

          scope.$apply(function(){
            var levelZoom = map.getZoom();
            var latLon, targetChild;
            if(levelZoom >= MECONF.nivelesZoom['barrio_localidad']){ //Verificamos el zoom para mostrar el popup
              scope.detalle = target.layer.feature.properties;
              MECONF.infoBox.update(target.layer.feature);
            }else{
              targetChild = target.layer.feature.properties.targetChild; //Se toma el primero, se podria tomar random tambien
              latLon = [targetChild.geometry.coordinates[1], targetChild.geometry.coordinates[0]];
              map.setView(latLon, levelZoom + 3); //funcion que centra el mapa sobre el marker
            }
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
                  //Cuando se hace hover sobre un Marker de Cluster
                  msg = get_summary_message(MECONF.establecimientosVisibles.features);
              } else if (f) {
                  //Cuando es hace el popup de un Marker
                  msg = sprintf('Mostrando un establecimiento del departamento %s',
                          f.properties['nombre_departamento']);
              }

              this._div.innerHTML = msg;
          };

          return info;
        }

        function get_summary_message(features) {
          var cantidadDepartamentos = _(features).chain()
              .map(function (f) {
                  return f.properties['nombre_departamento'];
              })
              .filter(function(e){ return e !== 'ASUNCION';})
              .unique().value().length;

          if (cantidadDepartamentos === 0) {
              cantidadDepartamentos += 1;
          }

          var cantidadEstablecimientos = _(features).chain()
            .map(function (f){
              return f.properties['codigo_establecimiento'];
            })
            .unique().value().length;

          var establecimientosLabel = cantidadEstablecimientos > 1 ? 'establecimientos' : 'establecimiento';
          var departamentoLabel = cantidadDepartamentos > 1 ? 'departamentos' : 'departamento';
          return sprintf('%s %s de %s %s',
                  cantidadEstablecimientos, establecimientosLabel, cantidadDepartamentos, departamentoLabel);
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
          $("#map").removeClass().append(spinner.el);
        };


        //Funcion que finaliza el Spinner (Loading)
        var finishedLoading = function() {

          if(tilesLoaded && establecimientos){
            $(".spinner").remove();
            MECONF.tilesLoaded = false;
            console.timeEnd('dibujo');
          }

        };

        var tilesLoaded = function(){
          MECONF.tilesLoaded = true;
          finishedLoading();
        }
       
        //Configuracion del Gmaps listener
        var setup_gmaps = function() {
          google.maps.event.addListenerOnce(this._google, 'tilesloaded', tilesLoaded);
        };

        //Funcion que cierra todos los Selects del filtro
        function onClose(){
          $('#filtro_codigo_establecimiento').select2('close');
          $('#filtro_nombre_departamento').select2('close');
          $('#filtro_nombre_distrito').select2('close');
          $('#filtro_nombre_barrio_localidad').select2('close');
        }

        /******************************** INICIO **************************************/        
        
        //Detalles de la configuracion del mapa
        var MECONF = MECONF || {};
        MECONF.tilesLoaded = false;

        MECONF.LAYERS = function () {
            var mapbox = L.tileLayer(
                    'http://api.tiles.mapbox.com/v4/rparra.jmk7g7ep/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoicnBhcnJhIiwiYSI6IkEzVklSMm8ifQ.a9trB68u6h4kWVDDfVsJSg');
            var osm = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {minZoom: 3});
            var gglHybrid = new L.Google('HYBRID');
            var gglRoadmap = new L.Google('ROADMAP');
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

        MECONF.nivelesZoom = {departamento:10, distrito:13, barrio_localidad:16}; //niveles de zoom para departamento/distrito/barrioLocalidad

        var establecimientos;
        var map = init_map();

        var unwatch = scope.$watch('ready', function(ready) {
          //console.log(ready);
          //console.timeEnd('scope notified');
          if(ready){
            unwatch(); //Remove the watch
            console.time('draw Markers');
            draw_markers();
            console.timeEnd('draw Markers');
            establecimientos = JSON.parse(localStorage['establecimientos']);
            console.timeEnd('servicio');
            finishedLoading();

            $('#left-panel').panelslider({side: 'left', duration: 300, clickClose: false, container: $('[ng-view]'), onClose: onClose });

          }
        });

      }//link: function postLink(scope, element, attrs) {
    };
  });
