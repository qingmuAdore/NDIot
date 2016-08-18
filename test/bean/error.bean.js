var DBError = require('../../app/error/db');
var MG = require('mongoose').Error;
var codeKV = {code:100,result:'result'};

var dbError = new DBError(codeKV);
console.log(dbError.message);
console.log(dbError.code);
console.log(dbError.result);

var invalidErr = new DBError(new MG('mongoose error'));
console.log(invalidErr.message);
console.log(invalidErr.code);
console.log(invalidErr.result);

var invalidErr = new DBError(new Error('mongoose error'));
console.log(invalidErr.message);
console.log(invalidErr.code);
console.log(invalidErr.result);

var invalidErr = new DBError();
console.log(invalidErr.message);
console.log(invalidErr.code);
console.log(invalidErr.result);