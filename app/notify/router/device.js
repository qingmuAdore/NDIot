var Collection  = require('../lib/collection');
var sendResult  = require('../lib/result');
var utils       = require('../../utils');
var deviceData  = require('../../model/device-data');

var collection  = new Collection();
var utilsHelp   = utils.HELP;

function device_process_data(client, api, message) {
    var req         = utilsHelp.parse(message.toString()); // parse JSON
    var device_id   = req.device_id;
    var device_key  = req.device_key;
    var state       = req.state || {};
    var version     = req.version;
    var topic       = '/device/' + device_id;
    
    console.log('device_process_data', api, message);
    
    deviceData.adds(device_id, device_key, state, version, function (err, ret) {
        sendResult(client, api, topic, err, ret);
    });
}

collection.sub('/device/data', device_process_data);

module.exports = collection;
