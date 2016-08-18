var UtilsHelp = require('../../app/utils'),
    Obj = UtilsHelp.Obj;

var o1 = {
    help:'help',
    person:{
        name:'pauly',
        age:10,
        work:'soft engineer',
    }
};

var o2 = {
    info:'info'
}


var o = Obj.merge(o1,o2);
console.log(o);
