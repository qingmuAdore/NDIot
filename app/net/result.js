var utils = require('../utils/'),
    Obj = utils.Obj;

/**
 * ResultRsp
 * 
 * @api
 * @codeKV 
 * @doc 
 */
var ResultRsp = function(api, codeKV, doc) {
    if (api == null) {
        throw 'ResultRsp: Incomplete parameter';
    }
    
    if (typeof api != 'string') {
        throw 'ResultRsp: api type is string';
    }
    
    if ('object' === typeof codeKV) {
        this.result = codeKV.result;
        this.code   = codeKV.code;
    }
    
    // url
    this.api = api || '/';
    
    // code
    this.code =  this.code || -1;
    
    // describe the code's meaning
    this.result = this.result || '';
    
    Obj.merge(this, doc);
}

module.exports = ResultRsp;
