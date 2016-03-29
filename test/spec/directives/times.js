'use strict';

describe('Directive: times', function () {

  // load the directive's module
  beforeEach(module('publicTransAppApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<times></times>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the times directive');
  }));
});
