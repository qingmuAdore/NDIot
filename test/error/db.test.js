var should = require('should');
var ECmpp = require('../../app/error'),
    CODE = ECmpp.CODE,
    DBError = ECmpp.DB;
var MongooseError = require('mongoose').Error;

describe('Database Error', function() {
    it('#param is codeKV', function() {
        var dbError = new DBError(CODE.DBOperateWrong);
        dbError.codeKV.should.equal(CODE.DBOperateWrong);
        console.log(dbError.message);
    });

    it('#param is System Error', function() {
        var dbError = new DBError(new Error('system err'));
        dbError.codeKV.should.equal(CODE.System);
        console.log(dbError.message);
    });

    it('#param is MongooseError', function() {
        var dbError = new DBError(new MongooseError('mongoose err'));
        dbError.codeKV.should.equal(CODE.DBOperateWrong);
        console.log(dbError.message);
    });

    it('#param is DBError', function() {
        var dbError = new DBError(new DBError(CODE.MobileEmpty));
        dbError.codeKV.should.equal(CODE.MobileEmpty);
        console.log(dbError.message);
    });

    it('#param is null', function() {
        var dbError = new DBError();
        dbError.codeKV.should.equal(CODE.Success);
        console.log(dbError.message);
    });

    it('#param is invalid', function() {
        var dbError = new DBError('unknown');
        dbError.codeKV.should.equal(CODE.Unknow);
        console.log(dbError.message);
    });

});