var Utils = require('../../app/utils'),
    Obj = Utils.Obj;


var a = { info: 'info', help: 'help' };
var b = { info: 'info_other', word: 'word' };

console.log(Obj.merge(a, b));

b = 'cood';
console.log(Obj.merge(a, b));