var should = require('should'),
  HELP = require('../../app/utils/help.js');

describe('Help Utils', function () {
  var item = {};
  var empty = null;
  var itemArr = [1];
  var arrEmpty = [];
  //hasValue
  it('#hasValue item', function () {
    HELP.hasValue(item).should.be.true();
  });

  it('#hasValue empty', function () {
    HELP.hasValue(empty).should.be.false();
  });

  it('#hasValue itemArr', function () {
    HELP.hasValue(itemArr).should.be.true();
  });

  it('#hasValue array is empty', function () {
    HELP.hasValue(arrEmpty).should.be.false();
  });
});