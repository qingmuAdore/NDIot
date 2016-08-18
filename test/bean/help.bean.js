var HELP = require('../../app/utils/help'),
  RangeType = HELP.RangeType;

/*********** random ***********/
console.log(HELP.random());
console.log(HELP.random(5));
console.log(HELP.random(5, RangeType.LOWER));
console.log(HELP.random(5, RangeType.UPPER));
console.log(HELP.random(5, RangeType.UPPER_NUMBER));
console.log(HELP.random(5, RangeType.CUSTOM, '*`@#$%^&*()'));


/********** hasValue *********/
var res = [];
console.log(HELP.hasValue(res));

res = [1];
console.log(HELP.hasValue(res));

res = {};
console.log(HELP.hasValue(res));

res = null;
console.log(HELP.hasValue(res));

console.log(HELP.uuid());

console.log(HELP.timestamp());

/********* parse ***********/
var jstr = '{"foo":"bar"}';
var json = HELP.parse(jstr);
console.log(json);
console.log(json.foo);


json = {
  info: 'info',
  person: {
    name: 'person',
    age: 23,
    work: 'soft engineer'
  },
  home: {
    address: 'addr',
    size: '89'
  }
};
console.log(json);
jstr = JSON.stringify(json);
console.log(jstr);

jstr = '"{"info":"info","person":{"name":"person","age":23,"work":"soft engineer"},"home":{"address":"addr","size":"89"}}"';

json = HELP.parse(jstr);
console.log(json);
console.log(json.info);
console.log(json.person.name);
