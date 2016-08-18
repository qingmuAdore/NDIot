var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
var util = require('util'),
  /** error */
  ECmpp = require('../error'),
  DBError = ECmpp.DB,
  CODE = ECmpp.CODE;
var User = require('./user.js');

function AbstractSchema(schema) {
  AbstractSchema.super_.apply(this, [schema], this.constructor);

  /**
  *verify openId token
  */
  this.statics.verify = function(openId, token, cb) {
    cb = cb || function() { };
    User.verify(openId, token, cb);
  }

  /**
   * remove all
   */
  this.statics.removeAll = function(cb) {
    cb = cb || function() { };
    this.remove({}, cb);
  };
}

util.inherits(AbstractSchema, Schema);

module.exports = AbstractSchema;