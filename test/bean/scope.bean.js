var a = 1;
function show() {
    console.log(a);
    var a = 2;
}
//undefined
show();


var g;
function fun() {
    g = 'global';
}
fun();
//undefined
console.log(g);

name = 'The global';

var object = {
    name: 'my object',
    getName: function() {
        return function() {
            console.log(this.name);
        }
    },
    showName: function() {
        console.log(this.name);
    },
    selfShow:function(){
        this.getName()();
    }
}

function showName() {
    console.log(this.name);
}
showName();
object.getName()();
object.showName();
object.selfShow();