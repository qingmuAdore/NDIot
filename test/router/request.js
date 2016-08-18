var app = require('../../app'),
    request = require('supertest')(app),
    should = require('should'),
    Query = require('querystring');
var Ecmpp = require('../../app/error'),
    Code = Ecmpp.CODE;

var query = null;
/**
 * post
 * 
 * @path url
 * @content body
 * @codeKV  {code result}
 * @done (unit test hook function)
 * @cb callback
 */
exports.post = function(path, content, codeKV, done, cb) {
    done = done || function() { };
    cb = cb || function() { };
    request.post(path)
        .send(content)
        .expect(200, function(err, res) {
            should.not.exist(err);
            var rsp = JSON.parse(res.text);
            rsp.code.should.equal(codeKV.code);
            rsp.result.should.equal(codeKV.result);
            cb(err, rsp);
            done();
        });
}

/**
 * get
 * 
 * @path url
 * @content body
 * @codeKV  {code result}
 * @done (unit test hook function)
 * @cb callback
 */
exports.get = function(path, content, codeKV, done, cb) {
    done = done || function() { };
    cb = cb || function() { };
    query = '?' + Query.stringify(content);
    request.get(path + query)
        .expect(200, function(err, res) {
            should.not.exist(err);
            var rsp = JSON.parse(res.text);
            rsp.code.should.equal(codeKV.code);
            rsp.result.should.equal(codeKV.result);
            cb(err, rsp);
            done();
        });
}
