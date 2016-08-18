var Obj = require('../../app/utils').Obj;

/**
 * http method
 */
var METHOD = {
    GET: 'GET',
    POST: 'POST'
};

/**
 * req.method
 * 
 * @return param
 */
module.exports = function (req) {
    var param = null;
    if (req.method == METHOD.GET) {
        param = req.query;
    } else if (req.method == METHOD.POST) {
        param = Obj.merge(req.query, req.body);
    }
    return param;
}