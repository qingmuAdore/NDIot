/*!
 * Module dependencies.
 */
var Code = require('./code.js');
var MongooseError = require('mongoose').Error;

/**
 * Database Error constructor.
 *
 * @param    {cokeKV} {code,result}
 *        or error
 * @inherits CommonError
 * @api private
 */
function DatabaseError(codeKVorError) {
    var codeKV = codeKVorError;
    if (codeKVorError instanceof DatabaseError) {
        codeKV = codeKVorError.codeKV;
        
    } else if (codeKVorError instanceof MongooseError) {
        codeKV = Code.DBOperateWrong;
        
    } else if (codeKVorError instanceof Error) {
        codeKV = Code.System;
    }
    
    Error.call(this);
    
    if (Error.captureStackTrace) {
        Error.captureStackTrace(this);
        
    } else {
        this.stack = new Error().stack;
    }
    
    if (codeKV == null) {
        codeKV = Code.Success;
        
    } else if (typeof(codeKV) != 'object' || codeKV.code == null) {
        codeKV = Code.Unknow;       
    }
    
    this.codeKV = codeKV;
    this.code   = codeKV.code || 0;
    this.result = codeKV.result || '';
    this.name   = 'DatabaseError';
    this.message = 'code: ' + this.code + ', result: ' + this.result;
}

/*!
 * Inherits from CommonError.
 */
DatabaseError.prototype = Object.create(Error.prototype);
DatabaseError.prototype.constructor = Error;

/*!
 * exports
 */
module.exports = DatabaseError;
