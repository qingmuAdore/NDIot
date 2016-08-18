var Utils = require('../../app/utils');
var Crypto = Utils.Crypto;

// var CryptoJS = require("crypto-js");


// /**
//  * 数据库保存 salt +　key
//  */

// // // Encrypt 
// // var ciphertext = CryptoJS.AES.encrypt('my message', 'secret key 123');

// // console.log(ciphertext.toString()); 

// // // Decrypt 
// // var bytes  = CryptoJS.AES.decrypt(ciphertext.toString(), 'secret key 123');
// // var plaintext = bytes.toString(CryptoJS.enc.Utf8);

// // console.log(plaintext);

// var salt = CryptoJS.lib.WordArray.random(128/8); 

// var key128Bits = CryptoJS.PBKDF2("Secret Passphrase", salt, { keySize: 128/32 }); 
// var ckey128Bits = CryptoJS.PBKDF2("Secret Passphrase", salt, { keySize: 128/32 }); 

// // var key256Bits = CryptoJS.PBKDF2("Secret Passphrase", salt, { keySize: 256/32 }); 
// // var key512Bits = CryptoJS.PBKDF2("Secret Passphrase", salt, { keySize: 512/32 }); 
// // var key512Bits1000Iterations = CryptoJS.PBKDF2("Secret Passphrase", salt, { keySize: 512/32, iterations: 1000 });


// console.log(key128Bits.toString());
// console.log(ckey128Bits.toString());


/********* test  ***********/
// var password = "pzhang-password12";
// var cryptograph = Crypto.encode(password);
// console.log(cryptograph);
// var flg = Crypto.decode(password, cryptograph);
// console.log(flg);


// var pwd = '19891989';
// var encrypt = 'ql18ai9k9c3cdef2ac1272be7fa403064b932b8e';
// var flg = Crypto.decode(pwd, encrypt);
// console.log(flg);


