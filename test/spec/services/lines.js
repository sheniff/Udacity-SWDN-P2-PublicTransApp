'use strict';

describe('Service: lines', function () {

  // load the service's module
  beforeEach(module('publicTransAppApp'));

  // instantiate service
  var lines;
  beforeEach(inject(function (_lines_) {
    lines = _lines_;
  }));

  it('should do something', function () {
    expect(!!lines).toBe(true);
  });

});
