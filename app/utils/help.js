var UUID = require('uuid');


/**
 * judge res is exist
 * 
 * @res is not array, judge res isn't empty
 * @res is array,judge res has child 
 */
exports.hasValue = function (res) {
    if (res instanceof Array) {
        return res.length > 0;
    }
    return res != null;
}

/**
 * key value
 */
exports.kv = function (key, value) {
    var o = {};
    var value = value || {};
    if (key == null) {
        throw "key is null";
    }
    if (typeof key != 'string') {
        key = key.toString();
    }
    o[key] = value;
    return o;
}

/**
 * string is empty
 */
exports.isEmpty = function (str) {
    if (str == null || typeof str === 'undefined') {
        return true;
    }
    str = str.toString();
    return str.length == 0;
}

exports.uuid = function () {
    return UUID.v1();
}

exports.timestamp = function () {
    return new Date().getTime();
}

exports.parse = function (jstr) {
    var json = null;
    if (typeof jstr === 'object') {
        json = jstr;
        
    } else if (typeof jstr === 'string') {
        try {
            json = JSON.parse(jstr);
        } catch (error) {
            throw 'cannot parse the string:' + jstr;
        }
    }
    return json;
}

exports.jstr = function (doc) {
    var jstr = null;
    if (typeof doc === 'string') {
        jstr = doc;
    } else if (typeof doc === 'object') {
        try {
            jstr = JSON.stringify(doc);
        } catch (error) {
            throw 'cannot stringify the document';
        }
    }
    return jstr;
}

// 转字符串 
exports.toString = function (obj) {
    obj = obj || "";
    return obj.toString();
}

exports.toInt = function (str) {
    var v = parseInt(str, 10);
    v = Number.isNaN(v) ? 0 : v;
    return v;
}

exports.RangeType = RangeType = {
    DEFAULT: 0,
    UPPER: 1,
    LOWER: 2,
    NUMBER: 3,
    UPPER_NUMBER: 4,
    LOWER_NUMBER: 5,
    UPPER_LOWER_NUMBER: 6,
    CUSTOM: 7,
}


/**
 * random string, default length is 24
 * 
 * @len: length
 * @type: the range of string 
 * @chars: the custome range
 */
exports.random = function (len, type, chars) {
    len = len || 24;
    type = type || RangeType.DEFAULT;
    var $chars = '';
    switch (type) {
        case RangeType.UPPER:
            $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            break;
        case RangeType.LOWER:
            $chars = 'abcdefhijklmnopqrstuvwxyz';
            break;
        case RangeType.NUMBER:
            $chars = '0123456789';
            break;
        case RangeType.UPPER_NUMBER:
            $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            break;
        case RangeType.LOWER_NUMBER:
            $chars = 'abcdefhijklmnopqrstuvwxyz0123456789';
            break;
        case RangeType.CUSTOM:
            $chars = chars;
            break;
        default:
            $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefhijklmnopqrstuvwxyz0123456789';
            break;
    }
    var maxPos = $chars.length;
    var res = '';
    for (var i = 0; i < len; i++) {
        res += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return res;
}