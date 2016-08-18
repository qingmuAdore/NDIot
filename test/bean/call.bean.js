//继承
function inheritPrototype(sub, sup) {
    var F = function() { };
    F.prototype = sup.prototype;
    var f = new F();
    //为创建的副本添加 constructor属性, 弥补因重写原型而失去的默认constructor属性(默认-->Object)
    f.constructor = sub;
    sub.prototype = f;
}

function Animal(name) {
    this.name = name;
}
Animal.prototype.showName = function() {
    console.log(this.name);
}

var animal = new Animal('animal');
animal.showName();

/********************Cat ************************/
function Cat(name, age) {
    Animal.call(this, name);
    this.age = age;
}
//重写prototype --> 原型链继承
inheritPrototype(Cat, Animal);
Cat.prototype.showAge = function() {
    console.log(this.age);
}
var cat = new Cat('cat', 5);
cat.showName();
cat.showAge();


/*********************** CartonCat ********************/
function CartonCat(name, age, carton) {
    Cat.call(this, name, age);
    this.carton = carton;
}
inheritPrototype(CartonCat, Cat);
CartonCat.prototype.showCarton = function() {
    console.log(this.carton);
}
var carton = new CartonCat('carton',13,'carton is screen');
carton.showName();
carton.showAge();
carton.showCarton();