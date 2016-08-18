'use strict';

var express = require('express');
var user = require('../app/model/user.js');
var net = require('../app/net');
var error = require('../app/error');
var content = require('./lib/content.js');

var errCode = error.CODE;
var sendResult = net.Help;
var router = express.Router();
var TAG = 'user';

function test(req, res, next) {
    sendResult(req, res, errCode.AuthorityExist, { info: 'info', help: 'help' });
}

function all(req, res, next) {
    user.findAll(function (err, ret) {
        sendResult(req, res, err, ret);
    });
}

/**
 * TODO: need to verify the sms_verify_code is valid
 */
function register(req, res, next) {
    var param = content(req);
    var zone = param.zone,
        phone = param.phone,
        username = param.username,
        password = param.password,
        verify_code = param.verify_code;
    // TODO: 暂未校验短信验证码
    user.register(zone, phone, username, password, function (err, ret) {
        sendResult(req, res, err, ret);
    });
}

/** password 参数和 verify_code 参数两者二选一 */
function login(req, res, next) {
    var param = content(req);
    var zone = param.zone,
        phone = param.phone,
        password = param.password,
        verify_code = param.verify_code;

    if (verify_code) {
        // TODO: 暂未校验短信验证码
        user.login(zone, phone, function (err, ret) {
            sendResult(req, res, err, ret);
        });

    } else {
        user.login(zone, phone, password, function (err, ret) {
            sendResult(req, res, err, ret);
        });
    }
}

/**
 * third login
 * 
 * #not yet open
 */
function thirdLogin(req, res, next) {
    var param = content(req);
    var open_id = param.open_id;
    var token = param.token;
    var username = param.username;
    user.thirdLogin(open_id, token, username, function (err, ret) {
        sendResult(req, res, err, ret);
    })
}

/**
 * info
 * 
 */
function info(req, res, next) {
    var param = content(req);
    var open_id = param.open_id,
        token = param.token,
        zone = param.zone,
        phone = param.phone,
        username = param.username,
        password = param.password;
    if (zone || phone || username || password) {
        user.updateInfo(open_id, token, zone, phone, username, password, function (err, ret) {
            sendResult(req, res, err, ret);
        });
    } else {
        user.getInfo(open_id, token, function (err, ret) {
            ret = ret || {};
            var username = ret.username;
            var open_id = ret.open_id;
            sendResult(req, res, err, { username: username, open_id: open_id });
        });
    }
}

/**
 * logout
 */
function logout(req, res, next) {
    var param = content(req);
    var open_id = param.open_id,
        token = param.token;
    user.logout(open_id, token, function (err, ret) {
        sendResult(req, res, err, ret);
    });
}

router.route('/test').get(test).post(test);
router.route('/all').get(all).post(all);
router.route('/register').get(register).post(register);
router.route('/login').get(login).post(login);
router.route('/third_login').get(thirdLogin).post(thirdLogin);
router.route('/info').get(info).post(info);
router.route('/logout').get(logout).post(logout);

module.exports = router;