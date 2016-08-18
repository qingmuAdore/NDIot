var express = require('express');
var router = express.Router();
var Group = require('../app/model/group.js');
var Member = require('../app/model/member.js');
var User = require('../app/model/user.js');
var HELP = require('../app/utils/help');
var Role = require('../app/model/role.js');
var NetHelp = require('../app/net').Help;
var ECmpp = require('../app/error'),
    CODE = ECmpp.CODE,
    DBError = ECmpp.DB;
var content = require('./lib/content.js');
var Listener = require('../app/utils').Listener;

/******************************* */
/*          temporary            */
/******************************* */

/**
 * all group
 */
function all(req, res, next) {
    Group.findAll(function (err, ret) {
        NetHelp(req, res, err, ret);
    });
}


/**
 * create group
 */
function createGroup(req, res, next) {
    var param = content(req);
    var open_id = param.open_id,
        token = param.token,
        name = param.name,
        description = param.description;

    User.verify(open_id, token, function (err, user) {
        if (err == null) {
            // console.log('11')
            Group.getGroups(open_id, function (err, groups) {

                if (err == null) {
                    // console.log('13')
                    if (groups.length >= 2) {
                        // console.log('1')
                        NetHelp(req, res, new DBError(CODE.GroupCreateLimit), null);
                    } else {
                        // console.log('2')
                        Group.createGroup(open_id, name, description, function (err, group) {
                            NetHelp(req, res, err, null);
                        })
                    }
                } else if (err.codeKV == CODE.GroupInexistence) {
                    Group.createGroup(open_id, name, description, function (err, group) {
                        NetHelp(req, res, err, null);
                    })
                }
                else {
                    // console.log('14')
                    NetHelp(req, res, err, null);
                }
            })

        } else {
            // console.log('12')
            NetHelp(req, res, err, null);
        }
    });

}


/**
 * group list
 */
function groupList(req, res, next) {
    var param = content(req);
    var open_id = param.open_id,
        token = param.token
    User.verify(open_id, token, function (err, user) {
        var groupList = [];
        if (err == null) {
            Member.findAll(open_id, function (err, ret) {
                if (ret.length == 0) return NetHelp(req, res, err, groupList);
                var l = new Listener(ret.length);
                ret.forEach(function (elememt) {
                    // if(elememt.group_id instal)
                    console.log(typeof elememt.group_id);
                    if (elememt.group_id == null) {
                        l.run(function () {
                            NetHelp(req, res, err, groupList);
                        });
                    } else {
                        elememt.group_id.populate('device_ids', function (err, group) {
                            groupList.push(group);
                            l.run(function () {
                                NetHelp(req, res, err, groupList);
                            });
                        });
                    }
                });
            });
        } else {
            NetHelp(req, res, err, groupList);
        }
    });
}


function deleteGroup(req, res, next) {
    var param = content(req);
    var open_id = param.open_id,
        token = param.token,
        group_id = param.group_id


    User.verify(open_id, token, function (err, user) {
        if (err == null) {
            Group.deleteGroup(group_id, open_id, function (err, group) {
                NetHelp(req, res, err, null);
            })
        } else {
            NetHelp(req, res, err, null);
        }
    });

}


function changeAdmin(req, res, next) {
    var param = content(req);
    var open_id = param.open_id,
        token = param.token,
        group_id = param.group_id,
        member_id = param.member_id

    User.verify(open_id, token, function (err, user) {
        if (err == null) {

            //如果member_id已经创建了两个组，则是非法操作
            Group.find({ open_id: member_id }, function (err, groups) {
                if (err == null) {
                    if (groups.length >= 2) {
                        NetHelp(req, res, new DBError(CODE.GroupCreateLimit), null);
                    } else {
                        Group.changeAdmin(group_id, open_id, member_id, function (err, group) {
                            NetHelp(req, res, err, null);
                        })
                    }
                }
                else {
                    console.log(err)
                    NetHelp(req, res, err, null);
                }
            })

        } else {
            NetHelp(req, res, new DBError(CODE.DBOperateWrong), null);
        }
    });
}

function addUser(req, res, next) {
    var param = content(req);
    var open_id = param.open_id,
        token = param.token,
        group_id = param.group_id,
        member_id = param.member_id,
        nickname = param.nickname

    User.verify(open_id, token, function (err, user) {
        if (err == null) {
            Role.getDefault(function (err, ret) {
                if (err == null) {
                    Group.addMember(group_id, open_id, member_id, nickname, res._id, function (err, group) {
                        NetHelp(req, res, err, null);
                    })
                } else {
                    NetHelp(req, res, err, null);
                }
            });
        } else {
            NetHelp(req, res, err, null);
        }
    });
}

function deleteUser(req, res, next) {
    var param = content(req);
    var group_id = param.group_id,
        member_id = param.member_id,
        open_id = param.open_id,
        token = param.token
    User.verify(open_id, token, function (err, user) {
        if (err == null) {
            Group.deleteMember(group_id, open_id, member_id, function (err, group) {
                NetHelp(req, res, err, null);
            })
        } else {
            NetHelp(req, res, err, null);
        }
    })

}

function addDevice(req, res, next) {
    var param = content(req);
    var group_id = param.group_id,
        open_id = param.open_id,
        token = param.token,
        device_id = param.device_id
    User.verify(open_id, token, function (err, user) {
        if (err == null) {
            Group.addDevice(group_id, open_id, device_id, function (err, group) {
                NetHelp(req, res, err, null);
            })
        } else {
            NetHelp(req, res, err, null);
        }
    })

}

