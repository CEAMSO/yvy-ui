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
    element = angular.element('<mapa-leaflet></mapa-leaflet>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the mapaLeaflet directive');
  }));
});
