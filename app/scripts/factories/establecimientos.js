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
					localStorage[key] = JSON.stringify(topojson.feature(data.data, data.data.objects[objeto]));
					clusterIndexes[key] = self.getClusterIndex(key);
				});
			},

			getClusterIndex: function(key){
				if(clusterIndexes[key]){
					return _.mapValues(clusterIndexes[key], function(c){
						c.properties.cantidad = 0;
						return c;
					});
				}else{
					console.time('cluster parse');
					var cluster = JSON.parse(localStorage[key]);
					console.timeEnd('cluster parse');
					var clusterIndex = {};
					//build a cluster index
					if(cluster){
				        _.each(cluster.features, function(c){
			          		var key = getKeyFromFeature(c);
			          		clusterIndex[key] = c;
				        });
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
				}else{
					if(e.properties['nombre_distrito']){
						children = _.values(clusterIndexes['cluster_barrio_localidad']);
					}else{
						children = _.values(clusterIndexes['cluster_distrito']);
					}
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
					var objeto = _.keys(data.data.objects);
					establecimientos = topojson.feature(data.data, data.data.objects[objeto]);
					localStorage[paramToKey[parametro.tipo_consulta]] = JSON.stringify(establecimientos);
				});
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
					console.log('Instituciones');
					console.log(data.data[0]);
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

			}

	}; //return
});
