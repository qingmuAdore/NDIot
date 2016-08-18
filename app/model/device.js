var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    /** error */
    ECmpp = require('../error'),
    DBError = ECmpp.DB,
    CODE = ECmpp.CODE,
    HELP = require('../utils/help');
var User = require('./user');

var DeviceSchema = new Schema({
    id: String,
    key: String,
    name: String,
    attributes: {
        manufacturer: String,
        tp: String, //类型
        //type: String,  // 该字段是关键字段 ---- 不能使用
        uid: String,//设备出厂id 
        serial_number: String,
        lat: Number,
        lng: Number
    },
});

/**
 * update if data not exist create it
 */
DeviceSchema.statics.updateAndCreate = function (id, key, cb) {
    var query = { id: id };
    var update = { key: key };
    var options = { upsert: true };
    this.update(query, update, options, function (err, res) {
        if (err) { return cb(new DBError(err)); }
        cb(null, res);
    });
}

/** 
 * device add
 * 
 * #cb {id,key}
 */
DeviceSchema.statics.add = function (name, attributes, cb) {
    cb = cb || function () { };
    var doc = {
        id: HELP.uuid(),
        key: HELP.random(),
        name: name,
        attributes: attributes,
    };
    this.create(doc, function (err, res) {
        if (err) {
            return cb(new DBError(CODE.DBOperateWrong));
        }
        var ret = { id: res.id, key: res.key };
        return cb(null, ret);
    });
}

DeviceSchema.statics.userVerify = function (open_id, token, cb) {
    cb = cb || function () { };
    User.verify(open_id, token, cb);
}

/**
 * user  register device
 * 
 * @should create shadow
 */
DeviceSchema.statics.register = function (open_id, token, name, uid, sn, manufacturer, type, lat, lng, cb) {
    cb = cb || function () { };
    this.userVerify(open_id, token, function (err, res) {
        if (err) {
            return cb(err);
        }
        var attributes = {
            manufacturer: manufacturer,
            tp: type,
            uid: uid,
            serial_number: sn,
            lat: lat,
            lng: lng,
        }
        this.add(name, attributes, cb);
    }.bind(this));
}


/**
 * exist
 */
DeviceSchema.statics.exist = function (id, cb) {
    cb = cb || function () { };
    var query = { id: id };
    this.findOne(query, function (err, res) {
        if (err) {
            return cb(new DBError(CODE.DBOperateWrong));
        }
        if (!HELP.hasValue(res)) {
            return cb(new DBError(CODE.DeviceInexistence));
        }
        cb(null, res);
    });
}

/**
 * get device
 * 
 * @key device save
 */
DeviceSchema.statics.get = function (id, key, cb) {
    cb = cb || function () { };
    this.exist(id, function (err, res) {
        if (err) {
            return cb(err);
        }
        if (key !== res.key) {
            return cb(new DBError(CODE.DeviceKeyInvalid));
        }
        cb(null, res);
    });
}



/**
 * renew (update is the system function we use the renew )
 */
DeviceSchema.statics.renew = function (device_id, name, attributes, cb) {
    cb = cb || function () { };
    attributes = attributes || {};
    this.exist(device_id, function (err, res) {
        if (err) { return cb(err); }
        var atr = res.attributes;
        attributes.manufacturer = attributes.manufacturer || atr.manufacturer;
        attributes.tp = attributes.tp || atr.tp;
        attributes.uid = attributes.uid || atr.uid;
        attributes.serial_number = attributes.serial_number || atr.serial_number;
        attributes.lat = attributes.lat || atr.lat;
        attributes.lng = attributes.lng || atr.lng;
        var query = { id: device_id };
        var update = { name: name, attributes: attributes };
        this.update(query, update, function (err, res) {
            if (err) { return cb(new DBError(err)); }
            cb(null, res);
        })
    }.bind(this));
}

/**
 * user get device information
 */
DeviceSchema.statics.info = function (open_id, token, device_id, cb) {
    cb = cb || function () { };
    this.userVerify(open_id, token, function (err, res) {
        if (err) {
            return cb(err);
        }
        this.exist(device_id, cb);
    }.bind(this));
}

/**
 * user modify device information
 * 
 * #>verify user  
 * > devcie exist 
 * > renew (update)
 */
DeviceSchema.statics.modify = function (open_id, token, device_id, name, uid, sn, manufacturer, type, lat, lng, cb) {
    cb = cb || function () { };
    this.userVerify(open_id, token, function (err, res) {
        if (err) {
            return cb(err);
        }
        var attributes = {
            manufacturer: manufacturer,
            tp: type,
            uid: uid,
            serial_number: sn,
            lat: lat,
            lng: lng,
        }
        this.renew(device_id, name, attributes, cb);
    }.bind(this));
}

/**
 * find all
 */
DeviceSchema.statics.findAll = function (cb) {
    cb = cb || function () { };
    this.find({}, function (err, res) {
        if (err) {
            return cb(new DBError(err));
        }
        return cb(null, res);
    }.bind(this));
};


/**
 * remove all
 */
DeviceSchema.statics.removeAll = function (cb) {
    cb = cb || function () { };
    this.remove({}, function (err, res) {
        if (err) {
            return cb(new DBError(err));
        }
        return cb(null, res);
    });
};


module.exports = mongoose.model('Device', DeviceSchema, 'device');