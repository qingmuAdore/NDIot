var should = require('should');
var Utils = require('../../app/utils');
var Crypto = Utils.Crypto;

var password = "pzhang-password12";
var salt = '', key = '', cryptograph = '';


describe("crypto util", function () {

    it('encode', function () {
        cryptograph = Crypto.encode(password);
    });

    it('decode right', function () {
        var flg = Crypto.decode(password, cryptograph);
        flg.should.be.equal(true);
    });

    it('decode wrong', function () {
        var flg = Crypto.decode(password + "wrong", cryptograph);
        flg.should.be.equal(false);
    });

});