function deleteDevice(req, res, next) {
    var param = content(req);
    var group_id = param.group_id,
        open_id = param.open_id,
        token = param.token,
        device_id = param.device_id
    User.verify(open_id, token, function (err, user) {
        if (err == null) {
            Group.deleteDevice(group_id, open_id, device_id, function (err, group) {
                NetHelp(req, res, err, null);
            })
        } else {
            NetHelp(req, res, err, null);
        }
    })
}

function info(req, res, next) {
    var param = content(req);
    var group_id = param.group_id,
        open_id = param.open_id,
        token = param.token
    User.verify(open_id, token, function (err, user) {
        if (err == null) {
            Group.findOne({ id: group_id })
                .populate('device_ids')
                .exec(function (err, group) {
                    if (err) {
                        return NetHelp(req, res, new DBError(CODE.DBOperateWrong), null);
                    }
                    if (!HELP.hasValue(group)) {
                        return NetHelp(req, res, new DBError(CODE.GroupInexistence), null);
                    }

                    Member.findOne({ user_id: user._id, group_id: group._id }, function (err, member) {
                        if (err) {
                            return NetHelp(req, res, new DBError(CODE.DBOperateWrong), null);
                        }
                        if (!HELP.hasValue(res)) {
                            return NetHelp(req, res, new DBError(CODE.NotGroupMember), null);
                        }
                        group.device_ids.forEach(function (elememt) {
                            delete elememt._doc.key;
                        });
                        NetHelp(req, res, err, group);
                    })
                })
        } else {
            NetHelp(req, res, err, null);
        }
    })

}

function memberList(req, res, next) {
    var param = content(req);
    var group_id = param.group_id,
        open_id = param.open_id,
        token = param.token
    User.verify(open_id, token, function (err, user) {
        if (err == null) {
            Group.findOne({ id: group_id }, function (err, group) {
                if (err) {
                    NetHelp(req, res, new DBError(CODE.DBOperateWrong), []);
                }
                if (!HELP.hasValue(group)) {
                    return NetHelp(req, res, new DBError(CODE.GroupInexistence), []);
                }
                // console.log(group._id)
                // console.log(user._id)
                Member.findOne({ group_id: group._id, user_id: user._id }, function (err, member) {
                    if (err) {
                        NetHelp(req, res, new DBError(CODE.DBOperateWrong), []);
                    }
                    if (!HELP.hasValue(member)) {
                        return NetHelp(req, res, new DBError(CODE.NotGroupMember), []);
                    }
                    Member.find({ group_id: group._id })
                        .populate('group_id')
                        .populate('user_id')
                        .populate('role_id')
                        .exec(function (err, members) {
                            if (err) {
                                NetHelp(req, res, new DBError(CODE.DBOperateWrong), []);
                            }
                            if (members.length == 0) return NetHelp(req, res, err, members);
                            var l = new Listener(members.length);
                            members.forEach(function (elememt) {
                                // delete elememt._doc.user_id._doc._id;
                                delete elememt._doc.user_id._doc.token;
                                delete elememt._doc.user_id._doc.email;
                                delete elememt._doc.user_id._doc.email_verified;
                                delete elememt._doc.user_id._doc.zone;
                                delete elememt._doc.user_id._doc.mobile_number;
                                delete elememt._doc.user_id._doc.mobile_verified;
                                delete elememt._doc.user_id._doc.password;
                                delete elememt._doc.user_id._doc.grade_id;
                                elememt.group_id.populate('device_ids', function (err, group) {
                                    elememt.group_id = group;
                                    l.run(function () {
                                        NetHelp(req, res, err, members);
                                    });
                                });

                            });

                        })
                })
            })
        } else {
            NetHelp(req, res, err, []);
        }
    })
}

var exit = function (req, res, next) {
    var param = content(req);
    var group_id = param.group_id,
        open_id = param.open_id,
        token = param.token
    User.verify(open_id, token, function (err, user) {
        if (err == null) {
            Group.findOne({ id: group_id }, function (err, group) {
                if (err) {
                    NetHelp(req, res, new DBError(CODE.DBOperateWrong), null);
                }
                if (!HELP.hasValue(group)) {
                    return NetHelp(req, res, new DBError(CODE.GroupInexistence), null);
                }
                /**
                 *  group leader cannot exit the group 
                 */
                if (group.open_id == user.open_id) {
                    return NetHelp(req, res, new DBError(CODE.IllegalOperation));
                }
                Member.remove({ group_id: group._id, user_id: user._id }, function (err) {
                    if (err) {
                        NetHelp(req, res, new DBError(CODE.DBOperateWrong), null);
                    }
                    NetHelp(req, res, err, null);
                })
            })
        } else {
            NetHelp(req, res, err, null);
        }
    })
}

router.route('/all').get(all).post(all);
router.route('/create').get(createGroup).post(createGroup);
router.route('/list').get(groupList).post(groupList);
router.route('/delete').get(deleteGroup).post(deleteGroup);
router.route('/change/admin').get(changeAdmin).post(changeAdmin);
router.route('/add/user').get(addUser).post(addUser);
router.route('/delete/user').get(deleteUser).post(deleteUser);
router.route('/add/device').get(addDevice).post(addDevice);
router.route('/delete/device').get(deleteDevice).post(deleteDevice);
router.route('/info').get(info).post(info);
router.route('/members').get(memberList).post(memberList);
router.route('/exit').get(exit).post(exit);

module.exports = router;
