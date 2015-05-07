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
  		'11': 'establecimientos',
  		'12': 'instituciones'
  	}

    return {

			getDatosCluster: function(parametro){

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
					localStorage[paramToKey[parametro.tipo_consulta]] = JSON.stringify(topojson.feature(data.data, data.data.objects[objeto]));
				});
			},

			getClusterIndex: function(key){
				var cluster = JSON.parse(localStorage[key]);
				var clusterIndex = {};
				//build a cluster index
				if(cluster){
			        _.each(cluster.features, function(c){
		          		var key = _.deburr(c.properties['nombre_departamento']);
		          		if(c.properties['nombre_distrito']) key += _.deburr(c.properties['nombre_distrito']);
		          		if(c.properties['nombre_barrio_localidad']) key += _.deburr(c.properties['nombre_barrio_localidad']);
		          		if(c.properties['codigo_establecimiento']) key += _.deburr(c.properties['codigo_establecimiento']);
		          		c.properties.features = [];
		          		//c.properties.cantidadEstablecimientos = 0;
		          		clusterIndex[key] = c;
			        });
				}else{
					console.log('Invalid cluster key');
				}
				return clusterIndex;
				
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
					localStorage[paramToKey[parametro.tipo_consulta]] = JSON.stringify(topojson.feature(data.data, data.data.objects[objeto]));
				});
			},

			getDatosInstituciones: function(parametro){

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

			}

	}; //return
});


/*

var e =  
    		{ 'type' : 'FeatureCollection',
      		'features' : 
      		[
		        {   
		            'type' : 'Feature',
		            'geometry' : {
		                'type' : 'Point',
		                'coordinates' : [-54.6629194845, -25.5481588338]},
		                'properties' : {
		                    'periodo':'2012',
		                    'codigoEstablecimiento':'1000',
							'departamento':'Central',
							'distrito':'Asunción',
							'barrioLocalidad':'Luque',
							'zona':'RURAL',
							'proyecto111':'SI',
							'proyecto822':'NO'
		                }
		        },
		        {   
		            'type' : 'Feature',
		            'geometry' : {
		                'type' : 'Point',
		                'coordinates' : [-55.7569477676, -22.5666461779]},
		                'properties' : {
		                    'periodo':'2014',
		                    'codigoEstablecimiento':'1500',
							'departamento':'Alto Paraná',
							'distrito':'Asunción',
							'barrioLocalidad':'Luque',
							'zona':'RURAL',
							'proyecto111':'NO',
							'proyecto822':'SI'
		                }
		        },
		        {   
		            'type' : 'Feature',
		            'geometry' : {
		                'type' : 'Point',
		                'coordinates' : [-55.9407102709, -27.2784503196]},
		                'properties' : {
		                    'periodo':'2014',
		                    'codigoEstablecimiento':'2000',
							'departamento':'Alto Paraguay',
							'distrito':'Caacupe',
							'barrioLocalidad':'Fernando Norte',
							'zona':'RURAL',
							'proyecto111':'SI',
							'proyecto822':'NO'
		                }
		        },
		        {   
		            'type' : 'Feature',
		            'geometry' : {
		                'type' : 'Point',
		                'coordinates' : [-57.6661353155, -25.3006268447]},
		                'properties' : {
		                    'periodo':'2014',
		                    'codigoEstablecimiento':'2500',
							'departamento':'Central',
							'distrito':'Caacupe',
							'barrioLocalidad':'Fernando Sur',
							'zona':'RURAL',
							'proyecto111':'NO',
							'proyecto822':'SI'
		                }
		        },
		        {   
		            'type' : 'Feature',
		            'geometry' : {
		                'type' : 'Point',
		                'coordinates' : [-57.5635172159, -25.0758229164]},
		                'properties' : {
		                    'periodo':'2014',
		                    'codigoEstablecimiento':'3000',
							'departamento':'Cordillera',
							'distrito':'Caacupe',
							'barrioLocalidad':'Fernando Norte',
							'zona':'URBANA',
							'proyecto111':'NO',
							'proyecto822':'NO'
		                }
		        },
		        {   
		            'type' : 'Feature',
		            'geometry' : {
		                'type' : 'Point',
		                'coordinates' : [-56.4289453898, -25.8100449916]},
		                'properties' : {
		                    'periodo':'2014',
		                    'codigoEstablecimiento':'3500',
							'departamento':'Cordillera',
							'distrito':'Caacupe',
							'barrioLocalidad':'Fernando Sur',
							'zona':'URBANA',
							'proyecto111':'NO',
							'proyecto822':'SI'
		                }
		        },
		        {   
		            'type' : 'Feature',
		            'geometry' : {
		                'type' : 'Point',
		                'coordinates' : [-57.291622461, -25.5552115638]},
		                'properties' : {
		                    'periodo':'2012',
		                    'codigoEstablecimiento':'4000',
							'departamento':'San Pedro',
							'distrito':'Asunción',
							'barrioLocalidad':'Luque',
							'zona':'URBANA',
							'proyecto111':'SI',
							'proyecto822':'NO'
		                }
		        },
		        {   
		            'type' : 'Feature',
		            'geometry' : {
		                'type' : 'Point',
		                'coordinates' : [-56.5537190775, -22.3345344]},
		                'properties' : {
		                    'periodo':'2012',
		                    'codigoEstablecimiento':'4500',
							'departamento':'San Pedro',
							'distrito':'Asunción',
							'barrioLocalidad':'Luque',
							'zona':'RURAL',
							'proyecto111':'SI',
							'proyecto822':'SI'
		                }
		        },
		        {   
		            'type' : 'Feature',
		            'geometry' : {
		                'type' : 'Point',
		                'coordinates' : [-55.9806638874, -22.577912964]},
		                'properties' : {
		                    'periodo':'2012',
		                    'codigoEstablecimiento':'5000',
							'departamento':'San Pedro',
							'distrito':'Caacupe',
							'barrioLocalidad':'Fernando Norte',
							'zona':'URBANA',
							'proyecto111':'NO',
							'proyecto822':'NO'
		                }
		        },
		        {   
		            'type' : 'Feature',
		            'geometry' : {
		                'type' : 'Point',
		                'coordinates' : [-56.1418883578, -22.5919981876]},
		                'properties' : {
		                    'periodo':'2012',
		                    'codigoEstablecimiento':'5500',
							'departamento':'San Pedro',
							'distrito':'Caacupe',
							'barrioLocalidad':'Fernando Sur',
							'zona':'URBANA',
							'proyecto111':'NO',
							'proyecto822':'SI'
		                }
		        }
        	]
			};
			return e;

*/

/* *************************************************************************************************** */

/* 

var tipo = {
	tipo:'1' //establecimientos
};

$.ajax({
	url : 'http://localhost:3000/app/mapa_establecimientos/datos',
	type: "POST",
	data : tipo,
	dataType: 'json',
	//async:false,
	//headers: {'X-Requested-With': 'XMLHttpRequest'},
	success:function(data, textStatus, jqXHR) {
		console.log('success');
		//$scope.data = JSON.parse(data[0].e_geojson);
		$scope.$apply(function() {
		    $scope.data='FUNCIONA';
		});
	},
	error: function(jqXHR, textStatus, errorThrown) {
		console.log(textStatus);
	}
});

*/