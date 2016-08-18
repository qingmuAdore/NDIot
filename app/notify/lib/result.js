var ECmpp     = require('../../error');
var ResultRsp = require('../../net').ResultRsp;

var parseErrorInfo = ECmpp.Parse;

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
 * 
 *@api the subscribe topic
 *@topic mqtt publish topic
 *@err database operate err
 *@res database operate res
 */
module.exports = function(client, api, topic, err, ret, tag) {
    ret = ret || {};
    var errInfo = parseErrorInfo(err);
    
    // if ret is Mongoose Document use ret._doc else use ret
    var doc = ret._doc == null ? ret : ret._doc;
    //ret is array you need to deal 
    if (doc instanceof Array) {
        doc = [];   //{ data: [] };
        ret.forEach(function (v) {
            doc.push(v._doc);
        });
    }
    
    tag = tag || DEFAULTF_NODE_NAME;
    if (typeof tag != 'string') {
        tag = DEFAULTF_NODE_NAME;
    }
    doc = kv(tag, doc);
    
    //console.log(client);
    var response = new ResultRsp(api, errInfo, doc);
    client.publish(topic, JSON.stringify(response));
}
