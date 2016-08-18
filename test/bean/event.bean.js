var Event = require('../../app/event/event.js');
var event = new Event();

var kE = 'eKey'

event.register(kE,function(args){
    console.log(args);
});

event.done(kE,'hello');

/**
 * event set
 */
var msgId = event.set(kE);
console.log(msgId);
console.log(event.get(msgId));