var ResultRsp = require('../../app/net/result');
var ECmpp = require('../../app/error'),
  CODE = ECmpp.CODE;

var api = "/http/url";
var codeKV = CODE.DBOperateWrong;
var res = {
  openId: 'openId',
  info: 'info'
};
var msg_id = "msg___I";

var msg = {
  api: api,
  msg_id: msg_id
}

rsp = new ResultRsp(msg, codeKV, res);
console.log(rsp);

var Person = function() {
  this._name = 'name';
  this._love = 'love';
  this.vf = function() {
    console.log(this._name);
  }
}

Person.prototype.show = function() {
  console.log(this._love + ' ' + this._name);
}


rsp  = new ResultRsp(msg,codeKV,Person);
console.log(rsp);

var person = new Person();
rsp  = new ResultRsp(msg,codeKV,person);
console.log(rsp);