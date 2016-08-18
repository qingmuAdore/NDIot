var should = require('should'),
    User = require('../../app/model/user.js'),
    Device = require('../../app/model/device'),
    DB = require('../../app/db/db');
var ECmpp = require('../../app/error'),
    DBError = ECmpp.DB,
    CODE = ECmpp.CODE;

var id = 'deviceUUID';
var key = 'deviceKey';
var name = 'deviceName';
var attributes = {
    manufacturer: 'Anon',
    tp: 'IOT Device', //type为关键字,改为tp
    uid: 'device_factory_id',
    serial_number: '10293847562912',
    lat: 135.3,
    lng: 32.5
};
//user
var openId = 'openId', userToken = 'userToken';


describe('Device Model', function() {
    before(function(done) {
        DB.openDB(function(err, res) {
            User.updateAndCreate(openId, userToken, function(err, res) {
                if (err) {
                    console.log(err);
                    DB.closeDB();
                    process.exit(-1);
                }
                done();
            });
        });
    });

    after(function() {
        User.removeAll();
        Device.removeAll();
        DB.closeDB();
    });

    //updateAndCreate
    it('#updateAndCreate', function(done) {
        Device.updateAndCreate(id + 'uac', key + 'uac', function(err, res) {
            should.not.exist(err);
            console.log(res);
            done();
        });
    });

    //add
    it('#add', function(done) {
        Device.add(name, attributes, function(err, res) {
            should.not.exist(err);
            id = res.id;
            key = res.key;
            console.log(res);
            done();
        });
    });

    //register
    it('#register', function(done) {
        Device.register(openId, userToken, name + 'register', attributes.uid, attributes.serial_number, attributes.tp
            , attributes.manufacturer, attributes.lat, attributes.lng, function(err, res) {
                should.not.exist(err);
                console.log(res);
                done();
            });
    });

    it('#register user is not exist', function(done) {
        Device.register(openId + 'wrong', userToken, name, attributes.uid, attributes.serial_number, attributes.tp
            , attributes.manufacturer, attributes.lat, attributes.lng, function(err, res) {
                should.exist(err);
                err.codeKV.should.equal(CODE.UserInexistence);
                done();
            });
    });

    it('#register user token is invalid', function(done) {
        Device.register(openId, userToken + 'wrong', name, attributes.uid, attributes.serial_number, attributes.tp
            , attributes.manufacturer, attributes.lat, attributes.lng, function(err, res) {
                should.exist(err);
                err.codeKV.should.equal(CODE.TokenInvalid);
                done();
            });
    });

    //exist
    it('#exist', function(done) {
        Device.exist(id, function(err, res) {
            should.not.exist(err);
            done();
        });
    });

    it('#exist device is not exist', function(done) {
        Device.exist(id + 'wrong', function(err, res) {
            should.exist(err);
            err.codeKV.should.equal(CODE.DeviceInexistence);
            done();
        });
    });

    //get
    it('#get', function(done) {
        Device.get(id, key, function(err, res) {
            should.not.exist(err);
            console.log(res);
            done();
        });
    });

    it('#get device is not exist', function(done) {
        Device.get(id + 'wrong', key, function(err, res) {
            should.exist(err);
            err.codeKV.should.equal(CODE.DeviceInexistence);
            done();
        })
    });

    it('#get key is error', function(done) {
        Device.get(id, key + 'wrong', function(err, res) {
            should.exist(err);
            err.codeKV.should.equal(CODE.DeviceKeyInvalid);
            done();
        })
    });

    it('#get param type invalid', function(done) {
        Device.get({ id: id }, key, function(err, res) {
            should.exist(err);
            err.codeKV.should.equal(CODE.DBOperateWrong);
            done();
        });
    });

    //info
    it('#info', function(done) {
        Device.info(openId, userToken, id, function(err, res) {
            should.not.exist(err);
            console.log(res);
            done();
        });
    });

    //renew 
    it('#renew', function(done) {
        var attributes_new = {
            cg: 'change',
            lat: -23
        };
        Device.renew(id, name, attributes_new, function(err, res) {
            should.not.exist(err);
            console.log(res);
            done();
        });
    });

    //user modify
    it('#modify', function(done) {
        Device.modify(openId, userToken, id, name + 'modify', attributes.uid, attributes.serial_number, attributes.tp
            , attributes.manufacturer + '  modify', attributes.lat, attributes.lng, function(err, res) {
                should.not.exist(err);
                console.log(res);
                done();
            });
    });


});