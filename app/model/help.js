var ECmpp = require('../error'),
    DBError = ECmpp.DB,
    CODE = ECmpp.CODE,
    UtilsHelp = require('../utils/help');

/**
 *deal the database operation callback
 */
exports.Deal = function (err, res, cb) {
    if (err) { return cb(new DBError(err)); }
    cb(null, res);
};
