var DB = require('../../app/db/db');
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var UserSchema = new Schema({
  openId: String,                //用户id
  accessToken: String,             //会话令牌
  email: String,                 //邮箱
  time: Number
});

UserSchema.statics.updateAndCreate = function(openId, accessToken, time, cb) {
  cb = cb || function() { };
  var query = { time: time };
  var update = { openId: openId, accessToken: accessToken, };
  var options = { upsert: true };
  this.update(query, update, options, cb);
}


UserSchema.statics.skip = function(openId, cb) {
  cb = cb || function() { };
  var query = { openId: openId };

  var arr = [3, 6, 8, 14, 24, 56];
  query['time'] = {
    $in: arr
  };
  this.find(query).sort({ _id: 1 })
    .limit(10)
    .skip(3)
    .exec(cb);
}


var User = mongoose.model('User', UserSchema, 'user');
var openId = 'openId', accessToken = 'token';

DB.openDB(function(err, res) {
  // var i = 0;
  // var doc = { openId: openId, accessToken: accessToken };
  // for (i = 0; i < 100; i++) {
  //   doc.time = i;
  //   //  doc.openId = i;
  //   User.updateAndCreate(doc.openId, doc.accessToken, doc.time);
  // }
  // User.skip(openId, function(err, res) {
  //   console.log(res);
  //   DB.closeDB();
  // });
  

});