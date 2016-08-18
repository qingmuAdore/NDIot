var should = require('should'),
    Grade = require('../../app/model/grade.js'),
    DB = require('../../app/db/db');
var ECmpp = require('../../app/error'),
    DBError = ECmpp.DB,
    CODE = ECmpp.CODE;
var assert = require('assert');
describe('Grade Model', function() {
    // var openId = 'openId', token = 'token';

    before(function(done) {
        DB.openDB(function() {
            done();
        });
    });

    after(function() {
        Grade.removeAll();
        DB.closeDB();
    });

    it('#getDefault', function(done) {
        Grade.getDefault(function(err, res) {
            should.not.exist(err);
            console.log(res);
            done();
        })

    })



});
