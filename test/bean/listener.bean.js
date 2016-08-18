var listener = require('../../app/utils/listener.js');
var L = new listener(10);

function done(){
  console.log('task is finished');
}

for(var i=0;i<100;i++){
  console.log(i);
  L.run(done);
}