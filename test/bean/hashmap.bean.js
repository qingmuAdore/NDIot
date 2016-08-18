var HashMap = require('../../app/utils/hashmap');
var map = new HashMap();

map.set("some_key", "some value");
console.log(map.get("some_key"));


map.remove('some_key');
console.log(map.get("some_key"));

