'use strict';

/**
 * @ngdoc function
 * @name yvyUiApp.controller:MapaleafletCtrl
 * @description
 * # MapaleafletCtrl
 * Controller of the yvyUiApp
 */
angular.module('yvyUiApp')
  .factory('establecimientosFactory', function() {
    return {
    	getEstablecimientos: function(){
    		var e =  
    		{ "type" : "FeatureCollection",
      		"features" : 
      		[
		        {   
		            "type" : "Feature",
		            "geometry" : {
		                "type" : "Point",
		                "coordinates" : [-54.6629194845, -25.5481588338]},
		                "properties" : {
		                    "periodo":"2012",
							"departamento":"Central",
							"distrito":"Asunción",
							"barrioLocalidad":"Luque",
							"zona":"RURAL",
							"codigoEstablecimiento":"120",
							"proyecto111":"SI"
		                }
		        },
		        {   
		            "type" : "Feature",
		            "geometry" : {
		                "type" : "Point",
		                "coordinates" : [-55.7569477676, -22.5666461779]},
		                "properties" : {
		                    "periodo":"2014",
							"departamento":"Alto Paraná",
							"distrito":"Asunción",
							"barrioLocalidad":"Luque",
							"zona":"RURAL",
							"codigoEstablecimiento":"220",
							"proyecto111":"NO"
		                }
		        },
		        {   
		            "type" : "Feature",
		            "geometry" : {
		                "type" : "Point",
		                "coordinates" : [-55.9407102709, -27.2784503196]},
		                "properties" : {
		                    "periodo":"2014",
							"departamento":"Alto Paraguay",
							"distrito":"Caacupe",
							"barrioLocalidad":"Fernando Norte",
							"zona":"RURAL",
							"codigoEstablecimiento":"330",
							"proyecto111":"SI"
		                }
		        },
		        {   
		            "type" : "Feature",
		            "geometry" : {
		                "type" : "Point",
		                "coordinates" : [-57.6661353155, -25.3006268447]},
		                "properties" : {
		                    "periodo":"2014",
							"departamento":"Central",
							"distrito":"Caacupe",
							"barrioLocalidad":"Fernando Sur",
							"zona":"RURAL",
							"codigoEstablecimiento":"440",
							"proyecto111":"NO"
		                }
		        },
		        {   
		            "type" : "Feature",
		            "geometry" : {
		                "type" : "Point",
		                "coordinates" : [-57.5635172159, -25.0758229164]},
		                "properties" : {
		                    "periodo":"2014",
							"departamento":"Cordillera",
							"distrito":"Caacupe",
							"barrioLocalidad":"Fernando Norte",
							"zona":"URBANA",
							"codigoEstablecimiento":"550",
							"proyecto111":"NO"
		                }
		        },
		        {   
		            "type" : "Feature",
		            "geometry" : {
		                "type" : "Point",
		                "coordinates" : [-56.4289453898, -25.8100449916]},
		                "properties" : {
		                    "periodo":"2014",
							"departamento":"Cordillera",
							"distrito":"Caacupe",
							"barrioLocalidad":"Fernando Sur",
							"zona":"URBANA",
							"codigoEstablecimiento":"660",
							"proyecto111":"NO"
		                }
		        },
		        {   
		            "type" : "Feature",
		            "geometry" : {
		                "type" : "Point",
		                "coordinates" : [-57.291622461, -25.5552115638]},
		                "properties" : {
		                    "periodo":"2012",
							"departamento":"San Pedro",
							"distrito":"Asunción",
							"barrioLocalidad":"Luque",
							"zona":"URBANA",
							"codigoEstablecimiento":"770",
							"proyecto111":"SI"
		                }
		        },
		        {   
		            "type" : "Feature",
		            "geometry" : {
		                "type" : "Point",
		                "coordinates" : [-56.5537190775, -22.3345344]},
		                "properties" : {
		                    "periodo":"2012",
							"departamento":"San Pedro",
							"distrito":"Asunción",
							"barrioLocalidad":"Luque",
							"zona":"RURAL",
							"codigoEstablecimiento":"880",
							"proyecto111":"SI"
		                }
		        },
		        {   
		            "type" : "Feature",
		            "geometry" : {
		                "type" : "Point",
		                "coordinates" : [-55.9806638874, -22.577912964]},
		                "properties" : {
		                    "periodo":"2012",
							"departamento":"San Pedro",
							"distrito":"Caacupe",
							"barrioLocalidad":"Fernando Norte",
							"zona":"URBANA",
							"codigoEstablecimiento":"990",
							"proyecto111":"NO"
		                }
		        },
		        {   
		            "type" : "Feature",
		            "geometry" : {
		                "type" : "Point",
		                "coordinates" : [-56.1418883578, -22.5919981876]},
		                "properties" : {
		                    "periodo":"2012",
							"departamento":"San Pedro",
							"distrito":"Caacupe",
							"barrioLocalidad":"Fernando Sur",
							"zona":"URBANA",
							"codigoEstablecimiento":"1100",
							"proyecto111":"NO"
		                }
		        }
        	]
			};
			return e;
		}
	}
});