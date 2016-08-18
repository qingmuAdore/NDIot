//赋值
//基本数据类型 不变
var num = 10;
var num_c = num;
num = 13;
console.log(num + ' ' + num_c);
var str = 'hell';
var str_c = str;
str = 'hell_change';
console.log(str + ' ' + str_c);

//数组 --> 同步修改,指向同一块内存
var arr = [1, 3, 4, 6];
var arr_c = arr;
arr[0] = 5;
console.log(arr + ' ' + arr_c);

//Object --> 同步修改,指向同一块内存
var obj = {
    info: 'info',
    ag: 'ag'
};
var obj_c = obj;
obj.info = 'change_info';
obj.ne = 'ne';
console.log(obj);
console.log(obj_c);


//理解 -->操作指向新的内存,即指针的指向更换
obj_c = { h: 'h', c: 'c' };
console.log(obj_c);
console.log(obj);
//multiple example
var o = {
    info: 'info',
    ag: 'ag'
};
var o1 = {
    info: 'info1',
    ag: 'ag1'
};
var on = o;
on = o1;
console.log(o == on);//false
console.log(o1 == on); //true
o.cb = 'cb';
console.log(on);
