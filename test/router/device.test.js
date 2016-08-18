var should = require('should'),
    DB = require('../../app/db/db'),
    REQUEST = require('./request'),
    User = require('../../app/model/user'),
    Device = require('../../app/model/device'),
    DeviceData = require('../../app/model/device-data'),
    DeviceShadow = require('../../app/model/device-shadow');
var Ecmpp = require('../../app/error'),
    CODE = Ecmpp.CODE;
var Utils = require('../../app/utils'),
    HELP = Utils.HELP,
    Listener = Utils.Listener;

describe('device router', function () {
    //user
    var user_token = 'usertoken';
    var open_id = 'open_id';
    //device
    var name = 'deviceName';
    var uid = 'deviceUUID',
        sn = 1348252,
        manufacturer = 'iot cmpp',
        type = 'ibeacan',
        lat = 13,
        lng = 432;
    var device_token = 'device_token';
    var device_key = 'device_key';
    var device_id = 'device_id';
    var device_id_t = 'device_id';
    //data
    var record = {
        reported: { color: 'red', temperature: 13.5 },
        seq: 12345,
        timestamp: 10000,
    };
    var version = 10;
    var timestamp = 0;
    var start = -10, stop = 0, count = 5, index = 1;
    //shadow
    var state = {
        desired: { COLOR: 'red' },
        reported: { COLOR: 'blue' }
    };
    //content
    var content = null;

    before(function (done) {
        DB.openDB(function (err) {
            if (err) {
                process.exit(-1);
                DB.closeDB();
            }
            done();
        });
    });

    after(function () {
        User.removeAll();
        Device.removeAll();
        DeviceData.removeAll();
        DeviceShadow.removeAll();
        DB.closeDB();
    });

    //@prepare
    it('@prepare add user', function (done) {
        User.updateAndCreate(open_id, user_token, function (err, res) {
            should.not.exist(err);
            done();
        });
    });

    it('@prepare add device ', function (done) {
        Device.updateAndCreate(device_id, device_key, function (err, res) {
            should.not.exist(err);
            done();
        });
    });

    it('@prepare add multi device data', function (done) {
        var state = [];
        for (var i = 0; i < 20; i++) {
            var r = {
                reported: record.reported,
                seq: record.req,
                timestamp: 100 + i,
            };
            state.push(r);
        }
        DeviceData.adds(device_id, device_key, state, version, function (err, res) {
            should.not.exist(err);
            // console.log(res);
            done();
        });
    });

    it('@prepare add device shadow', function (done) {
        DeviceShadow.updateAndCreate(device_id,state,null,version,timestamp, function (err, res) {
            should.not.exist(err);
            console.log(res);
            done();
        })
    });

    // //register
    it('#register', function (done) {
        content = {
            open_id: open_id,
            token: user_token,
            name: name,
            uid: uid,
            sn: sn,
            manufacturer: manufacturer,
            type: type,
            lat: lat,
            lng: lng,
        };
        REQUEST.post('/device/register', content, CODE.Success, done, function (err, res) {
            console.log(res);
            device_id = res.data.id;
            device_key = res.data.key;
        });
    });

    // //info
    it('#info get info', function (done) {
        content = {
            open_id: open_id,
            token: user_token,
            device_id: device_id
        };
        REQUEST.post('/device/info', content, CODE.Success, done);
    });

    //update
    it('update update info', function (done) {
        content = {
            open_id: open_id,
            token: user_token,
            device_id: device_id,
            name: name + '_update',
            uid: uid,
            sn: sn + 10000000,
            lng: lng - 233,
        };
        REQUEST.post('/device/update', content, CODE.Success, done);
    });

    //data
    it('data', function (done) {
        content = {
            open_id: open_id,
            token: user_token,
            device_id: device_id_t,
            start_time: start + timestamp,
            stop_time: stop + timestamp,
            count: count,
            start_index: index
        };
        REQUEST.post('/device/data', content, CODE.Success, done, function (err, res) {
            console.log(res);
        });
    });

    //shadow
    it('shadow get shadow information', function (done) {
        content = {
            open_id: open_id,
            token: user_token,
            device_id: device_id_t,
        };
        REQUEST.post('/device/shadow', content, CODE.Success, done, function (err, res) {
            console.log(res);
        });
    });

    it('shadow update shadow information', function (done) {
        content = {
            open_id: open_id,
            token: user_token,
            device_id: device_id_t,
            data: {
                state: {
                    desired: {           //渴望数据状态
                        COLOR: 'BLACK',
                        SIZE: { h: 130, w: 200 }
                    }
                },
                version: version,         //数据格式版本号
            }
        };
        REQUEST.post('/device/shadow', content, CODE.Success, done, function (err, res) {
            console.log(res);
        });
    });
}); 