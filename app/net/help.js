var ResultRsp = require('./result');
var Ecmpp = require('../error'),
    parse = Ecmpp.Parse;

/**
 * default node name
 */
var DEFAULTF_NODE_NAME = 'data';

var kv = function (key, value) {
    var o = {};
    o[key] = value || {};
    return o;
}

/**
 * @ret db result
 * @tag the node name (ret is the node content) 
 */
module.exports = function (req, res, err, ret, tag) {
    ret = ret || {};
    
    var api = req.baseUrl + req.path;
    var errInfo = parse(err);
    
    // if ret is Mongoose Document use ret._doc else use ret
    var doc = (ret._doc == null) ? ret : ret._doc;
    // ret is array you need to deal 
    if (doc instanceof Array) {
        doc = [];   // { data: [] };
        ret.forEach(function (v) {
            doc.push(v._doc);
        });
    }
    
    tag = tag || DEFAULTF_NODE_NAME;
    if (typeof tag != 'string') {
        tag = DEFAULTF_NODE_NAME;
    }
    
    doc = kv(tag, doc);
    res.send(new ResultRsp(api, errInfo, doc));
}

