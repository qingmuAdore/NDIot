var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId,
    /** 异常相关 */
    ECmpp = require('../error'),
    DBError = ECmpp.DB,
    CODE = ECmpp.CODE,
    HELP = require('../utils/help');
var Authority = require('./authority.js');

var RoleSchema = new Schema({
    id: String,
    name: String,
    authority_ids: [{ type: ObjectId, ref: 'Authority' }]
});

RoleSchema.statics.getDefault = function (cb) {
    cb = cb || function () { };
    var query = { name: "default" };
    this.findOne(query, function (err, res) {
        if (err) {
            return cb(new DBError(err));
        }
        if (HELP.hasValue(res)) {
            return cb(null, res);
        }
        var doc = {
            id: 'String',
            name: 'default',
            // authority_ids: new mongoose.Types.ObjectId
        };
        this.create(doc, function (err, res) {
            if (err) {
                return cb(new DBError(CODE.DBOperateWrong));
            }
            return cb(null, res);
        });
    }.bind(this));
}

RoleSchema.statics.getAdmin = function (cb) {
    cb = cb || function () { };
    var query = { name: "admin" };
    this.findOne(query, function (err, res) {
        if (err) {
            return cb(new DBError(err));
        }
        if (HELP.hasValue(res)) {
            return cb(null, res);
        }
        var doc = {
            id: 'String',
            name: 'admin',
            // authority_ids: new mongoose.Types.ObjectId
        };
        this.create(doc, function (err, res) {
            if (err) {
                return cb(new DBError(CODE.DBOperateWrong));
            }
            return cb(null, res);
        });
    }.bind(this));
}


RoleSchema.statics.exist = function (id, cb) {
    var query = { id: id };
    this.findOne(query, function (err, res) {
        if (err) {
            return cb(new DBError(err));
        }
        if (!HELP.hasValue(res)) {
            return cb(new DBError(CODE.RoleInexistence));
        }
        return cb(null, res);
    });
};

RoleSchema.statics.addAuthority = function (id, authorityId, cb) {
    this.exist(id, function (err, role) {
        if (err) {
            return cb(err);
        }
        Authority.findOne({ id: authorityId }, function (err, res) {
            if (err) {
                return cb(err);
            }
            if (!HELP.hasValue(res)) {
                return cb(CODE.AuthorityInexistence);
            }
            var index = role.authority_ids.indexOf(res._id);
            if (index != -1) {
                return cb(new DBError(CODE.AuthorityAlreadyJoin));
            } else {
                role.authority_ids.push(res._id);
                role.save(function (err, role) {
                    if (err) return cb(new DBError(CODE.DBOperateWrong))
                    else {
                        return cb(null, role)
                    }
                });
            }
        }.bind(this));
    }.bind(this));
}

RoleSchema.statics.deleteAuthority = function (id, authorityId, cb) {
    this.exist(id, function (err, role) {
        if (err) {
            return cb(err);
        }
        Authority.findOne({ id: authorityId }, function (err, res) {
            if (err) {
                return cb(err);
            }
            if (!HELP.hasValue(res)) {
                return cb(new DBError(CODE.AuthorityExist));
            }
            var index = role.authority_ids.indexOf(res._id);
            if (index == -1) {
                return cb(new Error(CODE.AuthorityNotJoin));
            } else {
                role.authority_ids.splice(index, 1);
                role.save(function (err, role) {
                    if (err) return cb(new DBError(CODE.DBOperateWrong))
                    else {
                        return cb(null, role)
                    }
                });
            }
        }.bind(this));
    }.bind(this));
}

RoleSchema.statics.removeAll = function (cb) {
    cb = cb || function () { };
    this.remove({}, function (err, res) {
        if (err) {
            return cb(new DBError(err));
        }
        return cb(null, res);
    });
};

module.exports = mongoose.model('Role', RoleSchema, 'role');
