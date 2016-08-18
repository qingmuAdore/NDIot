var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId,
    /** 异常相关 */
    ECmpp = require('../error'),
    DBError = ECmpp.DB,
    CODE = ECmpp.CODE,
    Grade = require('../../app/model/grade.js');

var utils = require('../utils/');

var REGULAR = utils.Regular,
    HELP = utils.HELP,
    Crypto = utils.Crypto;

var UserSchema = new Schema({
    open_id: String,              // 用户id
    token: String,              // 会话令牌
    email: String,
    email_verified: Boolean,
    zone: Number,
    mobile_number: String,
    mobile_verified: Boolean,
    username: String,
    password: String,
    grade_id: { type: ObjectId, ref: 'Grade' }
});


var user = UserSchema.statics;

/**
 * register
 */
user.register = function (zone, phone, name, password, cb) {
    var err = null;
    if (HELP.isEmpty(zone)) {
        err = userError(CODE.ZoneEmpty);

    } else if (HELP.isEmpty(phone)) {
        err = userError(CODE.MobileEmpty);

    } else if (HELP.isEmpty(password)) {
        err = userError(CODE.PasswordEmpty);

    } else if (!REGULAR.isMobile(phone)) {
        err = userError(CODE.MobileInvalid);
    }

    if (err) {
        return userResult(err, null, cb);
    }

    var query = { mobile_number: phone };
    this.findOne(query, function (err, res) {
        if (err) {
            err = userError(CODE.DBOperateWrong);

        } else if (HELP.hasValue(res)) {
            err = userError(CODE.RegisterAgain);
        }

        if (err) {
            return userResult(err, null, cb);
        }

        Grade.getDefault(function (err, res) {
            if (err) {
                err = userError(CODE.DBOperateWrong);
                return userResult(err, null, cb);
            }

            var doc = {
                open_id: HELP.uuid(),      // 用户id
                zone: zone,    			   // 地区
                mobile_number: phone,      // 手机
                mobile_verified: true,     // 手机验证
                username: name,   		   // 用户名
                password: Crypto.encode(password), // 密码 
                grade_id: res._id
            };

            this.create(doc, function (err, res) {
                if (err) {
                    err = userError(CODE.DBOperateWrong);
                }

                return userResult(err, res, cb);
            });

        }.bind(this))
    }.bind(this));
}

/**
 *  get value
 */
user.get = function (openId, cb) {
    var query = { open_id: openId };
    this.findOne(query, function (err, res) {
        if (err) {
            err = userError(CODE.DBOperateWrong);

        } else if (!HELP.hasValue(res)) {
            err = userError(CODE.UserInexistence);
        }
        return userResult(err, res, cb);
    });
}


/**
 * @param verify
 * 
 * user unexist 
 * token invalid
 */
user.verify = function (openId, token, cb) {
    this.get(openId, function (err, res) {
        /** res is not empty,should compare token */
        if (res && token != res.token) {
            err = userError(CODE.TokenInvalid);
        }
        return userResult(err, res, cb);
    });
}

/**
 * update if data not exist create it
 */
user.updateAndCreate = function (openId, accessToken, cb) {
    cb = cb || function () { };
    var query = { open_id: openId };
    var update = { token: accessToken };
    var options = { upsert: true };
    this.update(query, update, options, cb);
}

/**
 * update 
 */
user.updateInfo = function (openId, accessToken, zone, mobile_number, username, password, cb) {
    this.get(openId, function (err, res) {
        if (mobile_number != null) {
            if (!REGULAR.isMobile(mobile_number)) {
                err = userError(CODE.MobileInvalid);
            }
        }

        if (accessToken != res.token) {
            err = userError(CODE.TokenInvalid);
        }

        if (err) {
            return userResult(err, res, cb);
        }

        res.zone = zone || res.zone;
        res.mobile_number = mobile_number || res.mobile_number;
        res.username = username || res.username;
        res.password = Crypto.encode(password) || res.password;
        res.save(function (err, ret) {
            if (err) {
                err = userError(CODE.DBOperateWrong);
            }

            return userResult(err, res, cb);
        })
    });
}

/**
 * getInfo 
 */
user.getInfo = function (openId, token, cb) {
    this.get(openId, function (err, res) {
        if (err) {
            err = userError(err);

        } else if (token != res.token) {
            err = userError(CODE.TokenInvalid);
        }

        return userResult(err, res, cb);
    });
}

/**
 * login
 *
 * cb {open_id,token} 
 */
user.login = function (zone, phone, password, cb) {
    cb = cb || function () { };

    if (typeof password == 'function') {
        cb = password;
        password = null;
    }

    var err = null;

    if (password == null) {
        err = userError(CODE.PasswordEmpty);
    } else if (HELP.isEmpty(zone)) {
        err = userError(CODE.ZoneEmpty);

    } else if (HELP.isEmpty(phone)) {
        err = userError(CODE.MobileEmpty);

    } else if (!REGULAR.isMobile(phone)) {
        err = userError(CODE.MobileInvalid);
    }

    if (err) {
        return userResult(err, null, cb);
    }

    var query = { zone: zone, mobile_number: phone };
    this.findOne(query, function (err, res) {
        if (err) {
            err = userError(err);

        } else if (!HELP.hasValue(res)) {
            err = userError(CODE.UserInexistence);

        } else if (password != null && !Crypto.decode(password, res.password)) {
            // if password is null，mean use sms verify code
            err = userError(CODE.PasswordWrong);
        }

        if (err) {
            return userResult(err, null, cb);
        }

        var token = HELP.uuid();
        var open_id = res.open_id;
        var form = { token: token };

        this.update(query, form, function (err, res) {
            if (err) {
                err = userError(CODE.DBOperateWrong);
            }

            form.open_id = open_id;
            return userResult(err, form, cb);
        });

    }.bind(this));
}

/**
 * thirdLogin
 * 
 * TODO: Not Yet Open, under developing
 */
user.thirdLogin = function (open_id, token, name, cb) {
    cb = cb || function () { };
    return cb(userError(CODE.NotYetOpen));
}

/**
 * logout
 * 
 * #set token '--[-]--'
 */
user.logout = function (openId, token, cb) {
    this.get(openId, function (err, res) {
        if (err) {
            err = userError(err);

        } else if (token != res.token) {
            err = userError(CODE.TokenInvalid);
        }

        if (err) {
            return userResult(err, res, cb);
        }

        var query = { open_id: openId };
        var update = { token: '--[-]--' };
        this.update(query, update, function (err, res) {
            if (err) {
                err = userError(CODE.DBOperateWrong);
            }

            return userResult(err, res, cb);
        });

    }.bind(this));
}

/**
 * getAll
 */
user.findAll = function (cb) {
    this.find({}, function (err, res) {
        return userResult(err, res, cb);
    });
};

/**
 * remove all
 */
user.removeAll = function (cb) {
    this.remove({}, function (err, res) {
        return userResult(err, res, cb);
    });
};

function userError(err) {
    return new DBError(err);
}

function userResult(err, res, cb) {
    if (!cb) {
        return null;
    }

    if (!err) {
        return cb(null, res);
    }

    if (err instanceof DBError) {
        return cb(err);
    }

    return cb(userError(err));
}

module.exports = mongoose.model('User', UserSchema, 'user');
