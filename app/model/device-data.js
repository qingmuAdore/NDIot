var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId,
    Device = require('./device'),
    User = require('./user'),
    /** 异常相关 */
    ECmpp = require('../error'),
    DBError = ECmpp.DB,
    CODE = ECmpp.CODE,
    Utils = require('../utils'),
    HELP = Utils.HELP;
Listener = Utils.Listener;

var DeviceDataSchema = new Schema({
    device_id: String, //设备id
    reported: Schema.Types.Mixed,//因为传感器数据有时是一个，有时是多个，
    //如温度是一个37度，而GPS是两个lat,lng
    version: Number,            //数据格式版本号
    seq: Number, //数据序列号
    timestamp: Number   //数据最后状态修改时间
});

/**
 * device verify 
 * @device_id 
 * @key
 */
DeviceDataSchema.statics.deviceVerify = function (device_id, key, cb) {
    cb = cb || function () { };
    //use get api to judge the exist
    Device.get(device_id, key, cb);
}

/**
 * user verify
 */
DeviceDataSchema.statics.userVerify = function (openId, token, cb) {
    cb = cb || function () { };
    User.verify(openId, token, cb);
}


/**
 * judge the data is repeat?
 * 
 * seq reserve
 */
DeviceDataSchema.statics.verify = function (device_id, timestamp, seq, cb) {
    if (typeof seq === 'function') {
        cb = seq;
        seq = null;
    }
    cb = cb || function () { };
    if (!timestamp) { return cb(null, null); }
    var query = {
        device_id: device_id,
        timestamp: timestamp
    }
    this.findOne(query, function (err, res) {
        if (err) { return cb(new DBError(err)); }
        if (HELP.hasValue(res)) { return cb(new DBError(CODE.DeviceDataRepeat)); }
        cb(null, res);
    });
}

/**
 * add device data
 * 
 * @device_id 
 * @key device key
 * @record  {reported,seq,timestamp}
 * @version 
 */
DeviceDataSchema.statics.add = function (device_id, key, record, version, cb) {
    this.deviceVerify(device_id, key, function (err, res) {
        if (err) { return cb(new DBError(err)); }
        var reported = record.reported;
        var seq = record.seq;
        var timestamp = record.timestamp;
        this.verify(device_id, timestamp, seq, function (err, res) {
            if (err) { return cb(new DBError(err)); }
            var doc = { device_id: device_id, reported: reported, version: version, seq: seq, timestamp: timestamp || HELP.timestamp() };
            this.create(doc, function (err, res) {
                if (err) {
                    return cb(new DBError(err));
                }
                cb(null, res);
            });
        }.bind(this));
    }.bind(this));
}

/**
 * adds record device data
 * 
 * @device_id 
 * @key
 * @state [{reported,seq,timestamp}]
 */
DeviceDataSchema.statics.adds = function (device_id, key, state, version, cb) {
    if (!state) {
        return cb(new DBError(CODE.DeviceDataEmpty));
    }
    if (!(state instanceof Array)) {
        return this.add(device_id, key, state, version, cb);
    } else {
        this.deviceVerify(device_id, key, function (err, res) {
            if (err) { return cb(err); }
            var records = [];
            var listener = new Listener(state.length);
            state.forEach(function (record) {
                var reported = record.reported;
                var seq = record.seq;
                var timestamp = record.timestamp;
                this.verify(device_id, timestamp, seq, function (err, res) {
                    if (!err) {
                        /** don't forget the device_id and version field */
                        record.device_id = device_id;
                        record.version = version;
                        record.timestamp = record.timestamp || HELP.timestamp();
                        records.push(record);
                    }
                    listener.run(function () {
                        this.create(records, function (err, res) {
                            if (err) { return cb(new DBError(err)) };
                            cb(null, res);
                        }.bind(this));
                    }.bind(this));
                }.bind(this));
            }, this);
        }.bind(this));
    }
}

/**
 * getDate
 * 
 * query device data
 * @start_time: timestamp begin
 * @stop_time: timestamp end
 * @count: the return max count
 * @start_index: the page index
 */
DeviceDataSchema.statics.getData = function (openId, token, device_id, start_time, stop_time, count, start_index, cb) {
    this.userVerify(openId, token, function (err, res) {
        if (err) { return cb(new DBError(err)); }
        Device.exist(device_id, function (err, res) {
            if (err) {
                return cb(new DBError(err));
            }
            start_time = HELP.toInt(start_time);
            stop_time = HELP.toInt(stop_time);
            count = HELP.toInt(count) || 20;
            count = count > 100 ? 100 : count;
            start_index = HELP.toInt(start_index) || 1;
            start_index = start_index > 0 ? start_index : 1;
            var query = {};
            query['device_id'] = device_id;
            query['timestamp'] = {
                $gt: start_time,
                $lte: stop_time
            };
            var options = {};
            options['skip'] = (start_index - 1) * count;
            options['sort'] = { 'timestamp': -1 };   //降序
            options['limit'] = count;
            this.find(query, null, options, function (err, res) {
                if (err) {
                    return cb(new DBError(err));
                }
                cb(null, res);
            });
        }.bind(this));
    }.bind(this));
}


DeviceDataSchema.statics.removeAll = function (cb) {
    cb = cb || function () { };
    this.remove({}, function (err, res) {
        if (err) {
            return cb(new DBError(err));
        }
        return cb(null, res);
    });
};

/**
 * find all
 */
DeviceDataSchema.statics.findAll = function (cb) {
    cb = cb || function () { };
    this.find({}, function (err, res) {
        if (err) {
            return cb(new DBError(err));
        }
        cb(null, res);
    }.bind(this));
};

module.exports = mongoose.model('DeviceData', DeviceDataSchema, 'device_data');
