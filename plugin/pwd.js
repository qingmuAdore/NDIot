var User = require('../app/model/user');
var DB = require('../app/db/db');
var Async = require('async');
var Utils = require('../app/utils'),
    Crypto = Utils.Crypto;

DB.openDB(function (err, res) {
    Async.waterfall([
        function (cb) {
            User.findAll(cb);
        },
        function (users, cb) {
            Async.each(users, function (user, cb) {
                /** 字段加密处理 */
                var encrypt = Crypto.encode(user.password);
                user.password = encrypt;
                user.save(cb);
            }, function (err) {
                cb(err);
            });
        }
    ], function (err) {
        console.log(res);
        DB.closeDB();
    });
});
