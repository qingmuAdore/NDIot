var should = require('should'),
    Authority = require('../../app/model/authority.js'),
    DB = require('../../app/db/db');
var ECmpp = require('../../app/error'),
    DBError = ECmpp.DB,
    CODE = ECmpp.CODE;
var Utils = require('../../app/utils'),
    Obj = Utils.Obj;

describe('User Model', function () {
    var name = 'authority_one', description = 'description';
    before(function (done) {
        DB.openDB(function () {
            done();
        });
    });

    after(function () {
        Authority.removeAll();
        DB.closeDB();
    });

    /** add */
    it('#add', function (done) {
        Authority.add(name, description, function (err, res) {
            should.not.exist(err);
            console.log(err);
            done();
        });
    });

    it('#add', function (done) {
        Authority.add(name, description, function (err, res) {
            should.exist(err);
            CODE.AuthorityExist.should.equal(err.codeKV);
            done();
        });
    });

    /** modify */
    it('#modify', function (done) {
        var desc = 'description_modify';
        Authority.modify(name, desc, function (err, res) {
            should.not.exist(err);
            res.description.should.equal(desc);
            done();
        });
    });

    it('#modify has not exist the authority', function (done) {
        var name = 'name_wrong';
        Authority.modify(name, description, function (err, res) {
            should.exist(err);
            err.codeKV.should.equal(CODE.AuthorityInexistence);
            done();
        });
    });

    /** delete */
    it('#delete', function (done) {
        Authority.delete(name, function (err, res) {
            should.not.exist(err);
            done();
        });
    });

    it('#delete', function (done) {
        Authority.delete(name, function (err, res) {
            should.exist(err);
            err.codeKV.should.equal(CODE.AuthorityInexistence);
            done();
        });
    });


    /** updateAndCreate */
    it('#updateAndCreate', function (done) {
        var doc = { name: 'authority_new', description: 'description_new' };
        Authority.updateAndCreate(doc.name, doc.description, function (err, res) {
            should.not.exist(err);
            Obj.compare(doc, res).should.be.true();
            done();
        })
    });

});
