var mqtt = require('mqtt')
  , mqttrouter = require('mqtt-router');
 
var settings = {
  reconnectPeriod: 5000
};
 
// client connection 
var client = mqtt.connect('mqtt://localhost', settings);
 
// enable the subscription router 
var router = mqttrouter.wrap(client);
 
// subscribe to messages for 'hello/me' 
router.subscribe('hello/me', function(topic, message){
  console.log('received', topic, message);
});
 
// subscribe to messages for 'hello/you' 
router.subscribe('hello/you', function(topic, message){
  console.log('received', topic, message);
});
 
// subscribe to messages for 'some/+/you' with a named param for that token 
router.subscribe('some/+:person/you', function(topic, message, params){
  console.log('received', topic, message);
});