var CryptoJS = require("crypto-js");
var Help = require('./help.js');


var LEN = 128 / 16,
    SIZE = 128 / 32;

/**
 * encode the password
 * 
 * @pwd:password
 * @len:the salt length
 * @size:the key size
 * 
 * @return salt + key
 */
exports.encode = function (pwd, len, size) {
    len = len || LEN;
    size = size || SIZE;
    var salt = Help.random(len, Help.RangeType.LOWER_NUMBER);
    var keyBits = CryptoJS.PBKDF2(pwd, salt, { keySize: size });
    return salt + keyBits.toString();
}

/**
 * decode the cryptograph
 * 
 * @pwd:password 
 * @cryptograph:salt+key
 * @len:the salt length
 * 
 * @return: boolean
 */
exports.decode = function (pwd, cryptograph, len, size) {
    len = len || LEN;
    size = size || SIZE;
    var salt = cryptograph.slice(0, len);
    var key = cryptograph.slice(len);
    var keyBits = CryptoJS.PBKDF2(pwd, salt, { keySize: size });
    return key == keyBits.toString();
}
