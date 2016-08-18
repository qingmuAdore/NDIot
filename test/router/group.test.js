var should = require('should'),
    DB = require('../../app/db/db'),
    REQUEST = require('./request'),
    User = require('../../app/model/user'),
    Device = require('../../app/model/device'),
    Member = require('../../app/model/member'),
    Grade = require('../../app/model/grade'),
    Role = require('../../app/model/role'),
    Group = require('../../app/model/group');
var Ecmpp = require('../../app/error'),
    CODE = Ecmpp.CODE;

var name = 'deviceName';
var device_id = 'deviceid'
var attributes = {
    manufacturer: 'Anon',
    tp: 'IOT Device', //type为关键字,改为tp
    uid: 'device_factory_id',
    serial_number: '10293847562912',
    lat: 135.3,
    lng: 32.5
};

describe('groud router', function () {
    var token = null;
    var content = null;
    var open_id = null;
    var group_id = null;
    var member_id = null;
    var member_id1 = null;

    before(function (done) {
        DB.openDB(function (err) {
            done();
        });
    });

    after(function () {
        User.removeAll();
        Group.removeAll();
        Grade.removeAll();
        Role.removeAll();
        Member.removeAll();
        Device.removeAll();
        DB.closeDB();
    });

    //register
    it('#user register', function (done) {
        content = {
            zone: '86',
            phone: '13825002527',
            username: 'pzhang',
            password: 'password',
            verify_code: 'code',
        };
        REQUEST.post('/user/register', content, CODE.Success, done);
    });


    it('#login ', function (done) {
        content = {
            zone: '86',
            phone: '13825002527',
            password: 'password',
        };
        REQUEST.post('/user/login', content, CODE.Success, done, function (err, res) {
            open_id = res.data.open_id;
            token = res.data.token;
        });
    });


    it('#with right info1', function (done) {
        content = {
            open_id: open_id,
            token: token,
            name: 'code',
            description: 'description'
        };
        REQUEST.post('/group/create', content, CODE.Success, done, function (err, res) {
            console.log(res)
        });
    })

    it('#with right info2', function (done) {
        content = {
            open_id: open_id,
            token: token,
            name: 'code',
            description: 'description'
        };
        REQUEST.post('/group/create', content, CODE.Success, done, function (err, res) {
            console.log(res)
        });
    })
    it('#with right info3', function (done) {
        content = {
            open_id: open_id,
            token: token,
            name: 'code',
            description: 'description'
        };
        REQUEST.post('/group/create', content, CODE.GroupCreateLimit, done, function (err, res) {
            console.log(res)
        });
    })

    it('#with wrong open_id', function (done) {
        content = {
            open_id: 'open_id',
            token: token,
            name: 'code',
            description: 'description'
        };
        REQUEST.post('/group/create', content, CODE.UserInexistence, done, function (err, res) {
            console.log(res)
        });
    })

    it('#with wrong token', function (done) {
        content = {
            open_id: open_id,
            token: 'token',
            name: 'code',
            description: 'description'
        };
        REQUEST.post('/group/create', content, CODE.TokenInvalid, done, function (err, res) {
            console.log(res)
        });
    })



    it('#list ', function (done) {
        content = {
            open_id: open_id,
            token: token
        };
        REQUEST.post('/group/list', content, CODE.Success, done, function (err, res) {
            //console.log('open_id : ' + res.data[0].group_id.open_id)
            //group_id = res.data[0].group_id.id
            console.log(res);
            group_id = res.data[0].id;
            //console.log('groud_id : ' + group_id)
            //console.log(res)
        });
    })

    //register
    it('#user register', function (done) {
        content = {
            zone: '86',
            phone: '13825002528',
            username: 'pzhang',
            password: 'password',
            verify_code: 'code',
        };
        REQUEST.post('/user/register', content, CODE.Success, done);
    });


    it('#login another account', function (done) {
        content = {
            zone: '86',
            phone: '13825002528',
            password: 'password',
        };
        REQUEST.post('/user/login', content, CODE.Success, done, function (err, res) {

            member_id = res.data.open_id;
            console.log('member_id : ' + member_id)
            // token = res.token;
        });
    });

    it('#add member wrong', function (done) {
        content = {
            open_id: open_id,
            token: token,
            group_id: group_id,
            member_id: 'member_id',
            nickname: 'nickname'
        };
        REQUEST.post('/group/add/user', content, CODE.UserInexistence, done, function (err, res) {
            console.log(res)
        });
    })

    it('#add member right', function (done) {
        content = {
            open_id: open_id,
            token: token,
            group_id: group_id,
            member_id: member_id,
            nickname: 'nickname'
        };
        console.log('member_id : ' + member_id)
        REQUEST.post('/group/add/user', content, CODE.Success, done, function (err, res) {
            console.log(res)
        });
    })


    // register
    it('#user register', function (done) {
        content = {
            zone: '86',
            phone: '13825002521',
            username: 'pzhang',
            password: 'password',
            verify_code: 'code',
        };
        REQUEST.post('/user/register', content, CODE.Success, done);
    });


    it('#login other account', function (done) {
        content = {
            zone: '86',
            phone: '13825002521',
            password: 'password',
        };
        REQUEST.post('/user/login', content, CODE.Success, done, function (err, res) {

            member_id1 = res.data.open_id;
            console.log('member_id : ' + member_id)
            // token = res.token;
        });
    });

    it('#add member right', function (done) {
        content = {
            open_id: open_id,
            token: token,
            group_id: group_id,
            member_id: member_id1,
            nickname: 'nickname'
        };
        console.log('member_id1 : ' + member_id1)
        REQUEST.post('/group/add/user', content, CODE.Success, done, function (err, res) {
            console.log(res)
        });
    })

    it('#delete user wrong memberid', function (done) {
        content = {
            open_id: open_id,
            token: token,
            group_id: group_id,
            member_id: 'member_id'
        };
        REQUEST.post('/group/delete/user', content, CODE.UserInexistence, done, function (err, res) {
            console.log(res)
        });
    })

    it('#delete user right', function (done) {
        content = {
            open_id: open_id,
            token: token,
            group_id: group_id,
            member_id: member_id1
        };
        REQUEST.post('/group/delete/user', content, CODE.Success, done, function (err, res) {
            console.log(res)
        });
    })

    it('#delete user with group_open_id', function (done) {
        content = {
            open_id: open_id,
            token: token,
            group_id: group_id,
            member_id: open_id
        };
        REQUEST.post('/group/delete/user', content, CODE.IllegalOperation, done, function (err, res) {
            console.log(res)
        });
    })

    // add device
    it('#add device', function (done) {
        Device.add(name, attributes, function (err, res) {
            should.not.exist(err);
            device_id = res.id;
            console.log('device  : ');
            console.log(res)
            done();
        });
    });

    it('#add device wrong group_id', function (done) {
        content = {
            open_id: open_id,
            token: token,
            group_id: 'group_id',
            device_id: 'device_id'
        };
        // console.log('open_id : ' + open_id)
        // console.log('group_id : ' + group_id)
        REQUEST.post('/group/add/device', content, CODE.GroupInexistence, done, function (err, res) {
            console.log(res)
        });
    })

    it('#add device wrong device_id', function (done) {
        content = {
            open_id: open_id,
            token: token,
            group_id: group_id,
            device_id: 'device_id'
        };
        // console.log('open_id : ' + open_id)
        // console.log('group_id : ' + group_id)
        REQUEST.post('/group/add/device', content, CODE.DeviceInexistence, done, function (err, res) {
            console.log(res)
        });
    })

    it('#add device right', function (done) {
        content = {
            open_id: open_id,
            token: token,
            group_id: group_id,
            device_id: device_id
        };
        // console.log('open_id : ' + open_id)
        // console.log('group_id : ' + group_id)
        REQUEST.post('/group/add/device', content, CODE.Success, done, function (err, res) {
            console.log(res)
        });
    })

    it('#get group info with right', function (done) {
        content = {
            open_id: open_id,
            token: token,
            group_id: group_id
        };
        REQUEST.post('/group/info', content, CODE.Success, done, function (err, res) {
            console.log(res)
        });
    })

    it('#get group info with wrong group_id', function (done) {
        content = {
            open_id: open_id,
            token: token,
            group_id: 'group_id'
        };
        REQUEST.post('/group/info', content, CODE.GroupInexistence, done, function (err, res) {
            console.log(res)
        });
    });

    it('#get group members with right', function (done) {
        content = {
            open_id: open_id,
            token: token,
            group_id: group_id
        };
        REQUEST.post('/group/members', content, CODE.Success, done, function (err, res) {
            console.log(res.data[0].user_id)
            console.log(res)
        });
    })

    it('#delete device wrong group_id', function (done) {
        content = {
            open_id: open_id,
            token: token,
            group_id: 'group_id',
            device_id: 'device_id'
        };
        // console.log('open_id : ' + open_id)
        // console.log('group_id : ' + group_id)
        REQUEST.post('/group/delete/device', content, CODE.GroupInexistence, done, function (err, res) {
            console.log(res)
        });
    })

    it('#delete device wrong device_id', function (done) {
        content = {
            open_id: open_id,
            token: token,
            group_id: group_id,
            device_id: 'device_id'
        };
        // console.log('open_id : ' + open_id)
        // console.log('group_id : ' + group_id)
        REQUEST.post('/group/delete/device', content, CODE.DeviceInexistence, done, function (err, res) {
            console.log(res)
        });
    })

    it('#delete device right', function (done) {
        content = {
            open_id: open_id,
            token: token,
            group_id: group_id,
            device_id: device_id
        };
        REQUEST.post('/group/delete/device', content, CODE.Success, done, function (err, res) {
            console.log(res)
        });
    })


    it('#change admin wrong openid', function (done) {
        content = {
            open_id: open_id,
            token: token,
            group_id: group_id,
            member_id: 'member_id'
        };
        console.log('open_id : ' + open_id)
        console.log('group_id : ' + group_id)
        REQUEST.post('/group/change/admin', content, CODE.UserInexistence, done, function (err, res) {
            console.log(res)
        });
    })

    it('#change admin right', function (done) {
        content = {
            open_id: open_id,
            token: token,
            group_id: group_id,
            member_id: member_id
        };
        console.log(content)
        REQUEST.post('/group/change/admin', content, CODE.Success, done, function (err, res) {
            console.log(res)
        });
    })

    it('#exit with right', function (done) {
        content = {
            open_id: open_id,
            token: token,
            group_id: group_id
        };
        REQUEST.post('/group/exit', content, CODE.Success, done, function (err, res) {
            // console.log(res.data[0].user_id)
            console.log(res)
        });
    })
}); 