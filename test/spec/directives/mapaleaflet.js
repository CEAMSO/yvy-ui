'use strict';

describe('Directive: mapaLeaflet', function () {

  // load the directive's module
  beforeEach(module('yvyUiApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    
    element = document.createElement('mapa-leaflet');
    document.body.appendChild(element);
    element = angular.element(document.getElementsByTagName('mapa-leaflet'));
    $compile(document.getElementsByTagName('mapa-leaflet'))(scope)
    expect(element.text()).toBe('+-Leaflet | © OpenStreetMap Contributors, CC-BY-SA, Imagery © OpenStreetMap');
  }));
});
