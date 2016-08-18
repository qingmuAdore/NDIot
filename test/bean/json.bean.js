var Utils = require('../../app/utils'),
    Help = Utils.HELP;

var doc = {
    id: 'deviceId',
    token: 'deviceToken',
    state: {
        reported: {
            color: 'red',
            size: 13,
        }
    },
    version: 135,
};

var jstr = Help.jstr(doc);
console.log(jstr);

var pdoc = Help.parse(jstr);
console.log(pdoc.state);
console.log(pdoc.state.reported);
console.log(pdoc.state.reported.color);

var array = new Array();
array.push(doc);
array.push(doc);

var obj = { state: array };
console.log(obj);
