var DB = require('../../app/db/db');
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var CollectionSchema = new Schema({
  name: String,
  childs: [{name:String}]
});

CollectionSchema.statics.updateAndCreate = function(name, childs, cb) {
  cb = cb || function() { };
  var query = { name: name };
  var update = { childs: childs };
  var options = { upsert: true };
  this.update(query, update, options, cb);
}

/**
 * db.things.find({ children: { $elemMatch : { name:"C3", value:"C"}}}, {name:1, _id:0})
{ "Name" : "Thing1" }
 */
CollectionSchema.statics.getChild = function(name, cb) {
  var query = { childs: { $elemMatch: {name:name} } };
  this.find(query, function(err, res) {
    console.log(err);
    console.log(res);
  });
}

CollectionSchema.statics.getId = function(id, cb) {
  var query = { ids: { $elemMatch: {$eq:id} } };
  this.find(query, function(err, res) {
    console.log(err);
    console.log(res);
  });
}

var Collection = mongoose.model('Collection', CollectionSchema, 'collection');

DB.openDB(function(err, res) {
  // for(var i=0;i<20;i++){
  //   var name = 'name' + i;
  //   var a = i*10;
  //   var childs = [{name:'name'+a+1},{name:'name'+a+2},{name:'name'+a+3}];
  //   Collection.updateAndCreate(name,childs,function(err,res){

  //   });
  // }
  // Collection.getChild('name1502', function(err, res) {
  //   console.log(err);
  //   console.log(res);
  // });

  Collection.getId(151, function(err, res) {
    console.log(err);
    console.log(res);
  });
});