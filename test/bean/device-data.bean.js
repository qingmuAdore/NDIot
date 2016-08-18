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
var timestamp = 0;
//the record count of device data
var rCOUNT = 0;


var start = 0, end = 0, count = 5, index = 2;


function cb(err, res) {
    console.log(err);
    console.log(res);
    DB.closeDB();
};

DB.openDB(function (err, res) {
    // Device.updateAndCreate(device_id, device_key, function (err, res) {
    //     deal(err, res, l, done);
    // });
    DeviceData.adds(device_id, device_key, record, version, function (err, res) {
        rCOUNT += 5;
        cb(err, res);
    });
});