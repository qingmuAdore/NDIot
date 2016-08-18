var should = require('should'),
    DB = require('../../app/db/db'),
    REQUEST = require('./request'),
    User = require('../../app/model/user');
var Ecmpp = require('../../app/error'),
    CODE = Ecmpp.CODE;

describe('user router', function () {
    var token = null;
    var content = null;
    var open_id = null;

    before(function (done) {
        DB.openDB(function (err) {
            done();
        });
    });

    after(function () {
        User.removeAll();
        DB.closeDB();
    });

    //register
    it('#register', function (done) {
        content = {
            zone: '86',
            phone: '13825002527',
            username: 'pzhang',
            password: 'password',
            verify_code: 'code',
        };
        REQUEST.post('/user/register', content, CODE.Success, done);
    });

    it('#register registe again', function (done) {
        content = {
            zone: '86',
            phone: '13825002527',
            username: 'pzhang',
            password: 'password',
            verify_code: 'code',
        };
        REQUEST.post('/user/register', content, CODE.RegisterAgain, done);
    });

    it('#register zone is empty', function (done) {
        content = {
            zone: '',
            phone: '13825002527',
            username: 'pzhang',
            password: 'password',
            verify_code: 'code',
        };
        REQUEST.post('/user/register', content, CODE.ZoneEmpty, done);
    });

    it('#register phone is empty', function (done) {
        content = {
            zone: '86',
            phone: '',
            username: 'pzhang',
            password: 'password',
            verify_code: 'code',
        };
        REQUEST.post('/user/register', content, CODE.MobileEmpty, done);
    });

    it('#register phone is invalid', function (done) {
        content = {
            zone: '86',
            phone: '13825446',
            username: 'pzhang',
            password: 'password',
            verify_code: 'code',
        };
        REQUEST.post('/user/register', content, CODE.MobileInvalid, done);
    });

    it('#register password is empty', function (done) {
        content = {
            zone: '86',
            phone: '13825002527',
            username: 'pzhang',
            password: '',
            verify_code: 'code',
        };
        REQUEST.post('/user/register', content, CODE.PasswordEmpty, done);
    });

    //login
    it('#login ', function (done) {
        content = {
            zone: '86',
            phone: '13825002527',
            password: 'password',
        };
        REQUEST.post('/user/login', content, CODE.Success, done, function (err, res) {
            open_id = res.data.open_id;
            token = res.data.token;
        });
    });


    //third_login
    it('#third_login', function (done) {
        content = {
            open_id: 'open_id',
            token: 'token',
            username: 'pzhang'
        };
        REQUEST.post('/user/third_login', content, CODE.NotYetOpen, done, function (err, res) {
            console.log(res);
        });
    });

    //info
    it('#info get information', function (done) {
        content = {
            open_id: open_id,
            token: token,
        };
        REQUEST.post('/user/info', content, CODE.Success, done, function (err, res) {
            console.log(res);
            console.log(err);
        });
    });

    it('#info update information', function (done) {
        content = {
            open_id: open_id,
            token: token,
            password: 'password change',
        };
        REQUEST.post('/user/info', content, CODE.Success, done);
    });

    //logout
    it('#logout', function (done) {
        content = {
            open_id: open_id,
            token: token,
        };
        REQUEST.post('/user/logout', content, CODE.Success, done);
    });

}); 