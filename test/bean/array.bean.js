var res = [];
console.log(res instanceof Array);

res = [1, 2];
console.log(res instanceof Array);

var str = res.toString();
console.log(str instanceof Array);

res = {};
console.log(res instanceof Array);

res = { info: 'inf', max: 'max' };
console.log(res instanceof Array);

res = [1];
function v(res) {
    console.log(res instanceof Array);
}
v(res);

var arr = [];
for (var i = 0; i < 5; i++) {
    var doc = {
        _doc: {
            num: i,
            info: 'info' + i
        },
        _fun: function () { },
        _save: function () { },
    }
    arr.push(doc);
}

var arr_n = [];
arr.forEach(function (element) {
    arr_n.push(element._doc);
});
console.log(arr);
console.log(arr_n);


var a = new Array('ab', 'bc', 'de', 'fe', 'gs');
console.log(a.indexOf('ab'));
console.log(a.indexOf('fe'));
console.log(a.indexOf('hee'));

// var b = a.slice(2,3);
// console.log(b);
// console.log(a);

// a.every(function(value,index,array){
//    console.log(value);
//    console.log(index);
//    console.log(array); 
// });

// a.filter(function(value,index,array){
//    console.log(value);
//    console.log(index);
//    console.log(array); 
// });

// a.map(function(value,index,array){
//    console.log(value);
//    console.log(index);
//    console.log(array); 
// });

// a.reduce(function(pv,cv,ci,array){
//     console.log(pv);
//     console.log(cv);
//     console.log(ci);
//     console.log(array);
// });

// a.reverse();
// console.log(a);

//remove the first item
// var b = a.shift();
// console.log(a);
// console.log(b);

// a.some(function(value,index,array){
//    console.log(value);
//    console.log(index);
//    console.log(array); 
// });

console.log(a);
var c = a.splice(2,1);
console.log(c);
console.log(a);
console.log(a.length);

// var str = new String('dddddddddsssssssssss');
// str.spl
