var should = require('should'),
    User = require('../../app/model/user.js'),
    Grade = require('../../app/model/grade.js'),
    DB = require('../../app/db/db');
var ECmpp = require('../../app/error'),
    DBError = ECmpp.DB,
    CODE = ECmpp.CODE;
var assert = require('assert');
describe('User Model', function () {
    var openId = 'openId', token = 'token';

    before(function (done) {
        DB.openDB(function () {
            done();
        });
    });

    after(function () {
        User.removeAll();
        Grade.removeAll();
        DB.closeDB();
    });

    it('#register', function (done) {
        User.register('86', '13691818794', 'name', 'password', function (err, res) {
            should.not.exist(err);
            console.log(res);
            openId = res.open_id
            token = res.token
            done();
        })
    })

    it('register wrong number', function (done) {
        User.register("123124", "136918187", "haung", "ajdsfj", function (err, result) {
            assert.equal(CODE.MobileInvalid, err.codeKV);
            done()
        })
    })


    it('register  had register', function (done) {
        User.register("86", "13691818794", "haung", "ajdsfj", function (err, result) {
            assert.equal(CODE.RegisterAgain, err.codeKV);
            done()
        })
    })

    /** updateAndCreate */
    it('#updateAndCreate', function (done) {
        User.updateAndCreate(openId + 'uac', token + 'uac', function (err, res) {
            should.not.exist(err);
            console.log(res);
            done();
        });
    });

    /** get */
    it('#get has data', function (done) {
        User.get(openId, function (err, res) {
            should.not.exist(err);
            console.log(res);
            done();
        });
    });

    it('#get no data', function (done) {
        User.get(openId + 'no', function (err, res) {
            should.exist(err);
            console.log(err);
            done();
        });
    });

    /** verify */
    it('#verify is success', function (done) {
        console.log('hsp ' + openId)
        User.verify(openId, token, function (err, res) {
            should.not.exist(err);
            console.log(res);
            done();
        });
    });

    it('#verify token is invalid', function (done) {
        User.verify(openId, token + 'no', function (err, res) {
            should.exist(err);
            console.log(err);
            done();
        });
    });

    it('#verify user is not exist', function (done) {
        User.verify(openId + 'no', token, function (err, res) {
            should.exist(err);
            console.log(err);
            done();
        });
    });

    //updateInfo
    it('#update user info ', function (done) {
        User.updateInfo(openId, token, '86', '13691818795', 'username', 'password', function (err, res) {
            should.not.exist(err);
            console.log(res);
            done();
        })
    })

    //getInfo
    it('#get user info ', function (done) {
        User.getInfo(openId, token, function (err, res) {
            should.not.exist(err);
            console.log(res);
            done();
        })
    })

    //login
    it('#login', function (done) {
        User.login('86', '13691818795', 'password', function (err, res) {
            should.not.exist(err);
            openId = res.open_id;
            token = res.token;
            done();
        });
    });

    it('#login mobile invalid', function (done) {
        User.login('86', '13mobileinvalid', 'password', function (err, res) {
            should.exist(err);
            err.codeKV.should.equal(CODE.MobileInvalid);
            done();
        });
    });

    it('#login user not exist', function (done) {
        User.login('86', '13825002527', 'password', function (err, res) {
            should.exist(err);
            err.codeKV.should.equal(CODE.UserInexistence);
            done();
        });
    });

    it('#login password is wrong', function (done) {
        User.login('86', '13691818795', 'password' + 'wrong', function (err, res) {
            should.exist(err);
            err.codeKV.should.equal(CODE.PasswordWrong);
            done();
        });
    });

    //logout
    it('#logout', function (done) {
        User.logout(openId, token, function (err, res) {
            should.not.exist(err);
            done();
        });
    });

    it('#logout use is not exist', function (done) {
        User.logout(openId + 'wrong', token, function (err, res) {
            should.exist(err);
            err.codeKV.should.equal(CODE.UserInexistence);
            done();
        });
    });

    it('#logout token is invalid', function (done) {
        User.logout(openId, token, function (err, res) {
            should.exist(err);
            err.codeKV.should.equal(CODE.TokenInvalid);
            done();
        });
    });

    /**findAll */
    it('#findAll', function (done) {
        User.findAll(function (err, res) {
            should.not.exist(err);
            console.log(res);
            res = res || {};
            var length = res.length || 0;
            (length > 0).should.be.true();
            done();
        });
    })

    /** removeAll */
    it('#removeAll', function (done) {
        User.removeAll(function (err, res) {
            //done();
            User.findAll(function (err, res) {
                should.not.exist(err);
                res = res || {};
                var length = res.length || 0;
                length.should.equal(0);
                done();
            });
        })
    })
});
