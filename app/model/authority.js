var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId,
    /** 异常相关 */
    ECmpp = require('../error'),
    DBError = ECmpp.DB,
    CODE = ECmpp.CODE,
    HELP = require('../utils/help');

var AuthoritySchema = new Schema({
    id: String,
    name: String,
    description: String
});


/**
 * add authority
 */
AuthoritySchema.statics.add = function(name, description, cb) {
    var query = { name: name };
    this.findOne(query, function(err, res) {
        if (err) {
            return cb(new DBError(CODE.DBOperateWrong));
        }
        if (HELP.hasValue(res)) {
            return cb(new DBError(CODE.AuthorityExist));
        }
        var doc = {
            id: HELP.uuid(),
            name: name,
            description: description,
        }
        this.create(doc, function(err, res) {
            if (err) {
                return cb(new DBError(CODE.DBOperateWrong));
            }
            return cb(null, res);
        });
    }.bind(this));
}


/**
 * modify description
 * 
 * #cb {name,description}
 */
AuthoritySchema.statics.modify = function(name, description, cb) {
    var query = { name: name };
    this.findOne(query, function(err, res) {
        if (err) {
            return cb(new DBError(CODE.DBOperateWrong));
        }
        if (!HELP.hasValue(res)) {
            return cb(new DBError(CODE.AuthorityInexistence));
        }
        this.update(name, description, function(err, res) {
            if (err) {
                return cb(new DBError(CODE.DBOperateWrong));
            }
            cb(null, { name: name, description: description });
        });
    }.bind(this));
}

/**
 * delete authority
 */
AuthoritySchema.statics.delete = function(name, cb) {
    var query = { name: name };
    this.findOne(query, function(err, res) {
        if (err) {
            return cb(new DBError(CODE.DBOperateWrong));
        }
        if (!HELP.hasValue(res)) {
            return cb(new DBError(CODE.AuthorityInexistence));
        }
        this.remove(query, function(err, res) {
            if (err) {
                return cb(new DBError(CODE.DBOperateWrong));
            }
            return cb(null, res);
        });
    }.bind(this));
}


/**
 * if exist update or not exist create
 * 
 * #cb {name,description}
 */
AuthoritySchema.statics.updateAndCreate = function(name, description, cb) {
    cb = cb || function() { };
    var query = { name: name };
    var update = { description: description };
    var options = { upsert: true };
    this.update(query, update, options, function(err, res) {
        if (err) {
            return cb(new DBError(CODE.DBOperateWrong));
        }
        cb(null, { name: name, description: description });
    });
}

AuthoritySchema.statics.removeAll = function(cb) {
    cb = cb || function() { };
    this.remove({}, function(err, res) {
        if (err) {
            return cb(new DBError(err));
        }
        return cb(null, res);
    });
};

module.exports = mongoose.model('Authority', AuthoritySchema, 'authority');