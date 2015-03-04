'use strict';

describe('Controller: MapaleafletCtrl', function () {

  // load the controller's module
  beforeEach(module('yvyUiApp'));

  var MapaleafletCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MapaleafletCtrl = $controller('MapaleafletCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
