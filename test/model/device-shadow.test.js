var should = require('should'),
    DeviceShadow = require('../../app/model/device-shadow.js'),
    User = require('../../app/model/user.js'),
    Device = require('../../app/model/device'),
    DB = require('../../app/db/db');
var ECmpp = require('../../app/error'),
    DBError = ECmpp.DB,
    CODE = ECmpp.CODE;
var Utils = require('../../app/utils'),
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

//device shadow
var version = 10, timestamp = 10030;
var state = {
    desired: { COLOR: 'red' },
    reported: { COLOR: 'blue' }
};
var desired = {
    state: {
        desired: { COLOR: 'yellow' }
    },
    version: 10
};
var reported = {
    reported: { COLOR: "RED" }
};

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

describe('DeviceShadow Model', function () {
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
        DeviceShadow.removeAll();
        DB.closeDB();
    });


    /** updateAndCreate */
    it('#updateAndCreate', function (done) {
        DeviceShadow.updateAndCreate(device_id,state,null,version,timestamp, function (err, res) {
            should.not.exist(err);
            console.log(res);
            done();
        })
    });

    /**judge */
    it('#judge device shadow exist', function (done) {
        DeviceShadow.judge(device_id, function (err, res) {
            should.not.exist(err);
            console.log(res);
            done();
        });
    });

    it('#judge param error cause MongoooseError', function (done) {
        DeviceShadow.judge({ device_id: device_id }, function (err, res) {
            should.exist(err);
            err.codeKV.should.equal(CODE.DBOperateWrong);
            console.log(err);
            done();
        });
    });

    it('#judge device shadow not exist', function (done) {
        DeviceShadow.judge(device_id + 'wrong', function (err, res) {
            should.exist(err);
            err.codeKV.should.equal(CODE.DeviceInexistence);
            console.log(err);
            done();
        });
    });


    /**get */
    it('#get device exist', function (done) {
        DeviceShadow.get(openId, userToken, device_id, function (err, res) {
            should.not.exist(err);
            console.log(err);
            done();
        });
    });

    it('#get param cause error', function (done) {
        DeviceShadow.get(openId, userToken, { device_id: device_id }, function (err, res) {
            should.exist(err);
            err.codeKV.should.equal(CODE.DBOperateWrong);
            console.log(err);
            done();
        });
    });

    it('#get device shadow not exist', function (done) {
        DeviceShadow.get(openId, userToken, device_id + 'wrong', function (err, res) {
            should.exist(err);
            err.codeKV.should.equal(CODE.DeviceInexistence);
            console.log(err);
            done();
        });
    });

    it('#get access token invalid', function (done) {
        DeviceShadow.get(openId, userToken + 'wrong', device_id, function (err, res) {
            should.exist(err);
            err.codeKV.should.equal(CODE.TokenInvalid);
            console.log(err);
            done();
        });
    });

    it('#get user not exist', function (done) {
        DeviceShadow.get(openId + 'wrong', userToken, device_id, function (err, res) {
            should.exist(err);
            err.codeKV.should.equal(CODE.UserInexistence);
            console.log(err);
            done();
        });
    });

    /** desire */
    it('#desire success', function (done) {
        DeviceShadow.desire(openId, userToken, device_id, desired, function (err, res) {
            should.not.exist(err);
            console.log(res);
            done();
        });
    });

    it('#desire success multi attribute ', function (done) {
        var nDoc = desired;
        nDoc.state.desired.SIZE = { h: 100, w: 150 };
        nDoc.state.desired.COLOR = 'white';
        DeviceShadow.desire(openId, userToken, device_id, desired, function (err, res) {
            should.not.exist(err);
            console.log(res);
            done();
        });
    });

    it('#desire param type wrong', function (done) {
        DeviceShadow.desire({ openId: openId }, userToken, device_id, desired, function (err, res) {
            should.exist(err);
            err.codeKV.should.equal(CODE.DBOperateWrong);
            console.log(err);
            done();
        });
    });


    it('#desire user not exists', function (done) {
        DeviceShadow.desire(openId + 'wrong', userToken, device_id, desired, function (err, res) {
            should.exist(err);
            err.codeKV.should.equal(CODE.UserInexistence);
            console.log(err);
            done();
        });
    });

    it('#desire token invalid', function (done) {
        DeviceShadow.desire(openId, userToken + 'wrong', device_id, desired, function (err, res) {
            should.exist(err);
            err.codeKV.should.equal(CODE.TokenInvalid);
            console.log(err);
            done();
        });
    });

    it('#desire token invalid', function (done) {
        DeviceShadow.desire(openId, userToken + 'wrong', device_id, desired, function (err, res) {
            should.exist(err);
            err.codeKV.should.equal(CODE.TokenInvalid);
            console.log(err);
            done();
        });
    });

    it('#desire device shadow not exist', function (done) {
        DeviceShadow.desire(openId, userToken, device_id + 'wrong', desired, function (err, res) {
            should.exist(err);
            err.codeKV.should.equal(CODE.DeviceInexistence);
            console.log(err);
            done();
        });
    });

    it('#desire device shadow version is wrong', function (done) {
        var docWrong = desired;
        docWrong.version = 11;
        DeviceShadow.desire(openId, userToken, device_id, docWrong, function (err, res) {
            should.exist(err);
            err.codeKV.should.equal(CODE.VersionWrong);
            console.log(err);
            done();
        });
    });

    /** report */
    it('#report success', function (done) {
        DeviceShadow.report(device_id, device_key, reported, version, function (err, res) {
            should.not.exist(err);
            console.log(res);
            done();
        });
    });

    it('#report success version can be empty', function (done) {
        DeviceShadow.report(device_id, device_key, reported, function (err, res) {
            should.not.exist(err);
            console.log(res);
            done();
        });
    });

    it('#report device is not exist', function (done) {
        DeviceShadow.report(device_id + 'wrong', device_key, reported, function (err, res) {
            should.exist(err);
            err.codeKV.should.equal(CODE.DeviceInexistence);
            done();
        });
    });

    it('#report device token is invalid', function (done) {
        DeviceShadow.report(device_id, device_key + 'wrong', reported, function (err, res) {
            should.exist(err);
            err.codeKV.should.equal(CODE.DeviceKeyInvalid);
            done();
        });
    });

    it('#report deviceVerify param type invalid', function (done) {
        DeviceShadow.report({ device_id: device_id }, device_key, reported, function (err, res) {
            should.exist(err);
            err.codeKV.should.equal(CODE.DBOperateWrong);
            done();
        });
    });

    it('#report state.reported is empty', function (done) {
        DeviceShadow.report(device_id, device_key, null, function (err, res) {
            should.not.exist(err);
            console.log(res);
            done();
        });
    });

    it('#report state.reported multi child', function (done) {
        var nReported = reported;
        nReported.reported.COLOR = 'GRAY';
        nReported.reported.HOT = 'hot';
        DeviceShadow.report(device_id, device_key, nReported, function (err, res) {
            should.not.exist(err);
            console.log(res);
            done();
        });
    });

    it('#report state has same bean value', function (done) {
        var nReported = reported;
        nReported.desired = nReported.desired || {};
        nReported.desired.CUT = 'cut';
        DeviceShadow.report(device_id, device_key, nReported, function (err, res) {
            should.not.exist(err);
            console.log(res);
            done();
        });
    });

});