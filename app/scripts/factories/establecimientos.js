'use strict';

/**
 * @ngdoc function
 * @name yvyUiApp.controller:MapaleafletCtrl
 * @description
 * # MapaleafletCtrl
 * Controller of the yvyUiApp
 */
angular.module('yvyUiApp')
  .factory('mapaEstablecimientoFactory', function($http, $q) {
  	var urlBase = 'http://localhost:3000';
  	//var urlBase = 'http://datos.mec.gov.py';

  	var paramToKey = {
  		'01': 'cluster_departamento',
  		'02': 'cluster_distrito',
  		'03': 'cluster_barrio_localidad',
  		'11': 'establecimientos'
  	};

  	var clusterIndexes = {};
  	var establecimientos = [];
  	var instituciones = [];

  	var getKeyFromFeature = function(c){
  		var key = _.deburr(c.properties['nombre_departamento']);
  		if(c.properties['nombre_distrito']) key += _.deburr(c.properties['nombre_distrito']);
  		if(c.properties['nombre_barrio_localidad']) key += _.deburr(c.properties['nombre_barrio_localidad']);
  		if(c.properties['codigo_establecimiento']) key += _.deburr(c.properties['codigo_establecimiento']);
  		return key;
  	};

  	var keyStorage = function(key, jsonData, expirationMin){ //El parámetro de expiración esta en Minutos
	    var expirationMS = expirationMin * 60 * 1000;
	    var record = {value: jsonData, timestamp: new Date().getTime() + expirationMS};
	    try{
	      return localforage.setItem(key, record);
	    }catch(e){
	      alert("Por favor actualice su navegador");
	    }
	    return ;
	};

    return {

			getDatosCluster: function(parametro){
				
				var defered = $q.defer();
				var promise = defered.promise;

				var self = this;
				var req = {
					method: 'GET',
					dataType: "json",
				    url: urlBase + '/app/mapa_establecimientos/datos',
				    params: parametro,
				    headers: {
				        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
				    }
				};

				var key = paramToKey[parametro.tipo_consulta];

				return localforage.getItem(key).then(function(data){
					if( data && (new Date().getTime() < data.timestamp) ){
						clusterIndexes[key] = _.indexBy(data.value.features, function(c){ return getKeyFromFeature(c); });
						return promise;
					}else{
						return $http(req)
								.success(function(data){
									var objeto = _.keys(data.objects);
									var cluster = topojson.feature(data, data.objects[objeto]);
									clusterIndexes[key] = _.indexBy(cluster.features, function(c){ return getKeyFromFeature(c); });
									keyStorage(key, cluster, 14);
								});

					}
				});

			},

			getClusterIndex: function(key){

				if(clusterIndexes[key]){
					return  (key === 'instituciones') 
						? clusterIndexes[key] 
						: _.mapValues(clusterIndexes[key], function(c){
						 	c.properties.cantidad = 0;
							return c;
						});
				}else{
					console.log('Invalid cluster key');
				}
				
			},

			getCantidadEstablecimientos: function(tipo, establecimientosVisibles){

	          var clusterPais;
	          if(tipo === 'pais'){
	            clusterPais = this.getCentroPais();
	            clusterPais.features[0].properties.cantidad = establecimientosVisibles.features.length;
	            return clusterPais;
	          }

	          var tipo_cluster = 'cluster_'+tipo;
	          //Reemplazar por llamada al service
	          //build a cluster index
	          var clusterIndex = this.getClusterIndex(tipo_cluster);
	          var coordinatesIndex = {};

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

	          _.each(establecimientosVisibles.features, function(f){
	            var key = keyAccesor(f);
	            if(clusterIndex[key]){
	              clusterIndex[key].properties.cantidad++;
	              coordinatesIndex[key] = f.geometry.coordinates;
	              //clusterIndex[key].properties.targetChild = f;
	            }
	          });

	          /* Si el cluster es de un elemento, se desplaza su centro:
	             Del centroide del poligono al punto del unico establecimiento del cluster
	          */
	          _.forOwn(clusterIndex, function(c, k){
	            if(c.properties.cantidad === 1){
	              c.geometry.coordinates = coordinatesIndex[k];
	            }
	          });

	          e.features = _(clusterIndex).values().filter(function(f){ return f.properties.cantidad }).value();
	          return e;

			},

			getClusterElementChild: function(e, establecimientosVisibles){

				var children;
				var cluster;
				if(e.properties['nombre_barrio_localidad'] || e.properties.cantidad === 1){
					children = establecimientosVisibles.features;
				}else if(e.properties['nombre_distrito']){
					cluster = this.getCantidadEstablecimientos('barrio_localidad', establecimientosVisibles);
					children = _.values(cluster.features);
				}else if(e.properties['nombre_departamento']){
					cluster = this.getCantidadEstablecimientos('distrito', establecimientosVisibles);
					children = _.values(cluster.features);
				}else{
					return this.getCentroPais().features[0];
				}
				
				return _.find(children, function(c){
					var result = c.properties['nombre_departamento'] === e.properties['nombre_departamento'];
					if(e.properties['nombre_distrito']) result = result && c.properties['nombre_distrito'] === e.properties['nombre_distrito'];
					if(e.properties['nombre_barrio_localidad']) result = result && c.properties['nombre_barrio_localidad'] === e.properties['nombre_barrio_localidad'];
					return result;
				});
			},

			getDatosEstablecimientos: function(parametro){

				var defered = $q.defer();
				var promise = defered.promise;
				var req = {
					method: 'GET',
					dataType: "json",
				    url: urlBase + '/app/mapa_establecimientos/datos',
				    params: { 'tipo_consulta': '11', 'periodo': parametro.periodo },
				    headers: {
				        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
				    }
				};
				var nombre_establecimiento = paramToKey['11'] + parametro.periodo;
				if(establecimientos[parametro.periodo]){
					defered.resolve(establecimientos[parametro.periodo]);
					return promise;
				}else{
					return localforage.getItem(nombre_establecimiento).then(function(data){
						if( data && (new Date().getTime() < data.timestamp) ){
							establecimientos[parametro.periodo] = data.value;
							defered.resolve(data);
							return promise;
						}else{
							return $http(req)
								.success(function(data){
									var objeto = _.keys(data.objects);
									establecimientos[parametro.periodo] = topojson.feature(data, data.objects[objeto]);
									keyStorage(nombre_establecimiento, establecimientos[parametro.periodo], 14);
								})
								.error(function(err){
									//defered.reject(err);
								});
						}

					});	
				}

			},

			getDatosInstituciones: function(parametro){

				var req = {
					method: 'GET',
					dataType: "json",
				    url: urlBase + '/app/mapa_establecimientos/datos',
				    params: parametro,
				    headers: {
				        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
				    }
				};

				return $http(req).then(function(data){
					instituciones = data.data;
					clusterIndexes['instituciones'] = _.groupBy(instituciones, function(i){ return i['codigo_establecimiento']; });
				});

				/*
				var req = {
					method: 'POST',
					dataType: "json",
				    url: urlBase + '/app/mapa_establecimientos/datos',
				    params: parametro,
				    headers: {
				        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
				    }
				};

				$.post( urlBase + '/app/mapa_establecimientos/datos', parametro, function(returnServerData){
					console.log("Instituciones");
					console.log(returnServerData);
				});
				*/

			},

			getInstitucionesPorEstablecimiento: function(establecimiento){
				var req = {
					method: 'GET',
					dataType: "json",
				    url: urlBase + '/app/mapa_establecimientos/datos',
				    params: {tipo_consulta: '13', establecimiento: establecimiento.codigo_establecimiento},
				    headers: {
				        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
				    }
				};

				return $http(req).then(function(result){ return result.data; });

			},

			getCentroPais: function(){
				return {
					'type': 'FeatureCollection',
					'features': [
						{
						'geometry': {
						'coordinates': [-57.60479328668649, -25.291172101570684],
						'type': "Point"
						},
						'properties': {},
						'type': 'Feature'
						}
					]
		        }
			}
	}; //return
});
