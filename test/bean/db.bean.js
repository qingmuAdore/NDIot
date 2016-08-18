var DB = require('../../app/db/db');
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var UserSchema = new Schema({
  openId: String,                //用户id
  accessToken: String,             //会话令牌
  email: String,                 //邮箱
  time: Number
});

UserSchema.statics.updateAndCreate = function (openId, accessToken, time, cb) {
  cb = cb || function () { };
  var query = { time: time };
  var update = { openId: openId, accessToken: accessToken, };
  var options = { upsert: true };
  this.update(query, update, options, cb);
}

UserSchema.statics.adds = function (users, cb) {
  this.create(users, cb);
}


var User = mongoose.model('User', UserSchema, 'user');
var user = {
  openId: 'openId',
  accessToken: 'token',
  email: 'email',
  time: 13
}

DB.openDB(function (err, res) {
  var users = new Array();
  users.push(user);
  users.push(user);
  users.push(user);
  users.push(user);
  User.adds(users, function (err, res) {
    console.log(err);
    console.log(res);
    DB.closeDB();
  });
});