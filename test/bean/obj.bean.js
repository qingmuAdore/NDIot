// var obj ={
//     info:'info',
//     lg:'lg'
// };

// delete obj.lg;
// console.log(obj)


// var arr = [];
// for(var i=0;i<4;i++){
//     var doc = {
//         age:10+i,
//         info:'info',
//         lg:'lg'
//     };
//     arr.push(doc);
// }

// arr.forEach(function(elmemt){
//     delete elmemt.info
//     console.log(elmemt)
// })
// console.log(arr)

// var Obj = require('../../app/utils/obj');

// var obj = null;
// obj = obj || {};
// obj.info = obj.info || {};
// obj.info.value = obj.info.value || {};
// obj.info.value = Obj.combine(obj.info.value, { name: 'pauly' });

// console.log(obj);

/*** 注意引用 */
// var record = {
//     reported: { color: 'red', temperature: 13.5 },
//     seq: 12345,
//     timestamp: 10000,
// };

// var records = [];

// //发现 record的值修改,其他的也修改,说明push的对象仍然是引用
// for (var i = 0; i < 3; i++) {
//     record.timestamp = 100 + i;
//     records.push(record);
// }
// /**
//  * records中 所以元素的timestamp一样都是102
//  */

exports.RangeType = RangeType = {
    DEFAULT: 0,
    UPPER: 1,
    LOWER: 2,
    NUMBER: 3,
    UPPER_NUMBER: 4,
    LOWER_NUMBER: 5,
    UPPER_LOWER_NUMBER: 6,
    CUSTOM: 7,
}

var sw = function(type){
    switch (key) {
        case value:
            
            break;
    
        default:
            break;
    }
}
