'use strict';

describe('Service: idb', function () {

  // load the service's module
  beforeEach(module('publicTransAppApp'));

  // instantiate service
  var idb;
  beforeEach(inject(function (_idb_) {
    idb = _idb_;
  }));

  it('should do something', function () {
    expect(!!idb).toBe(true);
  });

});
