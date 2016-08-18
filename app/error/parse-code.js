var Code = require('./code.js');
var DatabaseError = require('./db.js');
var MongooseError = require('mongoose').Error;

module.exports = function(codeKVorError) {
    var codeKV = codeKVorError;
    if (codeKV == null) {
        codeKV = Code.Success;
        
    } else if (codeKVorError instanceof DatabaseError) {
        codeKV = codeKVorError.codeKV;
        
    } else if (codeKVorError instanceof MongooseError) {
        codeKV = Code.DBOperateWrong;
        
    } else if (codeKVorError instanceof Error) {
        codeKV = Code.System;
        
    } else if (typeof codeKVorError != 'object' || codeKVorError.code == null) {
        codeKV = Code.Unknow;
    }
    return codeKV;
}

