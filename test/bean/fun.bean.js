var Fun = function(){
  this._name = '';
};

Fun.prototype.show = function(){
  console.log(this._name);
}

Fun.prototype.set = function(name){
  this._name = name;
}

Fun.prototype.get = function(){
  return this._name;
}

var fun = new Fun();
fun.set('function name');

fun.__proto__.time = function(){
  console.log(new Date().getTime());
}

console.log(fun.get());
fun.time();

var ofun = new Fun();
ofun.time();
