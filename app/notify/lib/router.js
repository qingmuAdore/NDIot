/**
 * mqtt router
 */
var mqttRouter = require('mqtt-router');
var Collection = require('./collection.js');

var Router = function(client) {
  this._client = client;
  this._router = mqttRouter.wrap(client);
}

/**
 * the entry
 */
Router.prototype.use = function(collection) {
    if (collection instanceof Collection) {
        collection._client = this._client;
      
        var _cfs = collection.cfs();
        var topic    = null;
        var opts     = null;
        var handler  = null;
        var client   = this._client;
        for (var t in _cfs) {
            topic   = t;
            opts    = _cfs[t].opts;
            handler = _cfs[t].handler;
            this._router.subscribe(topic, opts, function(topic, message) {
                handler(client, topic, message);
            });
        } 
    }
}

Router.prototype.close = function() {
    this._client.end();
}

Router.prototype.client = function() {
    return this._client;
}

module.exports = Router;
