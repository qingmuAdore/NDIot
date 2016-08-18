var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
var ECmpp = require('../error'),
  DBError = ECmpp.DB,
  CODE = ECmpp.CODE;
var Utils = require('../utils'),
  HELP = Utils.HELP,
  Obj = Utils.Obj;
var Device = require('./device'),
  User = require('./user');

var DeviceShadowSchema = new Schema({
  device_id: String,  //设备的device_id详细定义看Vision平台的device_id编码规范
  state: {
    desired: Schema.Types.Mixed,
    reported: Schema.Types.Mixed
  },
  metadata: {
    desired: Schema.Types.Mixed,
    reported: Schema.Types.Mixed
  },
  version: Number,
  timestamp: Number
});


/**
 * deviceVerify
 * 
 * id key 
 */
DeviceShadowSchema.statics.deviceVerify = function (device_id, device_key, cb) {
  cb = cb || function () { };
  Device.get(device_id, device_key, cb);
}


/**
 * user verify
 */
DeviceShadowSchema.statics.userVerify = function (openId, token, cb) {
  cb = cb || function () { };
  User.verify(openId, token, cb);
}

/**
 * device shadow updateAndCreate
 */
DeviceShadowSchema.statics.updateAndCreate = function (device_id, state, metadata, version, timestamp, cb) {
  cb = cb || function () { };
  var query = { device_id: device_id };
  var update = {
    state: state,
    metadata: metadata,
    version: version,
    timestamp: timestamp,
  };
  var options = { upsert: true };
  this.update(query, update, options, function (err, res) {
    if (err) return cb(new DBError(CODE.DBOperateWrong));
    return cb(null, res);
  });
}


/**
 * add 
 */
DeviceShadowSchema.statics.add = function (id, cb) {
  cb = cb || function () { };
  this.updateAndCreate(id, null, null, null, null, cb);
}

/**
 * judge device shadow exist
 */
DeviceShadowSchema.statics.judge = function (device_id, cb) {
  cb = cb || function () { };
  var query = { device_id: device_id };
  this.findOne(query, function (err, res) {
    if (err) {
      return cb(new DBError(err));
    }
    if (!HELP.hasValue(res)) {
      return cb(new DBError(CODE.DeviceInexistence));
    }
    return cb(null, res);
  });
}

/**
 * get the device shadow info
 * 
 * @openId user id
 * @token  user access token
 * @device_id device uuid
 */
DeviceShadowSchema.statics.get = function (openId, token, device_id, cb) {
  cb = cb || function () { };
  this.userVerify(openId, token, function (err, res) {
    if (err) {
      return cb(err);
    }
    this.judge(device_id, cb);
  }.bind(this));
}

/**
 * when to upload/modify should access 
 * 
 * #openId token --> user verify
 * #device_id version ---> device verify
 */
DeviceShadowSchema.statics.accessVerify = function (openId, token, device_id, version, cb) {
  cb = cb || function () { };
  this.userVerify(openId, token, function (err, res) {
    if (err) {
      return cb(err);
    }
    this.judge(device_id, function (err, res) {
      if (err) {
        return cb(err);
      }
      if (version != res.version) {
        return cb(new DBError(CODE.VersionWrong));
      }
      cb(null, res);
    }.bind(this));
  }.bind(this));
}

/** 
 * field latest timestamp
 */
function fTime(o) {
  var timestamp = HELP.timestamp();
  var doc = {};
  for (var f in o) {
    doc[f] = { timestamp: timestamp };
  }
  return doc;
}

/**
 * device shadow desire
 * 
 * # shadow state desired update
 */
DeviceShadowSchema.statics.desire = function (openId, token, device_id, data, cb) {
  cb = cb || function () { };
  data = data || {};
  this.accessVerify(openId, token, device_id, data.version, function (err, res) {
    if (err) {
      return cb(err);
    }
    /*-----------------updata---------------------*/
    var query = { device_id: device_id };
    /******** state  ************/
    var state = res._doc.state || {};
    state.desired = state.desired || {};
    // retain the state.desired unchange field
    state.desired = Obj.combine(state.desired, data.state.desired);
    /*********** metadata *************/
    var metadata = res._doc.metadata || {};
    metadata.desired = metadata.desired || {};
    var ft = fTime(data.state.desired);
    // retain the metadata.desired unchange field
    metadata.desired = Obj.combine(metadata.desired, ft);
    /*-----------------updata---------------------*/
    var update = { state: state, metadata: metadata, timestamp: HELP.timestamp() };
    var options = { upsert: true };
    this.update(query, update, options, cb);
  }.bind(this));
}


/**
 * report device shadow, record the latest reported and the metadata reported 
 * 
 * @device_id device uuid
 * @device_key device key
 * @state device shadow state.reported(need to modify)
 * @version device vesion
 * 
 * #notice: state.reported and metadata all need to update
 */
DeviceShadowSchema.statics.report = function (device_id, device_key, state, version, cb) {
  if (typeof version == 'function') {
    cb = version;
    version = 0;
  }
  cb = cb || function () { };
  this.deviceVerify(device_id, device_key, function (err, res) {
    if (err) {
      return cb(err);
    }
    this.judge(device_id, function (err, res) {
      if (err) {
        return cb(err);
      }
      /*-----------------updata---------------------*/
      var query = { device_id: device_id };
      state = state || {};
      state.reported = state.reported || {};
      /*********** metadata *************/
      var ft = fTime(state.reported);
      var metadata = res._doc.metadata || {};
      // retain the metadata.reported unchange field
      metadata.reported = Obj.combine(metadata.reported, ft);

      /******** state  ************/
      state.desired = res._doc.state.desired || {};
      // retain the state.report unchange field
      state.reported = Obj.combine(res._doc.state.reported, state.reported);
      /*-----------------updata---------------------*/
      /** Do you need to verify version? */
      res.version = res.version || 0;
      version = version || res.version;
      var update = {
        state: state,
        metadata: metadata,
        version: version,
        timestamp: HELP.timestamp()
      };
      this.update(query, update, cb);
    }.bind(this));
  }.bind(this));
}

DeviceShadowSchema.statics.removeAll = function (cb) {
  cb = cb || function () { };
  this.remove({}, function (err, res) {
    if (err) { return cb(new DBError(err)) };
    cb(null, res);
  });
}

module.exports = mongoose.model('DeviceShadow', DeviceShadowSchema, 'device_shadow');