/**
 * group leader share the group to member and manager the device
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId,
    /** 异常相关 */
    ECmpp = require('../error'),
    DBError = ECmpp.DB,
    HELP = require('../utils/help'),
    User = require('./user.js'),
    Device = require('./device.js'),
    Member = require('./member.js'),
    Role = require('../../app/model/role.js'),
    CODE = ECmpp.CODE;

var GroupSchema = new Schema({
    id: String,
    open_id: String,//群主
    name: String,
    description: String,
    device_ids: [{ type: ObjectId, ref: 'Device' }]
});

GroupSchema.statics.createGroup = function (open_id, name, description, cb) {
    cb = cb || function () { };
    User.get(open_id, function (err, res) {
        if (err != null) {
            return cb(err);
        }
        var doc = {
            id: HELP.uuid(),
            open_id: open_id,//群主
            name: name,
            description: description
        };

        this.create(doc, function (err, res) {
            if (err) {
                return cb(new DBError(CODE.DBOperateWrong));
            }

            Role.getAdmin(function (err, role) {
                if (err != null) {
                    return cb(err);
                }
                this.addMember(res.id, open_id, open_id, 'admin', role._id, function (err, r) {
                    console.log('hsps')
                    if (err != null) {
                        return cb(err);
                    }
                    console.log('hspsss')
                    return cb(null, res);
                })
            }.bind(this))

        }.bind(this));
        // }
        // }.bind(this))
    }.bind(this))
}

/**
 * is group leader
 */
GroupSchema.statics.isLeader = function (group_id, open_id, cb) {
    this.get(group_id, function (err, res) {
        if (err) return cb(err);
        if (res.open_id != open_id) {
            return cb(new DBError(CODE.NotGroupAdmin));
        }
        return cb(null, res);
    });
}

/**
 * is group member (not leader)
 */
GroupSchema.statics.isMember = function (group_id, open_id, cb) {
    
}


GroupSchema.statics.deleteGroup = function (group_id, open_id, cb) {
    cb = cb || function () { };
    this.get(group_id, function (err, res) {
        if (err != null) {
            return cb(err);
        }
        if (open_id != res.open_id) {
            return cb(new DBError(CODE.NotGroupAdmin));
        }
        res.remove(function (err) {
            if (err) {
                return cb(new DBError(CODE.DBOperateWrong));
            }
            Member.removeWithId(res._id, function (err, member) {
                if (err != null) {
                    return cb(err);
                }
                return cb(null, res);
            })
        })
    }.bind(this));
}

GroupSchema.statics.changeAdmin = function (group_id, open_id, other_open_id, cb) {
    cb = cb || function () { };
    if (other_open_id == open_id) {
        return cb(new DBError(CODE.IllegalOperation))
    }
    this.get(group_id, function (err, group) {
        if (err != null) {
            return cb(err);
        }
        if (open_id != group.open_id) {
            return cb(new DBError(CODE.NotGroupAdmin));
        }

        User.get(other_open_id, function (err, user) {
            if (err != null) {
                return cb(err);
            }
            if (user == null) {
                return cb(new DBError(CODE.UserInexistence))
            }
            //修改group表的open_id信息
            group.open_id = other_open_id
            group.save(function (err, ress) {
                console.log('-1')
                if (err) return cb(new DBError(CODE.DBOperateWrong))
                // return cb(null, ress)
                else {
                    console.log(group._id)
                    Member.findOne({ group_id: group._id, user_id: user._id }, function (err, member) {
                        if (err) {
                            console.log('1')
                            return cb(new DBError(CODE.DBOperateWrong));
                        }
                        if (member == null) {
                            //如果没有在组内 则创建它   
                            console.log('22')
                            Role.getAdmin(function (err, role) {
                                if (err != null) {
                                    console.log('3')
                                    return cb(err);
                                }
                                console.log('4')
                                Member.add(group._id, user._id, 'admin', role._id, function (err, res) {
                                    if (err != null) {
                                        return cb(err);
                                    }
                                    console.log('5')
                                    return cb(null, res)
                                })
                            })
                        } else {
                            console.log('6')
                            return cb(null, null)
                        }
                    })
                    // return cb(null, res)
                }
            })
        }.bind(this))
    }.bind(this));
}

