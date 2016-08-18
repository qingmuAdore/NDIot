var express = require('express');
var router = express.Router();
var Device = require('../app/model/device');
var DeviceShadow = require('../app/model/device-shadow');
var DeviceData = require('../app/model/device-data');
var NetHelp = require('../app/net').Help;
var content = require('./lib/content.js');
var Utils = require('../app/utils'),
    UtilHelp = Utils.HELP;
var content = require('./lib/content.js');

router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

/******************************* */
/*          temporary            */
/******************************* */
function all(req, res, next) {
    Device.findAll(function (err, ret) {
        NetHelp(req, res, err, ret);
    });
}

function upload(req, res, next) {
    var param = content(req);
    var device_id = param.device_id;
    var token = param.device_key;
    var state = param.state || {};
    var version = param.version;
    state = UtilHelp.parse(state);
    DeviceData.adds(device_id, device_key, state, version, function (err, ret) {
        if (err) return NetHelp(req, res, err, ret);
        //shadow report 
        DeviceShadow.report(device_id, device_key, state, version, function (err, ret) {
            NetHelp(req, res, err, ret);
        });
    });
}
/******************************* */
/*        end  temporary         */
/******************************* */


/**
 * user register device
 */
function register(req, res, next) {
    var param = content(req);
    var open_id = param.open_id;
    var token = param.token;
    var name = param.name;
    var uid = param.uid;
    var sn = param.sn;
    var manufacturer = param.manufacturer;
    var type = param.type;
    var lat = param.lat;
    var lng = param.lng;
    //暂未校验短信验证码
    Device.register(open_id, token, name, uid, sn, manufacturer, type, lat, lng, function (err, ret) {
        //NetHelp(req, res, err, ret);
        if (err) return NetHelp(req, res, err, ret);
        var device_id = ret.id;
        /** add device shadow */
        DeviceShadow.add(device_id, function (err, shadow) {
            return NetHelp(req, res, err, ret);
        }.bind(this));
    }.bind(this));
}



/**
 *device info
 */
function info(req, res, next) {
    var param = content(req);
    var open_id = param.open_id;
    var token = param.token;
    var device_id = param.device_id;
    Device.info(open_id, token, device_id, function (err, ret) {
        NetHelp(req, res, err, ret);
    });
}


/**
 * device update
 */
function update(req, res, next) {
    var param = content(req);
    var open_id = param.open_id;
    var token = param.token;
    var device_id = param.device_id;
    var name = param.name;
    var uid = param.uid;
    var sn = param.sn;
    var manufacturer = param.manufacturer;
    var type = param.type;
    var lat = param.lat;
    var lng = param.lng;
    Device.modify(open_id, token, device_id, name, uid, sn, manufacturer, type, lat, lng, function (err, ret) {
        NetHelp(req, res, err, ret);
    });
}


/**
 * get data
 */
function getData(req, res, next) {
    var param = content(req);
    var open_id = param.open_id;
    var token = param.token;
    var device_id = param.device_id;
    var start_time = param.start_time;
    var stop_time = param.stop_time;
    var count = param.count;
    var start_index = param.start_index;
    DeviceData.getData(open_id, token, device_id, start_time, stop_time, count, start_index, function (err, ret) {
        NetHelp(req, res, err, ret);
    });
}


/**
 * shadow
 */
function shadow(req, res, next) {
    var param = content(req);
    var open_id = param.open_id;
    var token = param.token;
    var device_id = param.device_id;
    var data = param.data;
    //param.data 是字符串 ---> json串转Object
    var jdata = null;
    try {
        jdata = UtilHelp.parse(data);
    } catch (error) {
        return NetHelp(req, res, error);
    }
    if (jdata) {
        //更新                 
        DeviceShadow.desire(open_id, token, device_id, jdata, function (err, ret) {
            NetHelp(req, res, err, ret);
            if (!err && this.mqttRouter && this.mqttRouter._client) {
                //提交数据,发布主题/device/{device_id} 
                this.mqttRouter._client.publish('/device/' + device_id, data);
            }
        });
    } else {
        DeviceShadow.get(open_id, token, device_id, function (err, ret) {
            NetHelp(req, res, err, ret);
        });
    }
}

router.route('/all').get(all).post(all);
router.route('/upload').get(upload).post(upload);
router.route('/register').get(register).post(register);
router.route('/info').get(info).post(info);
router.route('/update').get(update).post(update);
router.route('/data').get(getData).post(getData);
router.route('/shadow').get(shadow).post(shadow);
module.exports = router;
