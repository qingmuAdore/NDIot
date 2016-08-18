var mqtt = require('mqtt'),
  options = require('../../config').mqtt;

var client = mqtt.connect(options);
var root = 'cmpp/';

var packet = {
  name: 'camera',
  fid: 'fid',
  info: 'info'
};

  
client.subscribe(options.topic);

client.on('connect', function() {
  console.log('connect');
});

client.on('message', function(topic, message, packet) {
  // message is Buffer
  console.log('topic:' + topic);
  console.log('message:' + message);
  console.log('packet:' + packet);
  message = message || {};
  try {
    message = JSON.parse(message);
  } catch (error) {

  }
  if (message.name && message.fid) {
    topic = root + message.name + '/' + message.fid;
    console.log('publish:' + topic);
    client.publish(topic, message.info);
  }
});

client.on('reconnect', function() {
  console.log('reconnect');
})

client.on('close', function() {
  console.log('close');
});

client.on('error', function(err) {
  console.log(err);
});

client.on('offline', function() {
  console.log('offline');
});
