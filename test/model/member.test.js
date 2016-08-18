var should = require('should'),
    Group = require('../../app/model/group.js'),
    User = require('../../app/model/user.js'),
    Role = require('../../app/model/role.js'),
    Member = require('../../app/model/member.js'),
    DB = require('../../app/db/db');
var ECmpp = require('../../app/error'),
    DBError = ECmpp.DB,
    CODE = ECmpp.CODE;
var assert = require('assert');
var mongoose = require('mongoose');
describe('Member Model', function () {
    // var openId = 'openId', token = 'token';
    var group_objectId = new mongoose.Types.ObjectId;
    var user_objectId = new mongoose.Types.ObjectId;
    var user_objectId1 = new mongoose.Types.ObjectId;
    var user_objectId2 = new mongoose.Types.ObjectId;

    before(function (done) {
        DB.openDB(function () {
            done();
        });
    });

    after(function () {
        Member.removeAll();
        User.removeAll();
        Group.removeAll()
        DB.closeDB();
    });


    var roleid

    it('# get role id', function (done) {
        Role.getDefault(function (err, res) {
            should.not.exist(err);
            console.log(res);
            roleid = res._id
            done();
        })
    })
    it('#add right', function (done) {

        Member.add(group_objectId, user_objectId, null,roleid, function (err, res) {
            should.not.exist(err);
            console.log(res);
            done();
        })

    })
    it('#add right', function (done) {

        Member.add(group_objectId, user_objectId1, null,roleid, function (err, res) {
            should.not.exist(err);
            console.log(res);
            done();
        })

    })

    it('#add right', function (done) {

        Member.add(group_objectId, user_objectId2, null,roleid, function (err, res) {
            should.not.exist(err);
            console.log(res);
            done();
        })

    })

    it('#add delete', function (done) {
        Member.delete(group_objectId, user_objectId, function (err, res) {
            should.not.exist(err);
            console.log(res);
            done();
        })

    })

  it('# delete all', function (done) {
        Member.removeWithId(group_objectId, function (err, res) {
            should.not.exist(err);
            console.log(res);
            done();
        })

    })
  

    describe('#test find all', function () {
        var open_id = 'open_id', token = 'token', group_id = 'groudId', device_id = 'deviceid';
        var other_open_id = 'other_open_id'



        it('#register user', function (done) {
            User.register('86', '13691818784', 'name', 'password', function (err, res) {
                should.not.exist(err);
                console.log('user : ');
                console.log(res)
                open_id = res.open_id
                token = res.token
                done();
            })
        })
        it('#register user', function (done) {
            User.register('86', '13691818785', 'name', 'password', function (err, res) {
                should.not.exist(err);
                console.log('user : ');
                console.log(res)
                other_open_id = res.open_id
                token = res.token
                done();
            })
        })
        it('#create with right openid', function (done) {
            Group.createGroup(open_id, 'name', 'description', function (err, res) {
                should.not.exist(err);
                group_id = res.id
                console.log('group_id : ' + group_id)
                done()
            })
        })

        it('#add member with right', function (done) {
            Group.addMember(group_id, open_id, other_open_id, 'nickname', roleid, function (err, res) {
                should.not.exist(err);
                console.log(res)
                done()
            })
        })

        it('#find all ', function (done) {
            Member.findAll(open_id, function (err, res) {
                should.not.exist(err);
                console.log(res);
                done();
            })
        })

    })
});
