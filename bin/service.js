var database = require('../app/db/db');
var notify   = require('../app/notify');
var device   = require('../app/notify/router/device.js');

var mqttRouter = notify();

exports.run = function () {
    database.openDB();
    mqttRouter.use(device);
}

exports.stop = function () {
    database.closeDB();
    mqttRouter.close();
}

exports.mqttRouter = mqttRouter;
exports.mqttClient = mqttRouter.client();