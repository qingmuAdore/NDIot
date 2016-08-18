/**
 * the mqtt client
 * 
 */
var mqtt      = require('mqtt');
var options   = require('../../../config').mqtt;

var TAG = "MQTT Client";
    
// client connection
var client = mqtt.connect(options);

client.on('reconnect', function() {
    console.log(TAG + ' reconnect');
})

client.on('close', function() {
    console.log(TAG + ' close');
});

client.on('error', function(err) {
    console.log(TAG + ' error');
    console.log(err);
});

client.on('offline', function() {
    console.log(TAG + ' offline');
});

client.on('connect', function() {
    console.log(TAG + ' connect');
});

module.exports = client;