GroupSchema.statics.addDevice = function (group_id, open_id, device_id, cb) {
    cb = cb || function () { };
    this.get(group_id, function (err, res) {
        if (err != null) {
            return cb(err);
        }
        if (open_id != res.open_id) {
            return cb(new DBError(CODE.NotGroupAdmin));
        }

        Device.findOne({ id: device_id }, function (err, device) {
            if (err) {
                return cb(new DBError(CODE.DBOperateWrong));
            }
            if (!HELP.hasValue(device)) {
                return cb(new DBError(CODE.DeviceInexistence));
            }
            var index = res.device_ids.indexOf(device._id);
            /** judge the device is in the group? */
            if (index != -1) {
                return cb(new DBError(CODE.DeviceAlreadyJoin));
            } else {
                res.device_ids.push(device._id)
                res.save(function (err, res) {
                    if (err) return cb(new DBError(CODE.DBOperateWrong))
                    else {
                        return cb(null, res)
                    }
                });
            }
        }.bind(this));
    }.bind(this))
}

GroupSchema.statics.deleteDevice = function (group_id, open_id, device_id, cb) {
    cb = cb || function () { };
    this.get(group_id, function (err, res) {
        if (err != null) {
            return cb(err);
        }
        if (open_id != res.open_id) {
            return cb(new DBError(CODE.NotGroupAdmin));
        }

        Device.findOne({ id: device_id }, function (err, device) {
            if (err) {
                return cb(new DBError(CODE.DBOperateWrong));
            }
            if (!HELP.hasValue(device)) {
                return cb(new DBError(CODE.DeviceInexistence));
            }
            var devices = []
            var isExistDevice = false
            res.device_ids.forEach(function (element) {
                // console.log('hsp')
                // console.log(element)
                // console.log(device._id)
                if (device._id.toString() != element.toString()) {
                    // console.log('device._id != element')
                    devices.push(element)
                } else {
                    // console.log('device._id == element')
                    isExistDevice = true
                }
            }, this);

            if (isExistDevice) {
                res.device_ids = devices
                res.save(function (err, res) {
                    if (err) return cb(new DBError(CODE.DBOperateWrong))
                    else {
                        return cb(null, res)
                    }
                })
            } else {
                return cb(new DBError(CODE.NotGroupDevice))
            }
        }.bind(this));
    }.bind(this))
}

GroupSchema.statics.addMember = function (group_id, open_id, member_open_id, nickname, role, cb) {
    cb = cb || function () { };
    this.get(group_id, function (err, group) {
        if (err != null) {
            return cb(err);
        }
        if (open_id != group.open_id) {
            return cb(new DBError(CODE.NotGroupAdmin));
        }

        User.get(member_open_id, function (err, member_user) {
            if (err != null) {
                return cb(err);
            }
            Member.add(group._id, member_user._id, nickname, role, function (err, res) {
                if (err != null) {
                    return cb(err);
                }
                return cb(null, res)
            })
        })
    });
}



GroupSchema.statics.deleteMember = function (group_id,open_id, member_open_id, cb) {
    cb = cb || function () { };
    this.get(group_id, function (err, group) {
        if (err != null) {
            return cb(err);
        }
        if (group.open_id == member_open_id) {
            return cb(new DBError(CODE.IllegalOperation));
        }
        User.get(member_open_id, function (err, member_user) {
            if (err != null) {
                return cb(err);
            }

            Member.delete(group._id, member_user._id, function (err, res) {
                if (err != null) {
                    return cb(err);
                }
                return cb(null, res)
            })
        })
    });
}


GroupSchema.statics.getGroups = function (open_id, cb) {
    this.find({ open_id: open_id }, function (err, groups) {
        if (err) {
            // console.log('hsp getgroups err')
            return cb(new DBError(CODE.DBOperateWrong));
        }
        if (!HELP.hasValue(groups)) {
            return cb(new DBError(CODE.GroupInexistence));
        }
        // console.log('hsp getgroups success')
        cb(null, groups);
    })
}

/**
 *  get value
 */
GroupSchema.statics.get = function (group_id, cb) {
    cb = cb || function () { };
    var query = { id: group_id };
    this.findOne(query, function (err, res) {
        if (err) {
            return cb(new DBError(CODE.DBOperateWrong));
        }
        if (!HELP.hasValue(res)) {
            return cb(new DBError(CODE.GroupInexistence));
        }

        cb(null, res);
    });
}


/**
 * getAll
 */
GroupSchema.statics.findAll = function (cb) {
    cb = cb || function () { };
    this.find({})
        .populate('device_ids')
        .exec(function (err, res) {
            if (err) {
                return cb(new DBError(err));
            }
            return cb(null, res);
        });
};

/**
 * remove all
 */
GroupSchema.statics.removeAll = function (cb) {
    cb = cb || function () { };
    this.remove({}, function (err, res) {
        if (err) {
            return cb(new DBError(err));
        }
        return cb(null, res);
    });
};

module.exports = mongoose.model('Group', GroupSchema, 'groups');