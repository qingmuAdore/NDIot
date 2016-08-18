var DB = require('../../app/db/db');
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    DeviceShadow = require('../../app/model/device-shadow');
var openId = 'openId';
var token = 'token';
var time = 1;

var uid = 'deviceId', deviceToken = 'deviceToken';
var reported = {
    reported: { color: "RED" }
};

function cb(err, res) {
    console.log(err);
    console.log(res);
    DB.closeDB();
};

DB.openDB(function(err, res) {
    DeviceShadow.report(uid, deviceToken, reported, function(err, res) {
        console.log(err);
        console.log(res);
        DB.closeDB();
    })
});