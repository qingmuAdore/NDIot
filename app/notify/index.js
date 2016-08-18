var client = require('./lib/client');
var Router = require('./lib/router.js');

module.exports = function(){
    return new Router(client);
}
