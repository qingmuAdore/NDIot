var should = require('should'),
    DeviceData = require('../../app/model/device-data.js'),
    User = require('../../app/model/user.js'),
    Device = require('../../app/model/device'),
    DB = require('../../app/db/db');
var ECmpp = require('../../app/error'),
    DBError = ECmpp.DB,
    CODE = ECmpp.CODE;
var Utils = require('../../app/utils'),
    HELP = Utils.HELP,
    Listener = Utils.Listener;

//user
var openId = 'openId', userToken = 'token';
//device
var device_id = 'deviceUUID';
var device_key = 'deviceKey';
var name = 'deviceName';
var attributes = {
    manufacturer: 'Anon',
    tp: 'IOT Device', //type为关键字,改为tp
    uid: 'device_factory_id',
    serial_number: '10293847562912',
    lat: 135.3,
    lng: 32.5
};
//data
var record = {
    reported: { color: 'red', temperature: 13.5 },
    seq: 12345,
    timestamp: 10000,
};
var version = 10;
//the record count of device data
var rCOUNT = 0;
var start = 0, end = 0, count = 3, index = 1;

function deal(err, res, listener, done, cb) {
    cb = cb || function () { };
    if (err) {
        console.log(err);
        DB.closeDB();
        process.exit(-1);
    }
    cb(err, res);
    listener.run(done);
}

describe('DeviceData Model', function () {
    before(function (done) {
        DB.openDB(function () {
            var l = new Listener(2);
            User.updateAndCreate(openId, userToken, function (err, res) {
                deal(err, res, l, done);
            });

            Device.updateAndCreate(device_id, device_key, function (err, res) {
                deal(err, res, l, done);
            });
        });
    });

    after(function () {
        User.removeAll();
        Device.removeAll();
        DeviceData.removeAll();
        DB.closeDB();
    });

    //add
    it('#add', function (done) {
        DeviceData.add(device_id, device_key, record, version, function (err, res) {
            should.not.exist(err);
            rCOUNT += 1;
            done();
        });
    });

    it('#add', function (done) {
        DeviceData.add(device_id, device_key, record, version, function (err, res) {
            should.exist(err);
            err.codeKV.should.equal(CODE.DeviceDataRepeat);
            done();
        });
    });

    it('#add device is not exist', function (done) {
        DeviceData.add(device_id + 'wrong', device_key, record, version, function (err, res) {
            should.exist(err);
            err.codeKV.should.equal(CODE.DeviceInexistence);
            done();
        });
    });

    it('#add device token is invalid', function (done) {
        DeviceData.add(device_id, device_key + 'wrong', record, version, function (err, res) {
            should.exist(err);
            err.codeKV.should.equal(CODE.DeviceKeyInvalid);
            done();
        });
    });

    it('#adds', function (done) {
        var state = [];
        for (var i = 0; i < 5; i++) {
            var r = {
                reported: record.reported,
                seq: record.req,
                timestamp: 100 + i,
            };
            state.push(r);
        }
        DeviceData.adds(device_id, device_key, state, version, function (err, res) {
            should.not.exist(err);
            console.log(res);
            rCOUNT += 5;
            done();
        });
    });

    it('#adds', function (done) {
        var state = [];
        for (var i = -1; i < 6; i++) {
            var r = {
                reported: record.reported,
                seq: record.req,
                timestamp: 100 + i,
            };
            state.push(r);
        }
        DeviceData.adds(device_id, device_key, state, version, function (err, res) {
            should.not.exist(err);
            console.log(res);
            rCOUNT += 2;
            done();
        });
    });

    it('#adds function verify', function (done) {
        DeviceData.findAll(function (err, res) {
            should.not.exist(err);
            res.length.should.equal(rCOUNT);
            count
            done();
        });
    });


    it('#adds state is empty', function (done) {
        DeviceData.adds(device_id, device_key, null, version, function (err, res) {
            should.exist(err);
            err.codeKV.should.equal(CODE.DeviceDataEmpty);
            done();
        });
    });


    it('#adds state is not Array', function (done) {
        record.timestamp = 1234567;
        DeviceData.adds(device_id, device_key, record, version, function (err, res) {
            should.not.exist(err);
            console.log(res);
            rCOUNT += 1;
            done();
        });
    });

    it('#adds function verify', function (done) {
        DeviceData.findAll(function (err, res) {
            should.not.exist(err);
            res.length.should.equal(rCOUNT);
            done();
        });
    });

    it('#getData', function (done) {
        start = 101;
        end = 108;
        console.log(start + '  ' + end);
        DeviceData.getData(openId, userToken, device_id, start, end, count, index, function (err, res) {
            should.not.exist(err);
            console.log(res);
            done();
        });
    });

    it('#getData use is not exist', function (done) {
        DeviceData.getData(openId + 'wrong', userToken, device_id, start, end, count, index, function (err, res) {
            should.exist(err);
            err.codeKV.should.equal(CODE.UserInexistence);
            done();
        });
    });

    it('#getData use token is invalid', function (done) {
        DeviceData.getData(openId, userToken + 'token', device_id, start, end, count, index, function (err, res) {
            should.exist(err);
            err.codeKV.should.equal(CODE.TokenInvalid);
            done();
        });
    });

    it('#getData device is not exist', function (done) {
        DeviceData.getData(openId, userToken, device_id + 'wrong', start, end, count, index, function (err, res) {
            should.exist(err);
            err.codeKV.should.equal(CODE.DeviceInexistence);
            done();
        });
    });
});