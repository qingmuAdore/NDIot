var database = require('../../app/db/db');
var mongoose = require('mongoose');
var user     = require('../../app/model/user');
var async    = require('async');

var openId  = 'test openId';
var token   = 'test token';
var time    = 1;

database.openDB(function(err, res) {
    // var i = 0;
    // for( i=0;i<100;i++){
    //   User.updateAndCreate()
    // }


    // User.verify(openId, token, function(err, res) {
    //   console.log(err);
    //   console.log(res);
    // })
    // User.get(openId + 'wrong', function(err, res) {
    //   console.log(err);
    //   console.log(res);
    // });


    // User.get(openId, function(err, res) {
    //   console.log(err);
    //   console.log(res);
    // });
    
    var zone     = "86";
    var phone    = "13800138000";
    var name     = "China Mobile";
    var password = "66668888";
    var openId   = null;
    
    var userInfo = { openId: openId, token: token };
    
    async.waterfall([
        function(callback) {
            user.create(userInfo, function(err, res) {
                console.log('create');
                callback(err, res);
            });
        },
             
        function(data, callback) {   
            user.remove({ mobile_number: phone }, function(err, res) {
                callback(err, res);
            }); 
        }, 
        
        function(data, callback) {
            user.register(zone, phone, name, password, function(err, res) {
                console.log('register', err, res);
                
                openId = res.open_id;
                callback(err, res);
            });
        },
        
        function(data, callback) {
            console.log('get');
            user.get(openId, function(err, res) {
                console.log(res);
                callback(err, res);
            });
        },     
     
        function(data, callback) {
            console.log('login');
            user.login(zone, phone, password, function(err, res) {
                console.log(res);
                callback(err, res);
            });
        },      
          
        
        function(data, callback) {
            console.log('findAll');
            user.findAll(function(err, res) {
                console.log(res);
                callback(err, res);
            });
        }, 
        
        function(data, callback) {
            console.log('remove');
            user.remove({ token: token }, function(err, res) {
                callback(err, res);
            });
        }, 
        
        function(data, callback) {   
            user.remove({ mobile_number: phone }, function(err, res) {
                callback(err, res);
            }); 
        }, 
        
        function(error, result) {
            //console.log(error);
        }
    ]); 
 
 
});

