var should = require('should'),
    Group = require('../../app/model/group.js'),
    User = require('../../app/model/user.js'),
    Role = require('../../app/model/role.js'),
    Device = require('../../app/model/device'),
    Grade = require('../../app/model/grade'),
    Role = require('../../app/model/role'),
    DB = require('../../app/db/db');
var ECmpp = require('../../app/error'),
    DBError = ECmpp.DB,
    CODE = ECmpp.CODE;
var assert = require('assert');


var name = 'deviceName';
var attributes = {
    manufacturer: 'Anon',
    tp: 'IOT Device', //type为关键字,改为tp
    uid: 'device_factory_id',
    serial_number: '10293847562912',
    lat: 135.3,
    lng: 32.5
};

describe('Grade Model', function () {
    var open_id = 'open_id', token = 'token', group_id = 'groudId', device_id = 'deviceid';
    var other_open_id = 'other_open_id'

    before(function (done) {
        DB.openDB(function () {
            done();
        });
    });

    after(function () {
        User.removeAll();
        Grade.removeAll();
        Role.removeAll();
        Group.removeAll();
        Device.removeAll();
        DB.closeDB();
    });

    it('#register user', function (done) {
        User.register('86', '13691818794', 'name', 'password', function (err, res) {
            should.not.exist(err);
            console.log('user : ');
            console.log(res)
            open_id = res.open_id
            token = res.token
            done();
        })
    })

    it('#register user', function (done) {
        User.register('86', '13691818795', 'name', 'password', function (err, res) {
            should.not.exist(err);
            console.log('user : ');
            console.log(res)
            other_open_id = res.open_id
            token = res.token
            done();
        })
    })
    //add
    it('#add device', function (done) {
        Device.add(name, attributes, function (err, res) {
            should.not.exist(err);
            device_id = res.id;
            console.log('device  : ');
            console.log(res)
            done();
        });
    });

    it('#create with wrong openid', function (done) {
        Group.createGroup('no', 'name', 'description', function (err, res) {
            should.exist(err);
            assert.equal(CODE.UserInexistence, err.codeKV);
            done()
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


    it('#add with wrong groud_id', function (done) {
        Group.addDevice('group_id', 'open_id', 'device_id', function (err, res) {
            assert.equal(CODE.GroupInexistence, err.codeKV);
            done()
        })
    })
    describe('#add with right groud_id', function () {
        it('#add with wrong open_id', function (done) {
            console.log('group_id : ' + group_id)
            console.log('device_id : ' + device_id)
            Group.addDevice(group_id, 'open_id', device_id, function (err, res) {
                assert.equal(CODE.NotGroupAdmin, err.codeKV);
                done()
            })
        })
        it('#add with right open_id & wrong device_id', function (done) {
            Group.addDevice(group_id, open_id, 'device_id', function (err, res) {
                assert.equal(CODE.DeviceInexistence, err.codeKV);
                done()
            })
        })

        it('#add with right', function (done) {
            Group.addDevice(group_id, open_id, device_id, function (err, res) {
                should.not.exist(err);
                console.log(res)
                done()
            })
        })
    });

    describe('#delete device', function () {
        it('#with wrong groud_id', function (done) {
            Group.deleteDevice('group_id', 'open_id', 'device_id', function (err, res) {
                assert.equal(CODE.GroupInexistence, err.codeKV);
                done()
            })
        })
        it('#with right groud_id & wrong open_id', function (done) {
            Group.deleteDevice(group_id, 'open_id', device_id, function (err, res) {
                assert.equal(CODE.NotGroupAdmin, err.codeKV);
                done()
            })
        })
        it('#with right groud_id & right open_id & wrong device_id', function (done) {
            Group.deleteDevice(group_id, open_id, 'device_id', function (err, res) {
                assert.equal(CODE.DeviceInexistence, err.codeKV);
                done()
            })
        })
        var device_id1;
        it('#register device', function (done) {
            Device.add(name, attributes, function (err, res) {
                should.not.exist(err);
                device_id1 = res.id;
                // console.log('device  : ');
                // console.log(res)
                done();
            });
        });
        it('#with not groud device', function (done) {
            Group.deleteDevice(group_id, open_id, device_id1, function (err, res) {
                assert.equal(CODE.NotGroupDevice, err.codeKV);
                done()
            })
        })
        it('#with right', function (done) {
            console.log('device_id : ' + device_id)
            Group.deleteDevice(group_id, open_id, device_id, function (err, res) {
                should.not.exist(err);
                console.log(res)
                done()
            })
        })
    })

    describe('#delete device', function () {
        var group_id1

        it('#create with right openid', function (done) {
            Group.createGroup(open_id, 'name', 'description', function (err, res) {
                should.not.exist(err);
                group_id1 = res.id
                console.log('group_id : ' + group_id)
                done()
            })
        })


        it('#right ', function (done) {
            Group.deleteGroup(group_id1, open_id, function (err, res) {
                should.not.exist(err);
                console.log(res)
                done()
            })
        })
    })


    describe('#test add member', function () {
        var roleid

        it('# get role id', function (done) {
            Role.getDefault(function (err, res) {
                should.not.exist(err);
                console.log(res);
                roleid = res._id
                done();
            })
        })

        it('# with wrong member_open_id', function (done) {
            Group.addMember(group_id, open_id, 'member_open_id', 'nickname', roleid, function (err, res) {
                assert.equal(CODE.UserInexistence, err.codeKV);
                done()
            })
        })

        it('#with right', function (done) {
            Group.addMember(group_id, open_id, other_open_id, 'nickname', roleid, function (err, res) {
                should.not.exist(err);
                console.log(res)
                done()
            })
        })

        it('#with delete member', function (done) {
            Group.deleteMember(group_id, open_id, other_open_id, function (err, res) {
                should.not.exist(err);
                console.log(res)
                done()
            })
        })
    })
    describe('#test changeAdmin', function () {
        it('#with wrong other_open_id', function (done) {
            Group.changeAdmin(group_id, open_id, 'wrong_open_id', function (err, res) {
                assert.equal(CODE.UserInexistence, err.codeKV);
                done()
            })
        })
        it('#with right ', function (done) {
            Group.changeAdmin(group_id, open_id, other_open_id, function (err, res) {
                should.not.exist(err);
                console.log(res)
                done()
            })
        })
    })




    it('#create with right openid', function (done) {
        Group.createGroup(open_id, 'name', 'description', function (err, res) {
            // assert.equal(CODE.GroupCreateLimit, err.codeKV);
            done()
        })
    })

    it('#list user groups ', function (done) {
        Group.getGroups(open_id, function (err, res) {
            should.not.exist(err);
            console.log(res)
            done()
        })
    })

    it('#list user groups  with unexist openid', function (done) {
        Group.getGroups('open_id1', function (err, res) {
            console.log(err);
            assert.equal(CODE.GroupInexistence, err.codeKV);
            done()
        })
    })
    //   it('#create with right openid', function (done) {
    //         Group.createGroup(open_id, 'name', 'description', function (err, res) {
    //             assert.equal(CODE.GroupCreateLimit, err.codeKV);
    //             done()
    //         })
    //     })
    //       it('#create with right openid', function (done) {
    //         Group.createGroup(open_id, 'name', 'description', function (err, res) {
    //             assert.equal(CODE.GroupCreateLimit, err.codeKV);
    //             done()
    //         })
    //     })
});
