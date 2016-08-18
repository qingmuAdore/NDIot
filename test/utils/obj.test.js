var should = require('should'),
  Obj = require('../../app/utils/obj');

var o = { name: 'pauly', age: 10, work: 'soft engineer' };
var l = { name: 'pauly', age: 10, work: 'soft engineer' };
var n = { name: 'paulynew', sex: 'boy', age: 28, birthday: '19880905' };

describe('Obj Utils', function () {
  it('#compare', function () {
    Obj.compare(o, l).should.be.true();
  });

  it('#compare', function () {
    var nl = l;
    nl.info = 'info';
    Obj.compare(o, l).should.be.false();
  });

  it('#combine', function () {
    var obj = Obj.combine(o, n);
    obj['name'].should.equal('paulynew');
    obj['age'].should.equal(28);
    obj['work'].should.equal('soft engineer');
    obj['sex'].should.equal('boy');
  });

  it('#combine o is empty', function () {
    var obj = Obj.combine(null, n);
    Obj.compare(obj, n).should.be.true();
  });

  it('#combine n is empty', function () {
    var obj = Obj.combine(o, null);
    Obj.compare(obj, o).should.be.true();
  });


});