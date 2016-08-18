var ECmpp = require('../../app/error'),
    CODE = ECmpp.CODE,
    DBError = ECmpp.DB;
var MongooseError = require('mongoose').Error;
var Parse = require('../../app/error/parse-code');

var codeKV = null;
codeKV = Parse();
console.log(codeKV == CODE.Success);

codeKV = Parse(CODE.AuthorityInexistence);
console.log(codeKV == CODE.AuthorityInexistence);

codeKV = Parse(new MongooseError());
console.log(codeKV == CODE.DBOperateWrong);

codeKV = Parse(new DBError(CODE.AuthorityExist));
console.log(codeKV == CODE.AuthorityExist);

codeKV = Parse(new Error());
console.log(codeKV == CODE.System);

codeKV = Parse(new DBError());
console.log(codeKV == CODE.Success);

codeKV = Parse(new DBError('unknown'));
console.log(codeKV == CODE.Unknow);