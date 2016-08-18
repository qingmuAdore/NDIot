var util = require('util');

var Animal = function(name){
    this.name = name;
}
Animal.prototype.showName = function(){
    console.log(this.name);
}

var Cat = function(name,age){
    Animal.call(this,name,this.constructor);
    this.age = age;
}
util.inherits(Cat,Animal);
Cat.prototype.showAge = function(){
    console.log(this.age);
}

var cat = new Cat('cat',14);
cat.showAge();
cat.showName();
