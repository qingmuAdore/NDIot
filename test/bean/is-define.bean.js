var isDefine = require('../../app/utils').IsDef;


var key = '13';
console.log(isDefine(key));


function def(value) {
   return typeof value != 'undefined' && typeof value != null;
};


console.log(def(value));