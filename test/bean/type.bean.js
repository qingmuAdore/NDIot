/** typeof */
console.log(typeof 13);
console.log(typeof true);
console.log(typeof 'string');
console.log(typeof function(){});
console.log(typeof {});
console.log(typeof null);
console.log(typeof []);
console.log(typeof undefined);
/********result **********
number
boolean
string
function
object
object
object
*/
console.log('--------------------------------------------------');
/** instanceof */
console.log([] instanceof Array);

var record = {
    reported: { color: 'red', temperature: 13.5 },
    seq: 12345,
    timestamp: 10000,
};

console.log(record instanceof Array);

if(!(record instanceof Array)){
    console.log('record not array');
}
