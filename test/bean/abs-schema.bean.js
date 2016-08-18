var Mongoose = require('mongoose'),
    Schema = Mongoose.Schema;
var AbsSchema = require('../../app/model/abstract.js');

var TempSchema = new AbsSchema({
    name:String
});

var Temp = Mongoose.model('Temp',TempSchema,'temp');

// Temp.showValue();
// var temp = new Temp({name:'name'});
temp.showValue();