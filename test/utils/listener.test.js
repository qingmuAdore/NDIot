var should = require('should'),
  Listener = require('../../app/utils').Listener;

var COUNT = 10;

describe('Listener Utils', function() {
  it('#run success', function() {
    var l = new Listener(COUNT);
    for (var i = 1; i < 100; i++) {
      l.run(function(){
        i.should.equal(COUNT);
      });
    }
  });
});
