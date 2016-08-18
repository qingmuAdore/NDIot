var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId,
    /** 异常相关 */
    ECmpp = require('../error'),
    DBError = ECmpp.DB,
    CODE = ECmpp.CODE,
    User = require('./user.js'),
    HELP = require('../utils/help');

var MemberSchema = new Schema({
    group_id: { type: ObjectId, ref: 'Group' },
    user_id: { type: ObjectId, ref: 'User' },                //用户id
    nick_name: String,
    role_id: { type: ObjectId, ref: 'Role' }
});
// var MemberSchema = new Schema({
//     group_id: String,
//     user_id: String,                //用户id
//     nick_name: String,
//     role_id: String,
// });


MemberSchema.statics.add = function (group_objectId, user_objectId, nick_name, role_id, cb) {
    this.findOne({ group_id: group_objectId, user_id: user_objectId }, function (err, res) {
        if (err) {
            return cb(new DBError(CODE.DBOperateWrong));
        }
        if (!HELP.hasValue(res)) {
            var doc = {
                group_id: group_objectId,
                user_id: user_objectId,                //用户id
                nick_name: nick_name || 'default',
                role_id: role_id
            };
            this.create(doc, function (err, res) {
                if (err) {
                    return cb(new DBError(CODE.DBOperateWrong));
                } else {
                    return cb(null, res);
                }
            });
        } else {
            return cb(null, res);
        }
    }.bind(this))
}

MemberSchema.statics.delete = function (group_objectId, user_objectId, cb) {
    this.findOne({ group_id: group_objectId, user_id: user_objectId }, function (err, res) {
        if (err) {
            return cb(new DBError(CODE.DBOperateWrong));
        }
        if (HELP.hasValue(res)) {
            res.remove(function (err) {
                if (err) {
                    return cb(new DBError(CODE.DBOperateWrong));
                }
                cb(null, res);
            })
        } else {
            cb(new DBError(CODE.NotGroupMember));
        }
    }.bind(this))
}


/**
 * #group_id ObjectId
 * #open_id ObjectId
 */
MemberSchema.static.exist = function (group_id, open_id, cb) {
    var query = { group_id: group_id, open_id: open_id };
    this.findOne(query, function (err, res) {
        if (err) return cb(new DBError(err));
        if (!HELP.hasValue(res)) return cb(DBError(CODE.NotGroupMember));
        return (null, res);
    });
}

/**
 * find all
 */
MemberSchema.statics.findAll = function (user_id, cb) {
    User.get(user_id, function (err, res) {
        if (err != null) {
            return cb(err);
        }
        console.log('hh')
        this.find({ user_id: res._id })
            .populate('group_id')
            .populate('role_id')
            .exec(function (err, list) {
                if (err) {
                    return cb(new DBError(CODE.DBOperateWrong));
                }
                return cb(null, list)
            })
    }.bind(this))
}


MemberSchema.statics.removeAll = function (cb) {
    cb = cb || function () { };
    this.remove({}, function (err, res) {
        if (err) {
            return cb(new DBError(err));
        }
        return cb(null, res);
    });
};

MemberSchema.statics.removeWithId = function (group_id, cb) {
    cb = cb || function () { };
    this.remove({ group_id: group_id }, function (err, res) {
        if (err) {
            return cb(new DBError(err));
        }
        return cb(null, res);
    });
};

module.exports = mongoose.model('Member', MemberSchema, 'member');
