var obj = {name:'pauly',age:10,work:'soft engineer'};

//遍历属性
for(var f in obj){
  console.log('key:'+f + ' value:' + obj[f]);
}

//动态修改
for(var f in obj){
  obj[f] = obj[f] + 1;  
}
console.log(obj);

//更新
var nObj = {name:'paulynew',sex:'boy',age:28,birthday:'19880905'};

var cObj = obj;

for(var f in nObj){
  cObj[f] = nObj[f];
}
console.log(cObj);
