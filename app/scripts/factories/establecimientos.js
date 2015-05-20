'use strict';

/**
 * @ngdoc function
 * @name yvyUiApp.controller:MapaleafletCtrl
 * @description
 * # MapaleafletCtrl
 * Controller of the yvyUiApp
 */
angular.module('yvyUiApp')
  .factory('mapaEstablecimientoFactory', function($http) {
  	var paramToKey = {
  		'01': 'cluster_departamento',
  		'02': 'cluster_distrito',
  		'03': 'cluster_barrio_localidad',
  		'11': 'establecimientos'
  	}

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

    return {

			getDatosCluster: function(parametro){
				var self = this;
				var req = {
					method: 'GET',
					dataType: "json",
				    url: 'http://localhost:3000/app/mapa_establecimientos/datos',
				    params: parametro,
				    headers: {
				        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
				    }
				};


				return $http(req).then(function(data){
					//localStorage[paramToKey[parametro.tipo_consulta]] = JSON.stringify(data.data);
					var objeto = _.keys(data.data.objects);
					var key = paramToKey[parametro.tipo_consulta];
					console.log(data);
					localStorage[key] = JSON.stringify(topojson.feature(data.data, data.data.objects[objeto]));
					clusterIndexes[key] = self.getClusterIndex(key);
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
					console.time('cluster parse ' + key);
					var cluster = (key === 'establecimientos') ? establecimientos : JSON.parse(localStorage[key]);
					console.timeEnd('cluster parse ' + key);
					var clusterIndex;
					//build a cluster index
					if(cluster){
				  	clusterIndex = _.indexBy(cluster.features, function(c){ return getKeyFromFeature(c); });
					}else{
						console.log('Invalid cluster key');
					}
					return clusterIndex;
				}
				
			},

			getClusterElementChild: function(e){
				var key = getKeyFromFeature(e);
				var children;
				if(e.properties['nombre_barrio_localidad']){
					children = establecimientos.features;
				}else if(e.properties['nombre_distrito']){
					children = _.values(clusterIndexes['cluster_barrio_localidad']);
				}else if(e.properties['nombre_departamento']){
					children = _.values(clusterIndexes['cluster_distrito']);
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

				var req = {
					method: 'GET',
					dataType: "json",
				    url: 'http://localhost:3000/app/mapa_establecimientos/datos',
				    params: parametro,
				    headers: {
				        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
				    }
				};

				return $http(req).then(function(data){
					//localStorage[paramToKey[parametro.tipo_consulta]] = JSON.stringify(data.data);
					var result = JSON.stringify(data);
					localStorage[paramToKey[parametro.tipo_consulta]] = result;
				});
			},

			getEstablecimientos: function(){
				var data = JSON.parse(localStorage['establecimientos']);
				var objeto = _.keys(data.data.objects);
				establecimientos = topojson.feature(data.data, data.data.objects[objeto]);
				
				return establecimientos;
			},

			getDatosInstituciones: function(parametro){

				var req = {
					method: 'GET',
					dataType: "json",
				    url: 'http://localhost:3000/app/mapa_establecimientos/datos',
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
				    url: 'http://localhost:3000/app/mapa_establecimientos/datos',
				    params: parametro,
				    headers: {
				        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
				    }
				};

				$.post( "http://localhost:3000/app/mapa_establecimientos/datos", parametro, function(returnServerData){
					console.log("Instituciones");
					console.log(returnServerData);
				});
				*/

			},

			getInstitucionesPorEstablecimiento: function(establecimiento){
				var req = {
					method: 'GET',
					dataType: "json",
				    url: 'http://localhost:3000/app/mapa_establecimientos/datos',
				    params: {tipo_consulta: '13', establecimiento: establecimiento.codigo_establecimiento},
				    headers: {
				        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
				    }
				};

				return $http(req);

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
