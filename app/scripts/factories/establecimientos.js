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
		                    "codigoEstablecimiento":"1000",
							"departamento":"Central",
							"distrito":"Asunción",
							"barrioLocalidad":"Luque",
							"zona":"RURAL",
							"proyecto111":"SI",
							"proyecto822":"NO"
		                }
		        },
		        {   
		            "type" : "Feature",
		            "geometry" : {
		                "type" : "Point",
		                "coordinates" : [-55.7569477676, -22.5666461779]},
		                "properties" : {
		                    "periodo":"2014",
		                    "codigoEstablecimiento":"1500",
							"departamento":"Alto Paraná",
							"distrito":"Asunción",
							"barrioLocalidad":"Luque",
							"zona":"RURAL",
							"proyecto111":"NO",
							"proyecto822":"SI"
		                }
		        },
		        {   
		            "type" : "Feature",
		            "geometry" : {
		                "type" : "Point",
		                "coordinates" : [-55.9407102709, -27.2784503196]},
		                "properties" : {
		                    "periodo":"2014",
		                    "codigoEstablecimiento":"2000",
							"departamento":"Alto Paraguay",
							"distrito":"Caacupe",
							"barrioLocalidad":"Fernando Norte",
							"zona":"RURAL",
							"proyecto111":"SI",
							"proyecto822":"NO"
		                }
		        },
		        {   
		            "type" : "Feature",
		            "geometry" : {
		                "type" : "Point",
		                "coordinates" : [-57.6661353155, -25.3006268447]},
		                "properties" : {
		                    "periodo":"2014",
		                    "codigoEstablecimiento":"2500",
							"departamento":"Central",
							"distrito":"Caacupe",
							"barrioLocalidad":"Fernando Sur",
							"zona":"RURAL",
							"proyecto111":"NO",
							"proyecto822":"SI"
		                }
		        },
		        {   
		            "type" : "Feature",
		            "geometry" : {
		                "type" : "Point",
		                "coordinates" : [-57.5635172159, -25.0758229164]},
		                "properties" : {
		                    "periodo":"2014",
		                    "codigoEstablecimiento":"3000",
							"departamento":"Cordillera",
							"distrito":"Caacupe",
							"barrioLocalidad":"Fernando Norte",
							"zona":"URBANA",
							"proyecto111":"NO",
							"proyecto822":"NO"
		                }
		        },
		        {   
		            "type" : "Feature",
		            "geometry" : {
		                "type" : "Point",
		                "coordinates" : [-56.4289453898, -25.8100449916]},
		                "properties" : {
		                    "periodo":"2014",
		                    "codigoEstablecimiento":"3500",
							"departamento":"Cordillera",
							"distrito":"Caacupe",
							"barrioLocalidad":"Fernando Sur",
							"zona":"URBANA",
							"proyecto111":"NO",
							"proyecto822":"SI"
		                }
		        },
		        {   
		            "type" : "Feature",
		            "geometry" : {
		                "type" : "Point",
		                "coordinates" : [-57.291622461, -25.5552115638]},
		                "properties" : {
		                    "periodo":"2012",
		                    "codigoEstablecimiento":"4000",
							"departamento":"San Pedro",
							"distrito":"Asunción",
							"barrioLocalidad":"Luque",
							"zona":"URBANA",
							"proyecto111":"SI",
							"proyecto822":"NO"
		                }
		        },
		        {   
		            "type" : "Feature",
		            "geometry" : {
		                "type" : "Point",
		                "coordinates" : [-56.5537190775, -22.3345344]},
		                "properties" : {
		                    "periodo":"2012",
		                    "codigoEstablecimiento":"4500",
							"departamento":"San Pedro",
							"distrito":"Asunción",
							"barrioLocalidad":"Luque",
							"zona":"RURAL",
							"proyecto111":"SI",
							"proyecto822":"SI"
		                }
		        },
		        {   
		            "type" : "Feature",
		            "geometry" : {
		                "type" : "Point",
		                "coordinates" : [-55.9806638874, -22.577912964]},
		                "properties" : {
		                    "periodo":"2012",
		                    "codigoEstablecimiento":"5000",
							"departamento":"San Pedro",
							"distrito":"Caacupe",
							"barrioLocalidad":"Fernando Norte",
							"zona":"URBANA",
							"proyecto111":"NO",
							"proyecto822":"NO"
		                }
		        },
		        {   
		            "type" : "Feature",
		            "geometry" : {
		                "type" : "Point",
		                "coordinates" : [-56.1418883578, -22.5919981876]},
		                "properties" : {
		                    "periodo":"2012",
		                    "codigoEstablecimiento":"5500",
							"departamento":"San Pedro",
							"distrito":"Caacupe",
							"barrioLocalidad":"Fernando Sur",
							"zona":"URBANA",
							"proyecto111":"NO",
							"proyecto822":"SI"
		                }
		        }
        	]
			};
			return e;
		}
	}
});