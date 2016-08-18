var mongoose = require('mongoose'),
config = require('../../config');

exports.openDB = function(callback) {
   callback = callback || function() {};

   var connection = mongoose.connection;
   connection.on('error', console.error.bind(console, 'mongodb connection error'));
   connection.once('open', function() {
      console.log('mongodb connected.')
   });

   var url = process.env.MONGO || config.db.url;
   console.log('mongodb connect ' + url);

   mongoose.connect(url, function(err) {
      if (err) {
         console.log('mongodb connect error: ' + err);
         process.exit(-1);
         return
      }

      console.log('mongodb connecting...');
      callback(err);
   });
}

exports.closeDB = function(callback) {
   callback = callback || function() {};
   mongoose.disconnect(callback);
}

