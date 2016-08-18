var should = require('should'),
    User = require('../../app/model/user.js'),
    Device = require('../../app/model/device'),
    DB = require('../../app/db/db');
var ECmpp = require('../../app/error'),
    DBError = ECmpp.DB,
    CODE = ECmpp.CODE;

var id = 'deviceUUID';
var key = 'deviceKey';
var name = 'deviceName';
var token = '';
var attributes = {
    manufacturer: 'Anon',
    type: 'IOT Device',
    uid: 'device_factory_id',
    serial_number: '10293847562912',
    lat: 135.3,
    lng: 32.5
};
//user
var openId = 'openId', userToken = 'userToken';



DB.openDB(function() {
    // Device.add(name, attributes, function(err, res) {
    //     console.log(err);
    //     console.log(res);
    // });
    // User.updateAndCreate(openId, userToken, function(err, res) {
    //     console.log(err);
    //     console.log(res);
    // });
    
    Device.info(openId,userToken,id,function(err,res){
       console.log(err); 
    });
});