var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId,
    /** 异常相关 */
    ECmpp = require('../error'),
    DBError = ECmpp.DB,
    CODE = ECmpp.CODE,
    HELP = require('../utils/help');

var GradeSchema = new Schema({
    id: String,
    name: String,
    description: String,
    device_limit: Number,     //设备添加上限
    member_limit: Number,      //成员添加上限
    group_limit: Number,      //创建组上限
    join_limit: Number        //加入组上限
});


GradeSchema.statics.getDefault = function(cb) {
    cb = cb || function() { };
    var query = { name: "default" };
    this.findOne(query, function(err, res) {
        if (err) {
            return cb(new DBError(err));
        }
        if (HELP.hasValue(res)) {
            return cb(null, res);
        }
        var query = {
            id: 'String',
            name: 'default',
            description: 'default',
            device_limit: 100,     //设备添加上限
            member_limit: 100,      //成员添加上限
            group_limit: 2,      //创建组上限
            join_limit: 2        //加入组上限
        };
        this.create(query, function(err, res) {
            if (err) {
                return cb(new DBError(CODE.DBOperateWrong));
            }
            return cb(null, res);
        });
    }.bind(this));
}

GradeSchema.statics.removeAll = function(cb) {
    cb = cb || function() { };
    this.remove({}, function(err, res) {
        if (err) {
            return cb(new DBError(err));
        }
        return cb(null, res);
    });
};

module.exports = mongoose.model('Grade', GradeSchema, 'grade');
