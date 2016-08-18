var express = require('express');
var router = express.Router();
var User = require('../app/model/user.js');
var Group = require('../app/model/group.js');
var Device = require('../app/model/device.js');
var NetHelp = require('../app/net').Help;
var Async = require('async');
var Ecmpp = require('../app/error'),
    DBError = Ecmpp.DB,
    Code = Ecmpp.CODE;
var content = require('./lib/content.js');


//admin phone = 13691818798
//admin password = 19891989

/**password参数和verify_code参数两者二选一 */
function login(req, res, next) {
    var param = content(req);
    var zone = param.zone,
        phone = param.phone,
        password = param.password,
        verify_code = param.verify_code;
    if (verify_code) {
        //暂未校验短信验证码
        User.login(zone, phone, function (err, ret) {
            NetHelp(req, res, err, ret);
        });
    } else {
        User.login(zone, phone, password, function (err, ret) {
            console.log(ret)
            // res.cookie('phone',phone);
            // res.cookie('token',ret.token);
            NetHelp(req, res, err, ret);
        });
    }
}


// var myLogger = function (req, res, next) {
//   console.log('LOGGED');
//   if (req.cookies.user && req.cookies.token) {
//     console.log(req.cookies);
//     // res.send("再次欢迎访问");
//       next();
//   } else {
//     // res.cookie('isVisit', 1, {maxAge: 60 * 1000});
//     res.redirect('http://localhost:3000/login');
//     // res.send("欢迎第一次访问");
//   }
// };

// router.use(myLogger);

function user(req, res, next) {
    var param = content(req);
    var phone = param.phone,
        token = param.token,
        condition = param.condition || '',
        count = param.count || 10,
        start_index = param.start_index || 0,
        sort = param.sort || 1;

    var query = {
        $or: [
            { username: new RegExp(condition) }, { mobile_number: new RegExp(condition) }
        ]
    };

    Async.waterfall([
        //认证用户token合法性
        function (cb) {
            User.findOne({ mobile_number: phone, token: token }, function (err, r) {
                if (err) {
                    cb(new DBError(Code.DBOperateWrong), null)
                } else {
                    if (r == null) {
                        cb(new DBError(Code.TokenInvalid), null)
                    } else {
                        cb(null, null)
                    }
                }
            })
        },
        //按条件查询数据
        function (date, cb) {
            User.find(query).
                limit(parseInt(count)).
                skip(parseInt(start_index)).
                sort({ username: parseInt(sort) }).
                exec(function (err, ret) {
                    if (err) {
                        cb(new DBError(Code.DBOperateWrong), null)
                    } else {
                        cb(null, ret)
                    }
                })
        }
    ], function (err, ret) {
        NetHelp(req, res, err, ret);
    });
}

function group(req, res, next) {
    var param = content(req);
    var phone = param.phone,
        token = param.token,
        condition = param.condition || '',
        count = param.count || 10,
        start_index = param.start_index || 0,
        sort = param.sort || 1;

    var query = {
        $or: [
            { name: new RegExp(condition) },
            { description: new RegExp(condition) },
            { open_id: new RegExp(condition) }
        ]
    };

    Async.waterfall([
        //认证用户token合法性
        function (cb) {
            User.findOne({ mobile_number: phone, token: token }, function (err, r) {
                if (err) {
                    cb(new DBError(Code.DBOperateWrong), null)
                } else {
                    if (r == null) {
                        cb(new DBError(Code.TokenInvalid), null)
                    } else {
                        cb(null, null)
                    }
                }
            })
        },
        //按条件查询数据
        function (date, cb) {
            Group.find(query).
                limit(parseInt(count)).
                skip(parseInt(start_index)).
                sort({ username: parseInt(sort) }).
                exec(function (err, ret) {
                    if (err) {
                        cb(new DBError(Code.DBOperateWrong), null)
                    } else {
                        cb(null, ret)
                    }
                })
        }
    ], function (err, ret) {
        NetHelp(req, res, err, ret);
    });
}

function device(req, res, next) {
    var param = content(req);
    var phone = param.phone,
        token = param.token,
        condition = param.condition || '',
        count = param.count || 10,
        start_index = param.start_index || 0,
        sort = param.sort || 1;

    var query = {
        $or: [
            { id: new RegExp(condition) },
            { name: new RegExp(condition) }
        ]
    };

    Async.waterfall([
        //认证用户token合法性
        function (cb) {
            User.findOne({ mobile_number: phone, token: token }, function (err, r) {
                if (err) {
                    cb(new DBError(Code.DBOperateWrong), null)
                } else {
                    if (r == null) {
                        cb(new DBError(Code.TokenInvalid), null)
                    } else {
                        cb(null, null)
                    }
                }
            })
        },
        //按条件查询数据
        function (date, cb) {
            Device.find(query).
                limit(parseInt(count)).
                skip(parseInt(start_index)).
                sort({ username: parseInt(sort) }).
                exec(function (err, ret) {
                    if (err) {
                        cb(new DBError(Code.DBOperateWrong), null)
                    } else {
                        cb(null, ret)
                    }
                })
        }
    ], function (err, ret) {
        NetHelp(req, res, err, ret);
    });
}

/**
 * logout
 */
function logout(req, res, next) {
    var param = content(req);
    var open_id = param.open_id,
        token = param.token;
    User.logout(open_id, token, function (err, ret) {
        NetHelp(req, res, err, ret);
    });
}

router.route('/login').get(login).post(login);
router.route('/user').get(user).post(user);
router.route('/group').get(group).post(group);
router.route('/device').get(device).post(device);
router.route('/logout').get(logout).post(logout);

module.exports = router;