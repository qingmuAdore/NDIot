/**
 * the collection of subscribe param
 * 
 */
var Collection = function() {
    this._subs = [];
}

/**
 * subscribe topic 
 */
Collection.prototype.sub = function(topic, opts, handler) {
    // .subscribe('topic', handler)
    if ('function' === typeof opts) {
        handler = opts;
        opts = null;
    }
    this._subs[topic] = { opts: opts, handler: handler };
}

/**
 * get the collection 
 */
Collection.prototype.cfs = function() {
    return this._subs;
}

/**
 * parse json string to json Object
 */
Collection.prototype.parse = function(jstr) {
    var json = null;
    if (jstr != null && typeof jstr === 'object') {
        json = jstr;
    } else if(typeof jstr ==='string'){
        try {
            json = JSON.parse(jstr);
        } catch (error) {
            throw error;
        }
    }
    return json;
}

module.exports = Collection;