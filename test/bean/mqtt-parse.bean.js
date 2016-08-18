var Parse = require('../../app/event/mqtt/parse.js');
var json = {
    msg_id: 'uuid',
    openId: '用户id',
    access_token: '令牌（用户登录获取）',
    uid: '设备唯一id（设备出厂时定义）'
};

var msg = '{"msg_id":18,"CityName":"西安","ProvinceId":27,"CityOrder":1}';

var p = new Parse();
p.parse(msg);

console.log(p.msgId());
console.log(p.rsp());

